/**
 * Message ghosting.
 *
 * Summaryception "ghosts" summarized messages: they're hidden from the LLM
 * context (via ST's `/hide` slash command) but remain fully visible in the
 * chat UI for the user to scroll up and read. The original prose is never
 * deleted.
 *
 * In TauriTavern's windowed mode, `/hide N` works on absolute indices
 * regardless of whether the message is in the current window — it's a
 * backend operation. The `extra.sc_ghosted` flag is only settable on
 * windowed-in messages, so `ghostedIndices` in the chat store is the source
 * of truth.
 */

import type { HostClient } from '../host/client';
import {
    executeSlashCommand,
    getPlayerName,
    toastClear,
    toastInfo,
    toastWarning,
} from '../host/st-bridge';
import type { ChatStore } from '../store/chat-store';
import { isGhosted } from './messages';
import type { MessageBuffer } from './messages';
import type { SummaryceptionSettings } from '../settings/defaults';

const MODULE_NAME = 'summaryception';

function log(settings: SummaryceptionSettings, ...args: unknown[]): void {
    if (settings.debugMode) console.log(`[${MODULE_NAME}]`, ...args);
}

/**
 * Ghost a single message by absolute index.
 *
 * Sets the `sc_ghosted` flag (best-effort for windowed-in messages) and
 * calls `/hide` (works for any index). The index is added to
 * `ghostedIndices` in the store.
 */
export async function ghostMessage(
    store: ChatStore,
    buffer: MessageBuffer,
    settings: SummaryceptionSettings,
    index: number,
): Promise<void> {
    if (store.state.ghostedIndices.includes(index)) return;

    // Try to set the flag on the live message object (only works if it's in
    // the current window). This is best-effort; the store is the source of
    // truth.
    const msg = await buffer.getMessage(index);
    if (msg) {
        if (!msg.extra) msg.extra = {};
        msg.extra.sc_ghosted = true;
    }

    store.state.ghostedIndices.push(index);

    if (!settings.disableGhosting) {
        try {
            await executeSlashCommand(`/hide ${index}`);
        } catch (err) {
            log(settings, `Failed to hide message ${index}:`, err);
        }
    }

    log(
        settings,
        `Ghosted message at index ${index}${settings.disableGhosting ? ' (hiding disabled — metadata only)' : ''}`,
    );
}

/**
 * Ghost all messages from index 0 to `endIndex` (inclusive) that haven't
 * already been ghosted. User-hidden messages are skipped.
 *
 * Shows a progress toast because this can take a while for large ranges.
 */
export async function ghostMessagesUpTo(
    store: ChatStore,
    buffer: MessageBuffer,
    settings: SummaryceptionSettings,
    endIndex: number,
): Promise<void> {
    const progressToast = !settings.disableGhosting
        ? toastInfo(`Hiding messages: 0 / ${endIndex + 1}`, 'Summaryception — Ghosting', {
              timeOut: 0,
              extendedTimeOut: 0,
              tapToDismiss: false,
          })
        : null;

    let processed = 0;
    const ghostedSet = new Set(store.state.ghostedIndices);

    for (let i = 0; i <= endIndex; i++) {
        if (ghostedSet.has(i)) continue;

        const msg = await buffer.getMessage(i);
        if (!msg) continue;

        // Skip messages already hidden by the user (not by us).
        if (msg.is_hidden && !msg.extra?.sc_ghosted) {
            log(settings, `Skipping message ${i} — already hidden by user`);
            continue;
        }

        // Skip system messages we didn't ghost.
        if (msg.is_system && !msg.extra?.sc_ghosted) continue;

        // Skip empty messages.
        if (!msg.mes || !msg.mes.trim()) continue;

        if (!msg.extra) msg.extra = {};
        msg.extra.sc_ghosted = true;
        store.state.ghostedIndices.push(i);
        ghostedSet.add(i);

        if (!settings.disableGhosting) {
            try {
                await executeSlashCommand(`/hide ${i}`);
            } catch (err) {
                log(settings, `Failed to hide message ${i}:`, err);
            }
        }

        processed++;
        if (progressToast && processed % 10 === 0) {
            const pct = Math.round((i / (endIndex + 1)) * 100);
            // toastr doesn't have a clean update API; we clear + re-show.
            // Actually, the original code used jQuery to update the toast text.
            // Since we're not using jQuery in the Vue port, we just let the
            // toast sit. It's acceptable for a background operation.
            void pct;
        }
    }

    if (progressToast) toastClear(progressToast);
    log(
        settings,
        `Ghosted messages from index 0 to ${endIndex}${settings.disableGhosting ? ' (hiding disabled — metadata only)' : ''}`,
    );
}

/**
 * Unghost all messages that Summaryception ghosted.
 *
 * Only messages tracked in `ghostedIndices` are unhidden — user-hidden
 * messages are left alone. This is the "Clear Memory" path.
 */
export async function unghostAllMessages(
    store: ChatStore,
    settings: SummaryceptionSettings,
): Promise<void> {
    const indices = [...store.state.ghostedIndices];
    if (indices.length === 0) return;

    const progressToast = !settings.disableGhosting
        ? toastInfo(`Unhiding messages: 0 / ${indices.length}`, 'Summaryception — Clearing', {
              timeOut: 0,
              extendedTimeOut: 0,
              tapToDismiss: false,
          })
        : null;

    let processed = 0;
    for (const idx of indices) {
        // We can't easily clear `extra.sc_ghosted` on windowed-out messages
        // without the buffer. That flag is best-effort anyway; the store is
        // the source of truth. Clearing the store array is sufficient.
        if (!settings.disableGhosting) {
            try {
                await executeSlashCommand(`/unhide ${idx}`);
            } catch (err) {
                log(settings, `Failed to unhide message ${idx}:`, err);
            }
        }

        processed++;
        if (progressToast && processed % 10 === 0) {
            void processed; // toast text not updated in Vue port; acceptable
        }
    }

    store.state.ghostedIndices.length = 0;

    if (progressToast) toastClear(progressToast);
    log(settings, `Unghosted ${indices.length} messages`);
}

/**
 * Repair ghosting for a range: ensure every message that should be ghosted
 * (summarized but not yet hidden) actually has the `/hide` command applied.
 */
export async function repairGhostingForRange(
    store: ChatStore,
    buffer: MessageBuffer,
    settings: SummaryceptionSettings,
    startIdx: number,
    endIdx: number,
): Promise<number> {
    let repaired = 0;
    const ghostedSet = new Set(store.state.ghostedIndices);

    for (let i = startIdx; i <= endIdx; i++) {
        if (ghostedSet.has(i)) continue;

        const msg = await buffer.getMessage(i);
        if (!msg) continue;

        // Skip user-hidden messages.
        if (msg.is_hidden && !msg.extra?.sc_ghosted) continue;
        // Skip system/empty messages.
        if (msg.is_system || !msg.mes?.trim()) continue;
        // Skip user messages (we only ghost assistant turns).
        if (msg.is_user) continue;

        if (!msg.extra) msg.extra = {};
        msg.extra.sc_ghosted = true;
        store.state.ghostedIndices.push(i);
        ghostedSet.add(i);

        if (!settings.disableGhosting) {
            try {
                await executeSlashCommand(`/hide ${i}`);
                repaired++;
            } catch (err) {
                console.error(`[${MODULE_NAME}] Failed to ghost message ${i}:`, err);
            }
        } else {
            repaired++;
        }
    }

    return repaired;
}

// Re-export isGhosted for convenience.
export { isGhosted };

// Player name helper re-export for engine modules that need it.
export function getCurrentPlayerName(): string {
    return getPlayerName();
}

export function warnIfGhostingDisabled(settings: SummaryceptionSettings): void {
    if (settings.disableGhosting) {
        toastWarning(
            'Message hiding is disabled. Summarized messages will remain visible but will still be excluded from LLM context.',
            'Summaryception',
            { timeOut: 5000 },
        );
    }
}
