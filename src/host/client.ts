import {
    getHostApi,
    type ChatHistoryPage,
    type ChatMessage,
    type ChatRef,
    type TauriTavernChatApi,
    type TauriTavernChatHandle,
    type TauriTavernHostApi,
} from './api';

export type HostCapability = 'chat' | 'layout';

export interface HostClient {
    api: TauriTavernHostApi;
    capabilities: ReadonlySet<HostCapability>;
    supports(cap: HostCapability): boolean;
    supportsAll(caps: HostCapability[]): boolean;
    getChatApi(): TauriTavernChatApi;
    getCurrentChatHandle(): TauriTavernChatHandle | null;
    getCurrentChatRef(): ChatRef | null;
}

function collectCapabilities(api: TauriTavernHostApi): Set<HostCapability> {
    const caps = new Set<HostCapability>();
    if (api.chat) caps.add('chat');
    if (api.layout) caps.add('layout');
    return caps;
}

export function createHostClient(api: TauriTavernHostApi | null = getHostApi()): HostClient {
    if (!api) {
        throw new Error('TauriTavern host API is unavailable.');
    }

    const capabilities = collectCapabilities(api);

    return {
        api,
        capabilities,
        supports(cap) {
            return capabilities.has(cap);
        },
        supportsAll(caps) {
            return caps.every((c) => capabilities.has(c));
        },
        getChatApi() {
            if (!api.chat) {
                throw new Error('Chat API is unavailable on this TauriTavern host.');
            }
            return api.chat;
        },
        getCurrentChatHandle() {
            if (!api.chat) return null;
            try {
                return api.chat.current.handle();
            } catch {
                return null;
            }
        },
        getCurrentChatRef() {
            if (!api.chat) return null;
            try {
                return api.chat.current.ref();
            } catch {
                return null;
            }
        },
    };
}

// Re-export the message access types for convenience.
export type { ChatHistoryPage, ChatMessage, ChatRef, TauriTavernChatHandle };
