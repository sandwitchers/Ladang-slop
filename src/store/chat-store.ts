/**
 * Per-chat state store.
 *
 * Original Summaryception used `chatMetadata[MODULE_NAME]` +
 * `saveMetadata()`. The TauriTavern port uses the host ABI:
 *   handle.metadata.setExtension({ namespace, value })
 *   handle.metadata.get()
 *
 * This gives us per-chat isolated storage that is managed by the Rust backend
 * and transparently handles windowed-payload boundaries.
 *
 * The store is async because every read/write goes through the host ABI.
 * A reactive cache is kept in memory so the UI can watch it without awaiting
 * on every render.
 */

import { reactive } from 'vue';
import type { TauriTavernChatHandle } from '../host/api';

const NAMESPACE = 'summaryception';

// ─── Types ────────────────────────────────────────────────────────────

export interface Snippet {
    text: string;
    turnRange?: [number, number];
    timestamp: number;
    promoted?: boolean;
    seedFromLayer?: number;
    fromLayer?: number;
    mergedCount?: number;
    regenerated?: boolean;
}

export interface ChatStoreState {
    layers: Snippet[][];
    summarizedUpTo: number;
    ghostedIndices: number[];
}

export function createEmptyChatStore(): ChatStoreState {
    return {
        layers: [],
        summarizedUpTo: -1,
        ghostedIndices: [],
    };
}

// ─── Store ────────────────────────────────────────────────────────────

export interface ChatStore {
    state: ChatStoreState;
    isLoaded: boolean;
    currentChatRef: unknown;
    load(handle: TauriTavernChatHandle): Promise<void>;
    save(handle: TauriTavernChatHandle | null): Promise<void>;
    reset(handle: TauriTavernChatHandle | null): Promise<void>;
    replace(newState: ChatStoreState): void;
    /** Import an external store (used by the Import Memory button). */
    importFrom(handle: TauriTavernChatHandle, data: ChatStoreState): Promise<void>;
}

let storeInstance: ChatStore | null = null;

export function createChatStore(): ChatStore {
    if (storeInstance) return storeInstance;

    const state = reactive(createEmptyChatStore()) as ChatStoreState;
    let loaded = false;
    let lastChatRef: unknown = null;

    async function readFromHost(handle: TauriTavernChatHandle): Promise<ChatStoreState | null> {
        try {
            const metadata = await handle.metadata.get();
            const raw = metadata[NAMESPACE];
            if (!raw || typeof raw !== 'object') return null;

            const parsed = raw as Partial<ChatStoreState>;
            const result = createEmptyChatStore();

            if (Array.isArray(parsed.layers)) {
                result.layers = parsed.layers.map((layer) =>
                    Array.isArray(layer) ? [...layer] : [],
                );
            }
            if (typeof parsed.summarizedUpTo === 'number') {
                result.summarizedUpTo = parsed.summarizedUpTo;
            }
            if (Array.isArray(parsed.ghostedIndices)) {
                result.ghostedIndices = [...parsed.ghostedIndices];
            }

            return result;
        } catch (err) {
            console.error('[Summaryception] Failed to read chat store from host metadata', err);
            return null;
        }
    }

    async function load(handle: TauriTavernChatHandle): Promise<void> {
        const ref = handle.ref;
        lastChatRef = ref;

        const loaded_state = await readFromHost(handle);
        if (loaded_state) {
            state.layers = loaded_state.layers;
            state.summarizedUpTo = loaded_state.summarizedUpTo;
            state.ghostedIndices = loaded_state.ghostedIndices;
        } else {
            const empty = createEmptyChatStore();
            state.layers = empty.layers;
            state.summarizedUpTo = empty.summarizedUpTo;
            state.ghostedIndices = empty.ghostedIndices;
        }
        loaded = true;
    }

    async function save(handle: TauriTavernChatHandle | null): Promise<void> {
        if (!loaded || !handle) return;
        try {
            const snapshot: ChatStoreState = {
                layers: state.layers.map((layer) => [...layer]),
                summarizedUpTo: state.summarizedUpTo,
                ghostedIndices: [...state.ghostedIndices],
            };
            await handle.metadata.setExtension({ namespace: NAMESPACE, value: snapshot });
        } catch (err) {
            console.error('[Summaryception] Failed to save chat store to host metadata', err);
        }
    }

    async function reset(handle: TauriTavernChatHandle | null): Promise<void> {
        const empty = createEmptyChatStore();
        state.layers = empty.layers;
        state.summarizedUpTo = empty.summarizedUpTo;
        state.ghostedIndices = empty.ghostedIndices;
        await save(handle);
    }

    function replace(newState: ChatStoreState): void {
        state.layers = newState.layers.map((layer) => [...layer]);
        state.summarizedUpTo = newState.summarizedUpTo;
        state.ghostedIndices = [...newState.ghostedIndices];
    }

    async function importFrom(handle: TauriTavernChatHandle, data: ChatStoreState): Promise<void> {
        if (!Array.isArray(data.layers)) {
            throw new Error('Invalid store data: layers must be an array');
        }
        replace(data);
        await save(handle);
    }

    storeInstance = {
        state,
        get isLoaded() { return loaded; },
        get currentChatRef() { return lastChatRef; },
        load,
        save,
        reset,
        replace,
        importFrom,
    };

    return storeInstance;
}

// ─── Branch repair ────────────────────────────────────────────────────

/**
 * Detect if the chat was branched before the summarized point.
 *
 * When ST creates a branch at message N, it copies messages 0..N into a new
 * chat file. The host metadata (including our store) is copied as-is, so
 * summarizedUpTo might point beyond the end of the new chat, and snippets may
 * reference turns that no longer exist in this branch.
 *
 * This function trims the store to match reality. Returns true if a repair
 * was performed.
 */
export async function repairIfBranched(
    store: ChatStore,
    handle: TauriTavernChatHandle,
): Promise<boolean> {
    const state = store.state;
    if (state.summarizedUpTo < 0) return false;

    let totalCount: number;
    try {
        const summary = await handle.summary({ includeMetadata: false });
        totalCount = summary.message_count;
    } catch (err) {
        console.error('[Summaryception] Branch repair: failed to get chat summary', err);
        return false;
    }

    if (totalCount === 0) return false;
    if (state.summarizedUpTo < totalCount) return false;

    const oldSummarizedUpTo = state.summarizedUpTo;
    console.warn(
        `[Summaryception] Branch detected! summarizedUpTo (${oldSummarizedUpTo}) >= chat length (${totalCount}). Repairing...`,
    );

    const safeCutoff = totalCount; // messages 0..totalCount-1 exist

    // Remove Layer 0 snippets whose turnRange extends beyond the branch point.
    const layer0 = state.layers[0];
    if (layer0) {
        const before = layer0.length;
        const filtered = layer0.filter((sn) => {
            if (!sn.turnRange) return true; // promoted snippets without turnRange are kept
            return sn.turnRange[1] < safeCutoff;
        });
        if (filtered.length !== before) {
            layer0.length = 0;
            layer0.push(...filtered);
        }
    }

    // Recalculate summarizedUpTo from remaining snippets.
    let newSummarizedUpTo = -1;
    if (state.layers[0] && state.layers[0].length > 0) {
        for (const sn of state.layers[0]) {
            if (sn.turnRange && sn.turnRange[1] > newSummarizedUpTo) {
                newSummarizedUpTo = sn.turnRange[1];
            }
        }
    }
    state.summarizedUpTo = newSummarizedUpTo;

    // Trim ghostedIndices.
    state.ghostedIndices = state.ghostedIndices.filter((idx) => idx < safeCutoff);

    await store.save(handle);

    console.warn(
        `[Summaryception] Branch repair complete. summarizedUpTo: ${oldSummarizedUpTo} → ${store.state.summarizedUpTo}`,
    );
    return true;
}
