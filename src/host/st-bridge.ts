/**
 * SillyTavern globals bridge.
 *
 * TauriTavern preserves the full SillyTavern 1.18.0 frontend, so
 * `window.SillyTavern.getContext()` is available at runtime. Several ST-only
 * surfaces have no TauriTavern-native equivalent:
 *
 *   - setExtensionPrompt  (LLM context injection)
 *   - generateRaw         (LLM completion call)
 *   - executeSlashCommandsWithOptions  (/hide, /unhide slash commands)
 *   - eventSource + event_types  (MESSAGE_RECEIVED, CHAT_CHANGED, GENERATION_STARTED)
 *   - promptManager       (snapshot/disable/restore prompt toggles)
 *   - saveChat, saveMetadata, saveSettingsDebounced
 *   - ConnectionManagerRequestService  (Connection Profile backend)
 *
 * This module centralises every ST call so that the engine and UI never touch
 * `window.SillyTavern` directly. If a future TauriTavern ABI adds native
 * equivalents, this is the only file that changes.
 */

import {
    getSillyTavernContext,
    type ChatMessage,
    type SillyTavernContext,
} from './api';

const ST_MODULE_NAME = 'summaryception';

// ─── Context access ───────────────────────────────────────────────────

export function getST(): SillyTavernContext {
    const ctx = getSillyTavernContext();
    if (!ctx) {
        throw new Error(
            'SillyTavern context is unavailable. Summaryception requires TauriTavern (which preserves the ST frontend) or a standard SillyTavern installation.',
        );
    }
    return ctx;
}

export function getSTOrNull(): SillyTavernContext | null {
    return getSillyTavernContext();
}

// ─── Chat array access ────────────────────────────────────────────────

/**
 * Returns the live ST chat array.
 *
 * In TauriTavern's windowed mode this only contains the most recent N
 * messages. Callers that need full-history access must use the TauriTavern
 * history API via HostClient instead of indexing this array for old indices.
 */
export function getLiveChat(): ChatMessage[] {
    return getST().chat;
}

export function getChatMetadata(): Record<string, unknown> {
    return getST().chatMetadata;
}

export function getPlayerName(): string {
    return getST().name1 || 'User';
}

// ─── Persistence ──────────────────────────────────────────────────────

export function saveSettingsDebounced(): void {
    getST().saveSettingsDebounced();
}

export async function saveMetadata(): Promise<void> {
    await getST().saveMetadata();
}

export async function saveChat(): Promise<void> {
    const ctx = getST();
    if (typeof ctx.saveChat === 'function') {
        await ctx.saveChat();
    }
}

// ─── Extension prompt injection ───────────────────────────────────────

const PROMPT_POSITION = 0; // 0 = in-chat, 1 = relative to other prompts
const PROMPT_DEPTH = 0;
const PROMPT_SCAN = false;
const PROMPT_ORDER = 0;

/**
 * Inject (or clear) the summary block into the LLM context.
 *
 * TauriTavern does not expose a native equivalent for this, so we go through
 * ST's setExtensionPrompt. The function is a no-op if ST is unavailable.
 */
export function setExtensionPrompt(text: string): void {
    const ctx = getSTOrNull();
    if (!ctx) return;
    try {
        ctx.setExtensionPrompt(ST_MODULE_NAME, text, PROMPT_POSITION, PROMPT_DEPTH, PROMPT_SCAN, PROMPT_ORDER);
    } catch (err) {
        console.error('[Summaryception] setExtensionPrompt failed', err);
    }
}

export function clearExtensionPrompt(): void {
    setExtensionPrompt('');
}

// ─── Slash commands ───────────────────────────────────────────────────

/**
 * Execute a SillyTavern slash command (e.g. `/hide 42`, `/unhide 42`).
 *
 * TauriTavern preserves ST's slash command infrastructure, including backend
 * commands that operate on absolute chat indices regardless of windowed mode.
 */
export async function executeSlashCommand(command: string): Promise<unknown> {
    const ctx = getST();
    return ctx.executeSlashCommandsWithOptions(command, { showOutput: false });
}

// ─── Events ───────────────────────────────────────────────────────────

export interface STEvents {
    MESSAGE_RECEIVED: string | number;
    CHAT_CHANGED: string | number;
    GENERATION_STARTED: string | number;
    APP_READY: string | number;
    [key: string]: string | number;
}

let cachedEvents: STEvents | null = null;

export function getEventTypes(): STEvents {
    if (cachedEvents) return cachedEvents;
    const ctx = getST();
    const et = ctx.event_types as Record<string, string | number>;
    cachedEvents = {
        MESSAGE_RECEIVED: et.MESSAGE_RECEIVED ?? et.MESSAGE_RECEIVED ?? 'message_received',
        CHAT_CHANGED: et.CHAT_CHANGED ?? 'chat_changed',
        GENERATION_STARTED: et.GENERATION_STARTED ?? 'generation_started',
        APP_READY: et.APP_READY ?? 'app_ready',
        ...et,
    } as STEvents;
    return cachedEvents;
}

export function onMessageReceived(handler: (index: number) => void): () => void {
    const ctx = getST();
    const type = getEventTypes().MESSAGE_RECEIVED;
    const wrapped = (...args: unknown[]) => handler(args[0] as number);
    ctx.eventSource.on(type, wrapped);
    return () => ctx.eventSource.off(type, wrapped);
}

export function onChatChanged(handler: () => void): () => void {
    const ctx = getST();
    const type = getEventTypes().CHAT_CHANGED;
    ctx.eventSource.on(type, handler);
    return () => ctx.eventSource.off(type, handler);
}

export function onGenerationStarted(handler: () => void): () => void {
    const ctx = getST();
    const type = getEventTypes().GENERATION_STARTED;
    ctx.eventSource.on(type, handler);
    return () => ctx.eventSource.off(type, handler);
}

export function onAppReady(handler: () => void): () => void {
    const ctx = getST();
    const type = getEventTypes().APP_READY;
    ctx.eventSource.on(type, handler);
    return () => ctx.eventSource.off(type, handler);
}

// ─── Prompt toggle management ─────────────────────────────────────────

export interface PromptToggleSnapshot {
    entries: Map<string, boolean>;
}

/**
 * Snapshot the current state of all prompt manager toggle entries.
 *
 * Summaryception disables every prompt toggle before calling the summarizer
 * so that the summarizer sees only its own system prompt + user prompt, not
 * the user's 4k-token creative-writing preset. The snapshot is restored
 * afterwards, even if the call fails.
 */
export function snapshotPromptToggles(): PromptToggleSnapshot {
    const entries = new Map<string, boolean>();
    const ctx = getSTOrNull();
    if (!ctx?.promptManager) return { entries };

    try {
        const orderList = ctx.promptManager.getPromptOrderEntries();
        if (!orderList) return { entries };
        for (const entry of orderList) {
            entries.set(entry.identifier, entry.enabled);
        }
    } catch (err) {
        console.warn('[Summaryception] Failed to snapshot prompt toggles', err);
    }
    return { entries };
}

export function disableAllPromptToggles(): void {
    const ctx = getSTOrNull();
    if (!ctx?.promptManager) return;
    try {
        const orderList = ctx.promptManager.getPromptOrderEntries();
        if (!orderList) return;
        for (const entry of orderList) {
            if (entry.enabled) entry.enabled = false;
        }
    } catch (err) {
        console.warn('[Summaryception] Failed to disable prompt toggles', err);
    }
}

export function restorePromptToggles(snapshot: PromptToggleSnapshot): void {
    if (!snapshot || snapshot.entries.size === 0) return;
    const ctx = getSTOrNull();
    if (!ctx?.promptManager) return;
    try {
        const orderList = ctx.promptManager.getPromptOrderEntries();
        if (!orderList) return;
        for (const entry of orderList) {
            if (snapshot.entries.has(entry.identifier)) {
                entry.enabled = snapshot.entries.get(entry.identifier) ?? false;
            }
        }
    } catch (err) {
        console.warn('[Summaryception] Failed to restore prompt toggles', err);
    }
}

// ─── generateRaw ──────────────────────────────────────────────────────

/**
 * Call SillyTavern's active connection via generateRaw.
 *
 * ST refactored generateRaw from positional args to an object param in
 * PR #4277 (July 2025). We detect the signature by function arity:
 *   - length <= 1  →  modern object-based: generateRaw({ prompt, systemPrompt, responseLength })
 *   - length >  1  →  legacy positional:    generateRaw(prompt, systemPrompt)
 */
export async function generateRaw(
    prompt: string,
    systemPrompt: string,
    responseLength: number,
): Promise<string> {
    const ctx = getST();
    const fn = ctx.generateRaw;
    if (typeof fn !== 'function') {
        throw new Error('generateRaw is not available in the current SillyTavern context.');
    }

    let result: string;

    if (fn.length <= 1) {
        const options: { prompt: string; systemPrompt: string; responseLength?: number } = {
            prompt,
            systemPrompt,
        };
        if (responseLength && responseLength > 0) {
            options.responseLength = responseLength;
        }
        result = await fn(options);
    } else {
        result = await fn(prompt, systemPrompt);
    }

    if (!result || typeof result !== 'string') {
        throw new Error('generateRaw returned an empty or invalid response.');
    }
    return result;
}

// ─── Connection Profile service ───────────────────────────────────────

export function getConnectionManagerService(): NonNullable<
    SillyTavernContext['ConnectionManagerRequestService']
> | null {
    const ctx = getSTOrNull();
    const service = ctx?.ConnectionManagerRequestService;
    if (!service || typeof service.sendRequest !== 'function') return null;
    return service;
}

export async function sendViaConnectionProfile(
    profileId: string,
    systemPrompt: string,
    userPrompt: string,
): Promise<string> {
    const service = getConnectionManagerService();
    if (!service) {
        throw new Error(
            'ConnectionManagerRequestService is not available. ' +
                'Requires SillyTavern with PR #3603 (March 2025+).',
        );
    }

    const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
    ];

    const raw = await service.sendRequest(profileId, messages, { ignoreInstruct: true });

    if (typeof raw === 'string') return raw;
    const r = raw as Record<string, unknown>;
    if (typeof r.content === 'string') return r.content;
    const msg = r.message as Record<string, unknown> | undefined;
    if (typeof msg?.content === 'string') return msg.content;
    const choices = r.choices as Array<{ message?: { content?: string } }> | undefined;
    if (choices?.[0]?.message?.content) return choices[0].message.content;
    if (typeof r.data === 'string') return r.data;

    throw new Error(
        `Connection Profile returned unexpected type: ${typeof raw}. Preview: ${JSON.stringify(raw).slice(0, 200)}`,
    );
}

export function populateConnectionProfileDropdown(
    select: HTMLSelectElement,
    currentValue: string,
): boolean {
    const service = getConnectionManagerService();
    if (!service || typeof service.handleDropdown !== 'function') return false;
    try {
        service.handleDropdown(select);
        if (currentValue) select.value = currentValue;
        return true;
    } catch (err) {
        console.warn('[Summaryception] Error populating profile dropdown', err);
        return false;
    }
}

export async function fetchProfilesFallback(
    select: HTMLSelectElement,
    currentValue: string,
): Promise<void> {
    const ctx = getSTOrNull();
    if (!ctx) return;
    try {
        const headers =
            typeof ctx.getRequestHeaders === 'function'
                ? ctx.getRequestHeaders()
                : { 'Content-Type': 'application/json' };

        const response = await fetch('/api/connection-manager/profiles', {
            method: 'GET',
            headers,
        });
        if (!response.ok) return;

        const profiles = await response.json();
        select.innerHTML = '<option value="">-- Select a Profile --</option>';

        if (Array.isArray(profiles)) {
            for (const p of profiles as Array<{ id?: string; name?: string }>) {
                const opt = document.createElement('option');
                opt.value = p.id || p.name || '';
                opt.textContent = p.name || p.id || '';
                select.appendChild(opt);
            }
        } else if (profiles && typeof profiles === 'object') {
            for (const [id, p] of Object.entries(profiles as Record<string, { name?: string }>)) {
                const opt = document.createElement('option');
                opt.value = id;
                opt.textContent = p.name || id;
                select.appendChild(opt);
            }
        }

        if (currentValue) select.value = currentValue;
    } catch (err) {
        console.warn('[Summaryception] Could not fetch connection profiles', err);
    }
}

// ─── Request headers (for CORS proxy calls) ───────────────────────────

export function getProxyHeaders(): Record<string, string> {
    const ctx = getSTOrNull();
    if (ctx && typeof ctx.getRequestHeaders === 'function') {
        try {
            return ctx.getRequestHeaders();
        } catch {
            /* fall through */
        }
    }
    return { 'Content-Type': 'application/json' };
}

export function proxiedUrl(url: string): string {
    return `/proxy/${url}`;
}

// ─── toastr ───────────────────────────────────────────────────────────

function toastr(): NonNullable<Window['toastr']> | null {
    return window.toastr ?? null;
}

export function toastInfo(message: string, title?: string, options?: Record<string, unknown>): unknown {
    return toastr()?.info(message, title, options as never) ?? null;
}

export function toastSuccess(message: string, title?: string, options?: Record<string, unknown>): unknown {
    return toastr()?.success(message, title, options as never) ?? null;
}

export function toastWarning(message: string, title?: string, options?: Record<string, unknown>): unknown {
    return toastr()?.warning(message, title, options as never) ?? null;
}

export function toastError(message: string, title?: string, options?: Record<string, unknown>): unknown {
    return toastr()?.error(message, title, options as never) ?? null;
}

export function toastClear(toast: unknown): void {
    toastr()?.clear(toast);
}

// ─── Slash command registration ───────────────────────────────────────

export function registerSlashCommand(name: string, callback: (args: string) => unknown, helpString: string): boolean {
    const ctx = getSTOrNull() as unknown as {
        SlashCommandParser?: { addCommandObject?: (cmd: unknown) => void };
        SlashCommand?: { fromProps?: (p: unknown) => unknown };
    } | null;
    const parser = ctx?.SlashCommandParser;
    const SlashCommand = ctx?.SlashCommand;

    if (!parser?.addCommandObject || !SlashCommand?.fromProps) {
        console.warn('[Summaryception] SlashCommandParser not available, skipping /' + name);
        return false;
    }

    try {
        parser.addCommandObject(
            SlashCommand.fromProps({ name, callback, helpString }),
        );
        return true;
    } catch (err) {
        console.warn('[Summaryception] Failed to register slash command /' + name, err);
        return false;
    }
}
