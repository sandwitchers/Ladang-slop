/**
 * Summarization pipeline.
 *
 * Orchestrates the full cycle:
 *   1. maybeSummarizeTurns  — triggered on new messages; decides whether to
 *      summarize a batch, run catchup, or skip.
 *   2. summarizeOneBatch     — summarizes the oldest N eligible turns into a
 *      Layer 0 snippet, ghosts them, and triggers layer promotion.
 *   3. runCatchup            — processes a large backlog in a loop with a
 *      cancelable progress toast.
 *   4. showCatchupDialog     — asks the user how to handle a large backlog.
 *
 * The pipeline is driven by the engine context (host client, settings,
 * store, message buffer) and is completely UI-agnostic. The Vue layer calls
 * `forceSummarize`, `stopSummarization`, and `clearMemory` on the engine
 * API; everything else is automatic.
 */

import type { HostClient } from '../host/client';
import { executeSlashCommand, saveChat } from '../host/st-bridge';
import { toastClear, toastError, toastInfo, toastSuccess, toastWarning } from '../host/st-bridge';
import type { SummaryceptionSettings } from '../settings/defaults';
import type { ChatStore, Snippet } from '../store/chat-store';
import { buildFullContext } from './passage';
import { buildPassageFromRange } from './passage';
import { ghostMessage, ghostMessagesUpTo, unghostAllMessages } from './ghosting';
import { updateInjection } from './injection';
import {
    getMessageBuffer,
    getVisibleAssistantTurns,
    invalidateMessageBuffer,
    type AssistantTurn,
    type MessageBuffer,
} from './messages';
import { maybePromoteLayer } from './promotion';
import { abortSummarization, callSummarizer, isAborting } from './summarizer';

const MODULE_NAME = 'summaryception';

function log(settings: SummaryceptionSettings, ...args: unknown[]): void {
    if (settings.debugMode) console.log(`[${MODULE_NAME}]`, ...args);
}

function trace(settings: SummaryceptionSettings, ...args: unknown[]): void {
    if (settings.debugMode && settings.traceMode) {
        const normalized = args.map((arg, idx) =>
            idx === 0 && typeof arg === 'string' ? arg.toUpperCase() : arg,
        );
        console.log(`[${MODULE_NAME}]`, '[TRACE]', ...normalized);
    }
}

// ─── Engine state ─────────────────────────────────────────────────────

let isSummarizing = false;
let catchupDismissed = false;

export function getIsSummarizing(): boolean {
    return isSummarizing;
}

export function stopSummarization(settings: SummaryceptionSettings): void {
    abortSummarization(settings);
    isSummarizing = false;
}

// ─── Main entry: maybeSummarizeTurns ──────────────────────────────────

export interface EngineContext {
    host: HostClient;
    settings: SummaryceptionSettings;
    store: ChatStore;
}

/**
 * Check whether summarization is needed, and if so, run one batch or trigger
 * the catchup dialog.
 *
 * Called automatically on every new assistant message (via the
 * MESSAGE_RECEIVED event) and manually via the Force Summarize button.
 */
export async function maybeSummarizeTurns(ctx: EngineContext): Promise<void> {
    const { settings, store } = ctx;
    if (!settings.enabled) return;
    if (settings.pauseSummarization) return;
    if (isSummarizing) return;

    const buffer = await getMessageBuffer(ctx.host);
    const ghostedSet = new Set(store.state.ghostedIndices);

    const visibleTurns = await getVisibleAssistantTurns(
        buffer,
        0,
        ghostedSet,
        { scanLimit: settings.verbatimTurns * 10 + 100 },
    );

    log(
        settings,
        `Visible assistant turns: ${visibleTurns.length}, limit: ${settings.verbatimTurns}`,
    );

    if (visibleTurns.length <= settings.verbatimTurns) return;

    const overflow = visibleTurns.length - settings.verbatimTurns;
    const backlogThreshold = settings.turnsPerSummary * 2;

    // ─── Backlog detection ───
    if (overflow > backlogThreshold && !catchupDismissed) {
        log(settings, `Large backlog detected: ${overflow} turns over limit`);
        const batchesNeeded = Math.ceil(overflow / settings.turnsPerSummary);
        const choice = await showCatchupDialog(overflow, batchesNeeded, settings);

        if (choice === 'skip') {
            const cutoff = visibleTurns[visibleTurns.length - settings.verbatimTurns - 1];
            if (cutoff) {
                store.state.summarizedUpTo = cutoff.index;
                log(settings, `Skipped backlog. summarizedUpTo set to ${store.state.summarizedUpTo}`);
            }
            catchupDismissed = true;
            await store.save(ctx.host.getCurrentChatHandle());
            return;
        }
        if (choice === 'catchup') {
            await runCatchup(ctx, visibleTurns, overflow);
            return;
        }
        if (choice === 'partial') {
            await summarizeOneBatch(ctx, visibleTurns, buffer);
            return;
        }
        return;
    }

    // ─── Normal: single batch ───
    const success = await summarizeOneBatch(ctx, visibleTurns, buffer);
    if (!success) {
        log(settings, 'Batch failed, stopping cycle to avoid retry loop.');
        return;
    }

    // Check if we should process another batch immediately.
    const ghostedSet2 = new Set(store.state.ghostedIndices);
    const remaining = await getVisibleAssistantTurns(buffer, 0, ghostedSet2, {
        scanLimit: settings.verbatimTurns * 10 + 100,
    });
    if (
        remaining.length > settings.verbatimTurns &&
        remaining.length - settings.verbatimTurns <= backlogThreshold
    ) {
        await maybeSummarizeTurns(ctx);
    }
}

// ─── Single batch ─────────────────────────────────────────────────────

/**
 * Summarize one batch of the oldest eligible (unsummarized) visible turns.
 *
 * Returns true if a snippet was created (or the pointer advanced past an
 * empty range). Returns false if the batch failed and should be retried
 * later. Returns 'EMPTY_SKIP' (string) for the catchup loop to distinguish
 * "skipped empty range" from "actual failure".
 */
export async function summarizeOneBatch(
    ctx: EngineContext,
    visibleTurns: AssistantTurn[],
    buffer: MessageBuffer,
): Promise<boolean | 'EMPTY_SKIP'> {
    trace(ctx.settings, '>>> ENTERING summarizeOneBatch');
    trace(ctx.settings, '  visibleTurns:', visibleTurns?.length ?? 0);

    const { settings, store } = ctx;

    // Filter to turns that are after summarizedUpTo.
    const eligible = visibleTurns.filter((t) => t.index > store.state.summarizedUpTo);
    trace(ctx.settings, '  eligibleTurns after filtering:', eligible.length);

    if (eligible.length === 0) {
        // All visible turns are already summarized — repair ghosting for any
        // that should be hidden but aren't.
        log(ctx.settings, 'All visible turns are already summarized — repairing ghosting...');
        const toGhost = visibleTurns.filter((t) => t.index <= store.state.summarizedUpTo);
        for (const t of toGhost) {
            await ghostMessage(store, buffer, settings, t.index);
        }
        await store.save(ctx.host.getCurrentChatHandle());
        trace(ctx.settings, '<<< EXITING summarizeOneBatch - REPAIRED GHOSTING');
        return false;
    }

    const batchSize = Math.min(settings.turnsPerSummary, eligible.length);
    const batch = eligible.slice(0, batchSize);
    if (batch.length === 0) {
        trace(ctx.settings, '<<< EXITING summarizeOneBatch - EMPTY BATCH');
        return false;
    }

    isSummarizing = true;
    try {
        const startIdx = batch[0]!.index;
        const endIdx = batch[batch.length - 1]!.index;
        trace(ctx.settings, '  startIdx:', startIdx, 'endIdx:', endIdx);
        trace(ctx.settings, '  store.summarizedUpTo:', store.state.summarizedUpTo);

        log(ctx.settings, `Summarizing ${batch.length} assistant turns (indices ${startIdx}–${endIdx})`);

        // Ensure Layer 0 exists.
        if (!store.state.layers[0]) {
            store.state.layers.push([]);
        }

        const passageStart = store.state.summarizedUpTo < 0 ? 0 : store.state.summarizedUpTo + 1;

        // Sanity check.
        if (passageStart > endIdx) {
            log(
                ctx.settings,
                `ERROR: passageStart (${passageStart}) > endIdx (${endIdx}). Batch already summarized?`,
            );
            trace(ctx.settings, '<<< EXITING summarizeOneBatch - PASSAGE START GREATER THAN END');
            return false;
        }

        const storyTxt = await buildPassageFromRange(buffer, passageStart, endIdx);
        trace(ctx.settings, '  storyTxt length:', storyTxt?.length ?? 0);

        if (!storyTxt.trim()) {
            trace(ctx.settings, '<<< EXITING summarizeOneBatch - EMPTY PASSAGE');
            // Advance pointer so we don't get stuck on these empty indexes.
            store.state.summarizedUpTo = Math.max(
                store.state.summarizedUpTo,
                endIdx,
            );
            await store.save(ctx.host.getCurrentChatHandle());
            return true; // Return true so the cycle doesn't think it crashed.
        }

        const contextStr = buildFullContext(store.state.layers, 0);

        toastInfo(
            `Summarizing ${batch.length} turn${batch.length > 1 ? 's' : ''}…`,
            'Summaryception',
            { timeOut: 3000, progressBar: true },
        );

        const summary = await callSummarizer(settings, storyTxt, contextStr);
        trace(ctx.settings, '  summary length:', summary?.length ?? 0);

        if (!summary) {
            log(ctx.settings, 'Summarization failed for batch, leaving turns intact for next attempt.');
            trace(ctx.settings, '<<< EXITING summarizeOneBatch - EMPTY SUMMARY');
            return false;
        }

        // Push the new snippet to Layer 0.
        const layer0 = store.state.layers[0]!;
        layer0.push({
            text: summary,
            turnRange: [passageStart, endIdx],
            timestamp: Date.now(),
        });

        store.state.summarizedUpTo = Math.max(
            store.state.summarizedUpTo,
            endIdx,
        );

        await ghostMessagesUpTo(store, buffer, settings, endIdx);
        log(ctx.settings, `Layer 0 now has ${layer0.length} snippets`);

        await maybePromoteLayer(settings, store, 0);
        await store.save(ctx.host.getCurrentChatHandle());

        try {
            await saveChat();
        } catch (err) {
            log(ctx.settings, 'Could not save chat:', err);
        }

        toastSuccess(
            `Summary saved (Layer 0: ${store.state.layers[0]!.length} snippets)`,
            'Summaryception',
            { timeOut: 2000 },
        );

        updateInjection(settings, store);
        trace(ctx.settings, '<<< EXITING summarizeOneBatch - SUCCESS');
        return true;
    } finally {
        isSummarizing = false;
    }
}

// ─── Catchup ──────────────────────────────────────────────────────────

/**
 * Process a large backlog in a loop with a cancelable progress toast.
 *
 * Processes batches one at a time. After 3 consecutive failures, pauses and
 * saves progress — the user can resume by sending a new message or clicking
 * Force Summarize.
 */
export async function runCatchup(
    ctx: EngineContext,
    initialVisible: AssistantTurn[],
    overflow: number,
): Promise<void> {
    trace(ctx.settings, '>>> ENTERING runCatchup');
    trace(ctx.settings, '  overflow:', overflow);

    const { settings, store } = ctx;
    const totalBatches = Math.ceil(overflow / settings.turnsPerSummary);
    let completed = 0;
    let failed = 0;
    let cancelled = false;

    const progressToast = toastInfo(
        `Processing backlog: 0 / ${totalBatches} batches (0%)`,
        'Summaryception Catch-Up',
        {
            timeOut: 0,
            extendedTimeOut: 0,
            tapToDismiss: false,
            closeButton: true,
            onCloseClick: () => {
                cancelled = true;
                stopSummarization(settings);
            },
        },
    );

    isSummarizing = true;

    try {
        let consecutiveFailures = 0;

        while (!cancelled) {
            const buffer = await getMessageBuffer(ctx.host);
            const ghostedSet = new Set(store.state.ghostedIndices);
            const currentVisible = await getVisibleAssistantTurns(buffer, 0, ghostedSet, {
                scanLimit: settings.verbatimTurns * 10 + 100,
            });

            if (currentVisible.length <= settings.verbatimTurns) {
                break;
            }

            const result = await summarizeOneBatch(ctx, currentVisible, buffer);

            if (result === true) {
                completed++;
                consecutiveFailures = 0;
            } else if (result === 'EMPTY_SKIP') {
                consecutiveFailures = 0;
            } else {
                failed++;
                consecutiveFailures++;
                if (consecutiveFailures >= 3) {
                    toastError(
                        '3 consecutive failures — API may be down. Pausing catch-up. Progress saved; will resume on next message.',
                        'Summaryception',
                        { timeOut: 8000 },
                    );
                    break;
                }
            }

            await new Promise((r) => setTimeout(r, 200));
        }

        toastClear(progressToast);

        if (cancelled) {
            toastWarning(
                `Catch-up paused at ${completed}/${totalBatches}. Progress saved — will continue on next message.`,
                'Summaryception',
                { timeOut: 5000 },
            );
        } else if (failed === 0) {
            toastSuccess(`Catch-up complete! ${completed} batches processed.`, 'Summaryception', {
                timeOut: 4000,
            });
        } else {
            toastWarning(
                `Catch-up finished. ${completed} succeeded, ${failed} failed (will retry on next trigger).`,
                'Summaryception',
                { timeOut: 6000 },
            );
        }

        updateInjection(settings, store);
    } finally {
        isSummarizing = false;
    }
}

// ─── Catchup dialog ───────────────────────────────────────────────────

/**
 * Show the backlog dialog. Returns 'catchup', 'skip', 'partial', or null
 * (dialog dismissed).
 *
 * The dialog is a plain DOM overlay — no Vue involvement — because it must
 * appear immediately during the maybeSummarizeTurns call, before the Vue app
 * has a chance to react.
 */
function showCatchupDialog(
    overflowCount: number,
    estimatedCalls: number,
    settings: SummaryceptionSettings,
): Promise<'catchup' | 'skip' | 'partial' | null> {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'sc-catchup-overlay';
        overlay.innerHTML = `
        <div class="sc-catchup-modal">
        <h3>🧠 Summaryception — Backlog Detected</h3>
        <div class="sc-catchup-dialog">
        <p>Summaryception detected <strong>${overflowCount} unsummarized turns</strong>
        in this chat (beyond your ${settings.verbatimTurns} verbatim limit).</p>
        <p>This will require approximately <strong>${estimatedCalls} summarizer calls</strong> to process.</p>
        <hr>
        <div class="sc-catchup-options">
        <button id="sc_catchup_full" class="menu_button">
        <i class="fa-solid fa-forward-fast"></i>
        <div class="sc-btn-text">
        <span class="sc-btn-label">Process Entire Backlog</span>
        <span class="sc-btn-desc">Summarize all ${overflowCount} turns — cancelable at any time</span>
        </div>
        </button>
        <button id="sc_catchup_skip" class="menu_button">
        <i class="fa-solid fa-forward-step"></i>
        <div class="sc-btn-text">
        <span class="sc-btn-label">Skip Backlog</span>
        <span class="sc-btn-desc">Ignore old turns, only summarize new ones going forward</span>
        </div>
        </button>
        <button id="sc_catchup_partial" class="menu_button">
        <i class="fa-solid fa-play"></i>
        <div class="sc-btn-text">
        <span class="sc-btn-label">Just One Batch</span>
        <span class="sc-btn-desc">Summarize ${settings.turnsPerSummary} turns now, deal with the rest later</span>
        </div>
        </button>
        </div>
        </div>
        </div>
        `;
        document.body.appendChild(overlay);

        const close = (result: 'catchup' | 'skip' | 'partial' | null) => {
            overlay.remove();
            resolve(result);
        };

        overlay.querySelector('#sc_catchup_full')?.addEventListener('click', () => close('catchup'));
        overlay.querySelector('#sc_catchup_skip')?.addEventListener('click', () => close('skip'));
        overlay.querySelector('#sc_catchup_partial')?.addEventListener('click', () => close('partial'));
    });
}

// ─── Chat change handler ──────────────────────────────────────────────

/**
 * Called when the user switches to a different chat. Resets the catchup
 * dismissal flag and invalidates the message buffer.
 */
export function onChatChanged(): void {
    catchupDismissed = false;
    invalidateMessageBuffer();
}

// ─── Force summarize ──────────────────────────────────────────────────

export async function forceSummarize(ctx: EngineContext): Promise<void> {
    const { settings, store } = ctx;
    if (!settings.enabled) {
        toastWarning('Enable Summaryception first.');
        return;
    }
    if (isSummarizing) {
        toastWarning('Already summarizing. Please wait.');
        return;
    }

    catchupDismissed = false;

    const buffer = await getMessageBuffer(ctx.host);
    const ghostedSet = new Set(store.state.ghostedIndices);
    const visibleTurns = await getVisibleAssistantTurns(buffer, 0, ghostedSet, {
        scanLimit: settings.verbatimTurns * 10 + 100,
    });

    if (visibleTurns.length <= settings.verbatimTurns) {
        toastInfo('Nothing to summarize — visible turns are within the verbatim limit.', 'Summaryception');
        return;
    }

    const overflow = visibleTurns.length - settings.verbatimTurns;
    toastInfo(`${overflow} turns to process. Starting...`, 'Summaryception', { timeOut: 2000 });

    await runCatchup(ctx, visibleTurns, overflow);
    updateInjection(settings, store);
}

// ─── Clear memory ─────────────────────────────────────────────────────

export async function clearMemory(ctx: EngineContext): Promise<void> {
    const { settings, store } = ctx;

    try {
        await unghostAllMessages(store, settings);
    } catch (err) {
        console.error(`[${MODULE_NAME}] Error during unghost (continuing with clear):`, err);
        toastWarning('Some messages could not be unghosted, but memory will still be cleared.', 'Summaryception');
    }

    const handle = ctx.host.getCurrentChatHandle();
    if (!handle) {
        toastError('No active chat handle.', 'Summaryception');
        return;
    }

    await store.reset(handle);
    try {
        await saveChat();
    } catch (err) {
        log(settings, 'Could not save chat:', err);
    }

    updateInjection(settings, store);
    toastSuccess('Memory cleared & messages unghosted', 'Summaryception');
}

// ─── Repair orphans ───────────────────────────────────────────────────

/**
 * Find and repair orphaned messages: messages that are stuck in the hidden
 * state (is_system or is_hidden) but were NOT ghosted by Summaryception and
 * have non-empty content. These are usually the result of bugs in other
 * extensions or manual /hide commands.
 *
 * This is a best-effort scan of the current window. Messages outside the
 * window can't be repaired from the frontend.
 */
export async function repairOrphans(ctx: EngineContext): Promise<number> {
    const { settings } = ctx;
    const buffer = await getMessageBuffer(ctx.host);
    let repaired = 0;

    const progressToast = toastInfo('Scanning for orphaned messages...', 'Summaryception — Repair', {
        timeOut: 0,
        extendedTimeOut: 0,
        tapToDismiss: false,
    });

    const total = buffer.getTotalCount();
    for (let i = 0; i < total; i++) {
        const msg = await buffer.getMessage(i);
        if (!msg) continue;

        const isStuckHidden =
            (msg.is_system || msg.is_hidden) &&
            !msg.is_user &&
            !msg.extra?.sc_ghosted &&
            msg.mes &&
            msg.mes.trim().length > 0;

        if (isStuckHidden) {
            try {
                await executeSlashCommand(`/unhide ${i}`);
            } catch (err) {
                log(settings, `Repair: failed to unhide ${i}:`, err);
            }
            msg.is_system = false;
            delete msg.is_hidden;
            repaired++;
        }
    }

    toastClear(progressToast);

    if (repaired > 0) {
        try {
            await saveChat();
        } catch (err) {
            log(settings, 'Could not save chat:', err);
        }
        toastSuccess(
            `Repaired ${repaired} orphaned messages. They are now visible to the summarizer again.`,
            'Summaryception',
            { timeOut: 5000 },
        );
    } else {
        toastInfo('No orphaned messages found.', 'Summaryception', { timeOut: 3000 });
    }

    return repaired;
}

// ─── Export/Import ────────────────────────────────────────────────────

export function exportMemory(store: ChatStore): void {
    const data = {
        layers: store.state.layers,
        summarizedUpTo: store.state.summarizedUpTo,
        ghostedIndices: store.state.ghostedIndices,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summaryception_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toastSuccess('Memory exported', 'Summaryception');
}

export async function importMemory(ctx: EngineContext, file: File): Promise<void> {
    const { settings, store } = ctx;
    try {
        const text = await file.text();
        const data = JSON.parse(text) as {
            layers?: unknown;
            summarizedUpTo?: number;
            ghostedIndices?: number[];
        };

        if (!Array.isArray(data.layers)) {
            toastError('Invalid file format — layers array missing.', 'Summaryception');
            return;
        }

        const handle = ctx.host.getCurrentChatHandle();
        if (!handle) {
            toastError('No active chat handle.', 'Summaryception');
            return;
        }

        // Unghost everything first.
        await unghostAllMessages(store, settings);

        const newState = {
            layers: data.layers as Snippet[][],
            summarizedUpTo: data.summarizedUpTo ?? -1,
            ghostedIndices: data.ghostedIndices ?? [],
        };

        await store.importFrom(handle, newState);

        // Re-ghost messages up to the new summarizedUpTo.
        if (newState.summarizedUpTo >= 0) {
            const buffer = await getMessageBuffer(ctx.host);
            await ghostMessagesUpTo(store, buffer, settings, newState.summarizedUpTo);
        }

        try {
            await saveChat();
        } catch (err) {
            log(settings, 'Could not save chat:', err);
        }

        updateInjection(settings, store);

        const totalSnippets = newState.layers.reduce((sum, l) => sum + (l?.length ?? 0), 0);
        toastSuccess(
            `Memory imported. ${totalSnippets} snippets loaded, messages ghosted up to index ${newState.summarizedUpTo}.`,
            'Summaryception',
            { timeOut: 4000 },
        );
    } catch (err) {
        console.error(`[${MODULE_NAME}] Import failed`, err);
        toastError('Import failed — check console.', 'Summaryception');
    }
}

// ─── Regenerate snippet ───────────────────────────────────────────────

/**
 * Regenerate a single Layer 0 snippet by re-summarizing its source turn
 * range against the full context (excluding itself).
 *
 * Only Layer 0 snippets with a `turnRange` can be regenerated. Promoted
 * meta-summaries have no source turns.
 */
export async function regenerateSnippet(
    ctx: EngineContext,
    layerIdx: number,
    snippetIdx: number,
): Promise<void> {
    const { settings, store } = ctx;

    const layer = store.state.layers[layerIdx];
    if (!layer) return;
    const sn = layer[snippetIdx];
    if (!sn) return;

    if (!sn.turnRange) {
        toastWarning(
            'Only Layer 0 (turn summary) snippets can be regenerated. Promoted meta-summaries have no source turns.',
            'Summaryception',
            { timeOut: 5000 },
        );
        return;
    }

    if (isSummarizing || isAborting()) {
        toastWarning('Already summarizing. Please wait.', 'Summaryception');
        return;
    }

    const [rangeStart, rangeEnd] = sn.turnRange;
    const buffer = await getMessageBuffer(ctx.host);

    if (!confirm(`Regenerate summary for turns ${rangeStart}–${rangeEnd}?`)) return;

    isSummarizing = true;
    try {
        const storyTxt = await buildPassageFromRange(buffer, rangeStart, rangeEnd);
        if (!storyTxt.trim()) {
            toastError('Source turns are empty — cannot regenerate.', 'Summaryception');
            return;
        }

        const contextStr = buildFullContext(store.state.layers, 0, {
            layer: layerIdx,
            index: snippetIdx,
        });

        toastInfo(
            `Regenerating summary for turns ${rangeStart}–${rangeEnd}…`,
            'Summaryception',
            { timeOut: 3000, progressBar: true },
        );

        const newSummary = await callSummarizer(settings, storyTxt, contextStr);
        if (!newSummary) {
            toastError('Regeneration failed — original snippet kept.', 'Summaryception');
            return;
        }

        sn.text = newSummary;
        sn.timestamp = Date.now();
        sn.regenerated = true;

        await store.save(ctx.host.getCurrentChatHandle());
        updateInjection(settings, store);

        toastSuccess(
            `Snippet regenerated for turns ${rangeStart}–${rangeEnd}`,
            'Summaryception',
            { timeOut: 3000 },
        );
    } finally {
        isSummarizing = false;
    }
}

// ─── Delete snippet ───────────────────────────────────────────────────

export async function deleteSnippet(
    ctx: EngineContext,
    layerIdx: number,
    snippetIdx: number,
): Promise<void> {
    const { store } = ctx;
    const layer = store.state.layers[layerIdx];
    if (!layer) return;

    layer.splice(snippetIdx, 1);

    // Recalculate summarizedUpTo from remaining Layer 0 snippets.
    if (layerIdx === 0 && store.state.layers[0] && store.state.layers[0].length > 0) {
        let maxEnd = -1;
        for (const sn of store.state.layers[0]) {
            if (sn.turnRange && sn.turnRange[1] > maxEnd) {
                maxEnd = sn.turnRange[1];
            }
        }
        store.state.summarizedUpTo = maxEnd;
    } else if (layerIdx === 0) {
        store.state.summarizedUpTo = -1;
    }

    const handle = ctx.host.getCurrentChatHandle();
    if (handle) await store.save(handle);

    updateInjection(ctx.settings, store);
    toastInfo(`Snippet removed from Layer ${layerIdx}`, 'Summaryception');
}

// ─── Edit snippet ─────────────────────────────────────────────────────

export async function editSnippet(
    ctx: EngineContext,
    layerIdx: number,
    snippetIdx: number,
    newText: string,
): Promise<void> {
    const { store } = ctx;
    const layer = store.state.layers[layerIdx];
    if (!layer) return;
    const sn = layer[snippetIdx];
    if (!sn) return;

    sn.text = newText;

    const handle = ctx.host.getCurrentChatHandle();
    if (handle) await store.save(handle);

    updateInjection(ctx.settings, store);
    toastSuccess('Snippet updated', 'Summaryception', { timeOut: 1500 });
}
