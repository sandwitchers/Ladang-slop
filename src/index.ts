/**
 * Summaryception for TauriTavern — entry point.
 *
 * This module:
 *   1. Waits for the DOM and the TauriTavern host to be ready.
 *   2. Creates the HostClient (capability detection over window.__TAURITAVERN__).
 *   3. Creates the engine (host + settings + chat store + pipeline).
 *   4. Mounts the Vue app into #extensions_settings2.
 *   5. Binds SillyTavern events (MESSAGE_RECEIVED, CHAT_CHANGED,
 *      GENERATION_STARTED, APP_READY).
 *   6. Registers slash commands (/sc-status, /sc-preview, /sc-clear).
 *   7. Cleans up on pagehide.
 *
 * Architecture note: TauriTavern preserves the full SillyTavern frontend,
 * so `window.SillyTavern.getContext()` is available. We use TauriTavern's
 * host ABI (window.__TAURITAVERN__.api.chat) for per-chat state and message
 * history, and ST globals only for surfaces with no TauriTavern equivalent
 * (setExtensionPrompt, generateRaw, /hide /unhide, eventSource, promptManager).
 */

import { createApp, type App as VueApp } from 'vue';
import App from './App.vue';
import './style.css';
import { createHostClient, type HostClient } from './host/client';
import { getHostApi, waitForHostReady } from './host/api';
import {
    onAppReady,
    onChatChanged,
    onGenerationStarted,
    onMessageReceived,
    registerSlashCommand,
} from './host/st-bridge';
import { assembleSummaryBlock } from './engine/injection';
import { clearInjection } from './engine/injection';
import { createEngine, ENGINE_KEY } from './ui/useEngine';

const EXTENSION_ID = 'summaryception';
const MOUNT_ID = `${EXTENSION_ID}-mount`;
const LOG_PREFIX = '[Summaryception]';

let app: VueApp<Element> | null = null;
let mountPoint: HTMLDivElement | null = null;
let host: HostClient | null = null;
let disposers: Array<() => void> = [];
let initialized = false;

// ─── Bootstrap helpers ────────────────────────────────────────────────

function waitForDocumentReady(): Promise<void> {
    if (document.readyState !== 'loading') return Promise.resolve();
    return new Promise((resolve) => {
        document.addEventListener('DOMContentLoaded', () => resolve(), { once: true });
    });
}

function getExtensionsSettingsHost(): HTMLElement | null {
    return document.getElementById('extensions_settings2') ?? document.getElementById('extensions_settings');
}

// ─── Slash commands ───────────────────────────────────────────────────

function registerSlashCommands(engine: ReturnType<typeof createEngine>): void {
    registerSlashCommand(
        'sc-status',
        () => {
            const store = engine.chatStore.state;
            const lines: string[] = ['**Summaryception Status**'];
            lines.push(`Summarized up to index: ${store.summarizedUpTo}`);
            if (store.layers) {
                for (let i = 0; i < store.layers.length; i++) {
                    const l = store.layers[i];
                    if (l && l.length > 0) {
                        lines.push(`Layer ${i}: ${l.length} snippets`);
                    }
                }
            }
            lines.push(`Ghosted messages: ${store.ghostedIndices.length}`);
            return lines.join('\n');
        },
        'Show Summaryception layer status',
    );

    registerSlashCommand(
        'sc-clear',
        async () => {
            await engine.clearMemory();
            return 'Summaryception memory cleared and messages unghosted.';
        },
        'Clear all Summaryception memory and unghost messages for this chat',
    );

    registerSlashCommand(
        'sc-preview',
        () => {
            return assembleSummaryBlock(engine.settings.state, engine.chatStore) || '(No summaries yet)';
        },
        'Preview the summary block that would be injected',
    );
}

// ─── Event binding ────────────────────────────────────────────────────

function bindEvents(engine: ReturnType<typeof createEngine>): void {
    // MESSAGE_RECEIVED — trigger summarization on new assistant messages.
    const offMessage = onMessageReceived((index: number) => {
        void engine.onMessageReceived(index);
    });
    disposers.push(offMessage);

    // CHAT_CHANGED — load the new chat's store, repair branches, refresh injection.
    const offChat = onChatChanged(() => {
        void engine.onChatChanged();
    });
    disposers.push(offChat);

    // GENERATION_STARTED — refresh injection before LLM call.
    const offGen = onGenerationStarted(() => {
        engine.onGenerationStarted();
    });
    disposers.push(offGen);

    // APP_READY — final refresh.
    const offReady = onAppReady(() => {
        engine.onAppReady();
        console.log(LOG_PREFIX, 'v5.5.3-tt.1 loaded (TauriTavern native port).');
    });
    disposers.push(offReady);
}

// ─── Mount / unmount ──────────────────────────────────────────────────

function mount(engine: ReturnType<typeof createEngine>): void {
    if (app) return;

    const hostEl = getExtensionsSettingsHost();
    if (!hostEl) {
        console.error(LOG_PREFIX, 'Extensions settings container not found.');
        return;
    }

    document.getElementById(MOUNT_ID)?.remove();
    mountPoint = document.createElement('div');
    mountPoint.id = MOUNT_ID;
    mountPoint.className = 'extension_container';
    hostEl.appendChild(mountPoint);

    app = createApp(App);
    app.provide(ENGINE_KEY, engine);
    app.mount(mountPoint);
    console.log(LOG_PREFIX, 'Vue app mounted.');
}

function unmount(): void {
    for (const dispose of disposers) {
        try {
            dispose();
        } catch (err) {
            console.warn(LOG_PREFIX, 'Disposer error', err);
        }
    }
    disposers = [];

    clearInjection();
    app?.unmount();
    app = null;
    mountPoint?.remove();
    mountPoint = null;
}

// ─── Bootstrap ────────────────────────────────────────────────────────

async function bootstrap(): Promise<void> {
    if (initialized) return;
    initialized = true;

    await waitForDocumentReady();
    await waitForHostReady();

    const hostApi = getHostApi();
    if (!hostApi) {
        console.error(
            LOG_PREFIX,
            'TauriTavern host API is unavailable. This extension requires TauriTavern.',
        );
        return;
    }

    try {
        host = createHostClient(hostApi);
    } catch (err) {
        console.error(LOG_PREFIX, 'Failed to create HostClient', err);
        return;
    }

    if (!host.supports('chat')) {
        console.error(
            LOG_PREFIX,
            'TauriTavern host does not expose the chat API. Summaryception cannot function.',
        );
        return;
    }

    const engine = createEngine(host);
    mount(engine);
    registerSlashCommands(engine);
    bindEvents(engine);

    window.addEventListener('pagehide', () => unmount(), { once: true });
}

void bootstrap().catch((err) => {
    console.error(LOG_PREFIX, 'Bootstrap failed', err);
});
