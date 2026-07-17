/**
 * Engine composable — the single Vue-facing API that ties together the
 * host client, settings store, chat store, and pipeline.
 *
 * Components never import engine modules directly. They call methods on the
 * `useEngine()` return value, which is a singleton provided via
 * `provide/inject` at the app root.
 */

import { inject, reactive, readonly, type InjectionKey } from 'vue';
import type { HostClient } from '../host/client';
import { createSettingsStore, type SettingsStore } from '../settings/store';
import { createChatStore, repairIfBranched, type ChatStore } from '../store/chat-store';
import {
    clearMemory,
    deleteSnippet,
    editSnippet,
    exportMemory,
    forceSummarize,
    getIsSummarizing,
    importMemory,
    maybeSummarizeTurns,
    onChatChanged,
    regenerateSnippet,
    repairOrphans,
    stopSummarization,
    type EngineContext,
} from '../engine/pipeline';
import { updateInjection } from '../engine/injection';

// ─── Types ────────────────────────────────────────────────────────────

export interface EngineApi {
    host: HostClient;
    settings: SettingsStore;
    chatStore: ChatStore;

    /** Reactive flag: true when a summarization cycle is running. */
    isSummarizing: Readonly<boolean>;

    /** Force-run summarization now (overrides pause). */
    forceSummarize(): Promise<void>;

    /** Stop any running summarization. Progress is saved. */
    stopSummarization(): void;

    /** Clear all memory for the current chat and unghost all messages. */
    clearMemory(): Promise<void>;

    /** Repair orphaned (stuck-hidden) messages. */
    repairOrphans(): Promise<number>;

    /** Export the current chat's memory as JSON. */
    exportMemory(): void;

    /** Import memory from a JSON file. */
    importMemory(file: File): Promise<void>;

    /** Regenerate a snippet by re-summarizing its source turns. */
    regenerateSnippet(layerIdx: number, snippetIdx: number): Promise<void>;

    /** Delete a snippet from a layer. */
    deleteSnippet(layerIdx: number, snippetIdx: number): Promise<void>;

    /** Edit a snippet's text in place. */
    editSnippet(layerIdx: number, snippetIdx: number, newText: string): Promise<void>;

    /** Called when a new assistant message arrives (MESSAGE_RECEIVED event). */
    onMessageReceived(index: number): Promise<void>;

    /** Called when the user switches chats (CHAT_CHANGED event). */
    onChatChanged(): Promise<void>;

    /** Called before LLM generation starts (GENERATION_STARTED event). */
    onGenerationStarted(): void;

    /** Called when the app is ready (APP_READY event). */
    onAppReady(): void;

    /** Refresh the injection + UI state. */
    refresh(): void;
}

export const ENGINE_KEY: InjectionKey<EngineApi> = Symbol('summaryception-engine');

// ─── Singleton state ──────────────────────────────────────────────────

let engineInstance: EngineApi | null = null;

export function createEngine(host: HostClient): EngineApi {
    if (engineInstance) return engineInstance;

    const settings = createSettingsStore();
    const chatStore = createChatStore();

    const runtimeState = reactive({ isSummarizing: false });

    function ctx(): EngineContext {
        const handle = host.getCurrentChatHandle();
        if (!handle) {
            throw new Error('No active chat handle. Open a chat first.');
        }
        return {
            host,
            settings: settings.state,
            store: chatStore,
        };
    }

    async function ensureChatLoaded(): Promise<void> {
        const handle = host.getCurrentChatHandle();
        if (!handle) return;
        if (!chatStore.isLoaded || chatStore.currentChatRef !== handle.ref) {
            await chatStore.load(handle);
            await repairIfBranched(chatStore, handle);
        }
    }

    const api: EngineApi = {
        host,
        settings,
        chatStore,

        isSummarizing: readonly(runtimeState).isSummarizing as unknown as Readonly<boolean>,

        async forceSummarize() {
            await ensureChatLoaded();
            runtimeState.isSummarizing = true;
            try {
                await forceSummarize(ctx());
            } finally {
                runtimeState.isSummarizing = getIsSummarizing();
            }
        },

        stopSummarization() {
            stopSummarization(settings.state);
            runtimeState.isSummarizing = false;
        },

        async clearMemory() {
            await ensureChatLoaded();
            await clearMemory(ctx());
        },

        async repairOrphans() {
            await ensureChatLoaded();
            return repairOrphans(ctx());
        },

        exportMemory() {
            exportMemory(chatStore);
        },

        async importMemory(file: File) {
            await ensureChatLoaded();
            await importMemory(ctx(), file);
        },

        async regenerateSnippet(layerIdx: number, snippetIdx: number) {
            await ensureChatLoaded();
            runtimeState.isSummarizing = true;
            try {
                await regenerateSnippet(ctx(), layerIdx, snippetIdx);
            } finally {
                runtimeState.isSummarizing = false;
            }
        },

        async deleteSnippet(layerIdx: number, snippetIdx: number) {
            await ensureChatLoaded();
            await deleteSnippet(ctx(), layerIdx, snippetIdx);
        },

        async editSnippet(layerIdx: number, snippetIdx: number, newText: string) {
            await ensureChatLoaded();
            await editSnippet(ctx(), layerIdx, snippetIdx, newText);
        },

        async onMessageReceived(_index: number) {
            await ensureChatLoaded();
            setTimeout(async () => {
                runtimeState.isSummarizing = true;
                try {
                    await maybeSummarizeTurns(ctx());
                } catch (err) {
                    console.error('[Summaryception] maybeSummarizeTurns failed', err);
                } finally {
                    runtimeState.isSummarizing = getIsSummarizing();
                }
                updateInjection(settings.state, chatStore);
            }, 500);
        },

        async onChatChanged() {
            onChatChanged();
            const handle = host.getCurrentChatHandle();
            if (!handle) return;
            try {
                await chatStore.load(handle);
                await repairIfBranched(chatStore, handle);
            } catch (err) {
                console.error('[Summaryception] Failed to load chat store on chat change', err);
            }
            updateInjection(settings.state, chatStore);
        },

        onGenerationStarted() {
            updateInjection(settings.state, chatStore);
        },

        onAppReady() {
            updateInjection(settings.state, chatStore);
        },

        refresh() {
            updateInjection(settings.state, chatStore);
        },
    };

    settings.subscribe(() => {
        updateInjection(settings.state, chatStore);
    });

    engineInstance = api;
    return api;
}

export function useEngine(): EngineApi {
    const api = inject(ENGINE_KEY);
    if (!api) {
        throw new Error('Engine API not provided. Did you forget to call app.provide(ENGINE_KEY)?');
    }
    return api;
}
