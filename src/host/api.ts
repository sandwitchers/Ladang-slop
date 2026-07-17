/**
 * TauriTavern Host ABI type definitions.
 *
 * Only the surfaces Summaryception needs are typed here. The real ABI is
 * larger (see TauriTavern's src/tauri/main/api/), but we deliberately keep
 * this file minimal so the extension doesn't depend on internal shapes that
 * might shift between TauriTavern versions.
 */

// ─── Shared primitives ────────────────────────────────────────────────

export type HostUnsubscribe = () => void | Promise<void>;

// ─── Chat ─────────────────────────────────────────────────────────────

export type CharacterChatRef = {
    kind: 'character';
    characterId: string;
    fileName: string;
};

export type GroupChatRef = {
    kind: 'group';
    chatId: string;
};

export type ChatRef = CharacterChatRef | GroupChatRef;

export interface ChatSummary {
    message_count: number;
    integrity?: string;
    [key: string]: unknown;
}

export interface ChatMetadata {
    [key: string]: unknown;
}

export interface ChatHistoryPage {
    startIndex: number;
    totalCount: number;
    messages: ChatMessage[];
    cursor: unknown;
    hasMoreBefore: boolean;
}

/**
 * SillyTavern message shape. Only the fields Summaryception touches are
 * declared. Extra fields are allowed via index signature.
 */
export interface ChatMessage {
    mes: string;
    is_user?: boolean;
    is_system?: boolean;
    is_hidden?: boolean;
    name?: string;
    extra?: {
        sc_ghosted?: boolean;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

export interface ChatLocateQuery {
    role?: 'user' | 'assistant' | 'system';
    hasTopLevelKeys?: string[];
    hasExtraKeys?: string[];
    scanLimit?: number;
}

export interface ChatLocateResult {
    index: number;
    message: Record<string, unknown>;
}

export interface ChatSearchHit {
    index: number;
    score: number;
    snippet: string;
    role: 'user' | 'assistant' | 'system';
    text: string;
}

export interface TauriTavernChatHandle {
    ref: ChatRef;
    summary(options?: { includeMetadata?: boolean }): Promise<ChatSummary>;
    stableId(): Promise<string>;
    searchMessages(options: {
        query: string;
        limit?: number;
        filters?: {
            role?: 'user' | 'assistant' | 'system';
            startIndex?: number;
            endIndex?: number;
            scanLimit?: number;
        };
    }): Promise<ChatSearchHit[]>;
    metadata: {
        get(): Promise<ChatMetadata>;
        setExtension(options: { namespace: string; value: unknown }): Promise<void>;
    };
    store: {
        getJson(options: { namespace: string; key: string }): Promise<unknown>;
        setJson(options: { namespace: string; key: string; value: unknown }): Promise<void>;
        updateJson(options: {
            namespace: string;
            key: string;
            value: unknown;
        }): Promise<unknown>;
        renameKey(options: {
            namespace: string;
            key: string;
            newKey: string;
        }): Promise<void>;
        deleteJson(options: { namespace: string; key: string }): Promise<void>;
        listKeys(options: { namespace: string }): Promise<string[]>;
    };
    locate: {
        findLastMessage(query?: ChatLocateQuery): Promise<ChatLocateResult | null>;
    };
    history: {
        tail(options: { limit: number }): Promise<ChatHistoryPage>;
        before(page: ChatHistoryPage, options: { limit: number }): Promise<ChatHistoryPage>;
        beforePages(
            page: ChatHistoryPage,
            options: { limit: number; pages: number },
        ): Promise<ChatHistoryPage[]>;
    };
}

export interface TauriTavernChatApi {
    open(ref: ChatRef): TauriTavernChatHandle;
    current: {
        ref(): ChatRef;
        handle(): TauriTavernChatHandle;
        windowInfo(): Promise<{
            mode: string;
            chatKind: ChatRef['kind'];
            chatRef: ChatRef;
            totalCount: number;
            windowStartIndex: number;
            windowLength: number;
        }>;
    };
}

// ─── Layout (declared but not used by Summaryception; kept for completeness) ──

export interface LayoutSnapshot {
    version: number;
    timestampMs: number;
    [key: string]: unknown;
}

// ─── Host API root ────────────────────────────────────────────────────

export interface TauriTavernHostApi {
    chat?: TauriTavernChatApi;
    layout?: {
        snapshot(): LayoutSnapshot;
        subscribe(
            handler: (snapshot: LayoutSnapshot) => void,
        ): Promise<HostUnsubscribe>;
    };
}

// ─── Window augmentation ──────────────────────────────────────────────

declare global {
    interface Window {
        __TAURITAVERN__?: {
            abiVersion?: number;
            ready?: Promise<void> | null;
            api?: TauriTavernHostApi;
        };
        __TAURITAVERN_MAIN_READY__?: Promise<void>;

        /**
         * SillyTavern global. TauriTavern preserves the full ST frontend, so
         * this object exists at runtime. We type it as a minimal surface and
         * cast to the concrete shape inside st-bridge.ts.
         */
        SillyTavern?: {
            getContext(): SillyTavernContext;
        };

        /** toastr global injected by SillyTavern. */
        toastr?: ToastrLike;
    }
}

/**
 * Minimal toastr interface. The real toastr has more methods, but these are
 * the only ones Summaryception calls.
 */
export interface ToastrType {
    title?: string;
    message: string;
    timeOut?: number;
    extendedTimeOut?: number;
    tapToDismiss?: boolean;
    closeButton?: boolean;
    progressBar?: boolean;
    onCloseClick?: () => void;
}

export interface ToastrLike {
    info(message: string, title?: string, options?: ToastrType): unknown;
    success(message: string, title?: string, options?: ToastrType): unknown;
    warning(message: string, title?: string, options?: ToastrType): unknown;
    error(message: string, title?: string, options?: ToastrType): unknown;
    clear(toast?: unknown): void;
}

/**
 * SillyTavern context surface used by Summaryception. TauriTavern preserves
 * this from ST 1.18.0, so the shapes match upstream.
 */
export interface SillyTavernContext {
    chat: ChatMessage[];
    chatMetadata: ChatMetadata;
    extensionSettings: Record<string, Record<string, unknown>>;
    name1: string;
    name2: string;
    characterId?: string | number;
    groupId?: string | number;
    chatId?: string | number;

    saveSettingsDebounced(): void;
    saveMetadata(): Promise<void>;
    saveChat(): Promise<void>;

    eventSource: {
        on(type: string | number, handler: (...args: unknown[]) => void): void;
        off(type: string | number, handler: (...args: unknown[]) => void): void;
        once(type: string | number, handler: (...args: unknown[]) => void): void;
        makeLast(eventType: string | number, handler: (...args: unknown[]) => void): void;
        removeListener(type: string | number, handler: (...args: unknown[]) => void): void;
    };

    event_types: Record<string, string | number>;

    setExtensionPrompt(
        name: string,
        value: string,
        position: number,
        depth: number,
        scan?: boolean,
        order?: number,
    ): void;

    generateRaw(
        prompt: string | { prompt: string; systemPrompt?: string; responseLength?: number },
        systemPrompt?: string,
        responseLength?: number,
    ): Promise<string>;

    executeSlashCommandsWithOptions(
        command: string,
        options?: { showOutput?: boolean },
    ): Promise<unknown>;

    promptManager?: {
        getPromptCollection(): { collection: Array<{ identifier: string }> } | null;
        getPromptOrderEntries(): Array<{ identifier: string; enabled: boolean }> | null;
    };

    getRequestHeaders?(): Record<string, string>;

    ConnectionManagerRequestService?: {
        sendRequest(
            profileId: string,
            messages: string | Array<{ role: string; content: string }>,
            options?: Record<string, unknown>,
        ): Promise<unknown>;
        handleDropdown?(select: HTMLSelectElement): void;
    };

    renderExtensionTemplateAsync(
        path: string,
        templateName: string,
        data?: Record<string, unknown>,
    ): Promise<string>;
}

// ─── Host access helpers ──────────────────────────────────────────────

export function getHostApi(): TauriTavernHostApi | null {
    return window.__TAURITAVERN__?.api ?? null;
}

export async function waitForHostReady(): Promise<void> {
    const ready = window.__TAURITAVERN__?.ready ?? window.__TAURITAVERN_MAIN_READY__;
    if (ready) {
        await ready;
    }
}

export function getSillyTavernContext(): SillyTavernContext | null {
    try {
        return window.SillyTavern?.getContext() ?? null;
    } catch {
        return null;
    }
}
