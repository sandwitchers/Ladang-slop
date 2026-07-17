/**
 * Summarizer call with retry, prompt-toggle management, and output cleaning.
 *
 * Before calling the summarizer, ALL Chat Completion preset toggles are
 * temporarily disabled so the summarizer sees only its own system prompt +
 * user prompt. The snapshot is restored in a `finally` block, even if the
 * call fails or is aborted.
 *
 * Retries use exponential backoff with jitter. The `Retry-After` header is
 * respected when the server provides one. Failed batches are never ghosted —
 * the turns stay visible for the next attempt.
 */

import {
    disableAllPromptToggles,
    getPlayerName,
    restorePromptToggles,
    snapshotPromptToggles,
    toastError,
    toastWarning,
} from '../host/st-bridge';
import { RETRY_CONFIG, type SummaryceptionSettings } from '../settings/defaults';
import {
    cleanSummarizerOutput,
    ConnectionError,
    isRetryableError,
    parseRetryAfter,
    sendSummarizerRequest,
    sleep,
} from './connection';

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

// ─── Abort controller ─────────────────────────────────────────────────

let currentAbortController: AbortController | null = null;

export function abortSummarization(settings: SummaryceptionSettings): void {
    if (currentAbortController) {
        currentAbortController.abort();
        log(settings, 'Abort signal sent.');
    }
}

export function isAborting(): boolean {
    return currentAbortController !== null;
}

// ─── Main entry ───────────────────────────────────────────────────────

/**
 * Call the summarizer with the given story text and prior context.
 *
 * Returns the cleaned summary string, or an empty string if the call failed
 * after all retries (or was aborted). The caller must treat an empty string
 * as "do not advance the pointer, do not ghost, retry next time".
 */
export async function callSummarizer(
    settings: SummaryceptionSettings,
    storyTxt: string,
    contextStr: string,
): Promise<string> {
    trace(settings, '>>> ENTERING callSummarizer');
    trace(settings, '  storyTxt length:', storyTxt?.length ?? 0);
    trace(settings, '  contextStr length:', contextStr?.length ?? 0);

    const prompt = settings.summarizerUserPrompt
        .replace('{{player_name}}', getPlayerName())
        .replace('{{context_str}}', contextStr || '(none yet)')
        .replace('{{story_txt}}', storyTxt);

    log(settings, '── Summarizer Call ──');
    log(settings, 'Context str length:', contextStr.length, 'chars');
    log(settings, 'Story txt length:', storyTxt.length, 'chars');

    // Only disable prompt toggles in default mode (generateRaw uses the active
    // connection's preset). Profile/Ollama/OpenAI modes bypass the preset.
    const isDefaultMode = !settings.connectionSource || settings.connectionSource === 'default';
    const snapshot = isDefaultMode ? snapshotPromptToggles() : null;
    if (isDefaultMode) disableAllPromptToggles();

    currentAbortController = new AbortController();
    const { signal } = currentAbortController;

    let lastError: unknown = null;

    try {
        for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
            trace(settings, `  Attempt ${attempt} starting...`);

            if (signal.aborted) {
                log(settings, 'Summarization aborted by user.');
                toastWarning('Summarization aborted.', 'Summaryception', { timeOut: 3000 });
                return '';
            }

            try {
                if (attempt > 0) {
                    log(settings, `Retry attempt ${attempt}/${RETRY_CONFIG.maxRetries}`);
                }

                trace(settings, '  Calling sendSummarizerRequest...');

                const timeoutMs = 120000;
                const result = await Promise.race([
                    sendSummarizerRequest(
                        settings,
                        settings.summarizerSystemPrompt,
                        prompt,
                        signal,
                    ),
                    new Promise<never>((_, reject) => {
                        const timer = setTimeout(
                            () => reject(new Error('Request timed out after 120s')),
                            timeoutMs,
                        );
                        signal.addEventListener(
                            'abort',
                            () => {
                                clearTimeout(timer);
                                reject(new Error('Aborted by user'));
                            },
                            { once: true },
                        );
                    }),
                ]);

                trace(settings, '  sendSummarizerRequest returned:', result?.substring?.(0, 50));

                let trimmed = (result || '').trim();
                trimmed = cleanSummarizerOutput(trimmed, settings);

                if (!trimmed) {
                    log(settings, 'Empty response from LLM, treating as retryable');
                    throw new ConnectionError('Empty response from summarizer', { retryable: true });
                }

                log(settings, 'Result:', trimmed);
                trace(settings, '<<< EXITING callSummarizer WITH SUCCESS');
                return trimmed;
            } catch (err) {
                lastError = err;
                trace(settings, `  Caught error on attempt ${attempt}:`, {
                    name: (err as Error)?.name,
                    message: (err as Error)?.message,
                    retryable: (err as { retryable?: boolean })?.retryable,
                });

                if (signal.aborted || (err as Error)?.message === 'Aborted by user') {
                    log(settings, 'Summarization aborted by user.');
                    toastWarning('Summarization aborted.', 'Summaryception', { timeOut: 3000 });
                    return '';
                }

                if (!isRetryableError(err)) {
                    trace(settings, '  ERROR IS NON-RETRYABLE, BREAKING');
                    console.error(`[${MODULE_NAME}] Non-retryable error:`, err);
                    break;
                }

                if (attempt >= RETRY_CONFIG.maxRetries) {
                    trace(settings, '  MAX RETRIES EXHAUSTED');
                    console.error(`[${MODULE_NAME}] All ${RETRY_CONFIG.maxRetries} retries exhausted.`);
                    break;
                }

                let delay: number;
                const retryAfterMs = parseRetryAfter(err);
                if (retryAfterMs) {
                    delay = Math.min(retryAfterMs, RETRY_CONFIG.maxDelay);
                    log(settings, `Server requested retry after ${delay}ms`);
                } else {
                    const exponentialDelay =
                        RETRY_CONFIG.baseDelay *
                        Math.pow(RETRY_CONFIG.backoffMultiplier, attempt);
                    const jitter = Math.random() * RETRY_CONFIG.baseDelay;
                    delay = Math.min(exponentialDelay + jitter, RETRY_CONFIG.maxDelay);
                }

                const delaySec = (delay / 1000).toFixed(1);
                const status =
                    (err as { status?: number })?.status ??
                    (err as { response?: { status?: number } })?.response?.status ??
                    '?';

                console.warn(
                    `[${MODULE_NAME}] Attempt ${attempt + 1} failed (${status}). Retrying in ${delaySec}s...`,
                    (err as Error)?.message ?? err,
                );

                toastWarning(
                    `API error (${status}). Retrying in ${delaySec}s... (${attempt + 1}/${RETRY_CONFIG.maxRetries})`,
                    'Summaryception',
                    { timeOut: delay },
                );

                await new Promise<void>((resolve) => {
                    const timer = setTimeout(resolve, delay);
                    signal.addEventListener(
                        'abort',
                        () => {
                            clearTimeout(timer);
                            resolve();
                        },
                        { once: true },
                    );
                });
            }
        }

        const status =
            (lastError as { status?: number })?.status ??
            (lastError as { response?: { status?: number } })?.response?.status ??
            '';
        console.error(`[${MODULE_NAME}] Summarization failed after all retries:`, lastError);
        toastError(
            `Summarization failed after ${RETRY_CONFIG.maxRetries} retries${status ? ` (${status})` : ''}. Batch skipped — will retry on next trigger.`,
            'Summaryception',
            { timeOut: 8000 },
        );
        trace(settings, '<<< EXITING callSummarizer WITH FAILURE');
        return '';
    } finally {
        currentAbortController = null;
        if (isDefaultMode && snapshot) {
            restorePromptToggles(snapshot);
        }
    }
}
