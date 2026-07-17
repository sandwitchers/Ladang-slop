/**
 * Message access via TauriTavern history API.
 *
 * TauriTavern's windowed-payload design means `getContext().chat` only
 * contains the most recent N messages. To access older messages we use
 * `handle.history.tail` (recent page) and `handle.history.before` (page
 * backwards). This module provides a forward-iterable buffer over the full
 * chat history with on-demand paging.
 */

import type {
    ChatHistoryPage,
    ChatMessage,
    TauriTavernChatHandle,
} from '../host/api';
import type { HostClient } from '../host/client';

// ─── Types ────────────────────────────────────────────────────────────

export interface AssistantTurn {
    index: number;
    mes: string;
    name: string;
}

// ─── MessageBuffer ────────────────────────────────────────────────────

const PAGE_LIMIT = 100;

/**
 * A paged, forward-indexable view over the full chat history.
 *
 * Pages are fetched lazily from the tail backwards. Once cached, individual
 * messages can be accessed by absolute index in O(1) per page lookup.
 */
export class MessageBuffer {
    private pages: ChatHistoryPage[] = [];
    private totalCount = 0;
    private handle: TauriTavernChatHandle;

    constructor(handle: TauriTavernChatHandle) {
        this.handle = handle;
    }

    async init(): Promise<void> {
        const tail = await this.handle.history.tail({ limit: PAGE_LIMIT });
        this.totalCount = tail.totalCount;
        this.pages = [tail];
    }

    getTotalCount(): number {
        return this.totalCount;
    }

    /**
     * Lowest absolute index currently cached. Messages below this are NOT
     * in the buffer; callers must call `ensureCoverage` before accessing them.
     */
    lowestCachedIndex(): number {
        if (this.pages.length === 0) return this.totalCount;
        const last = this.pages[this.pages.length - 1];
        if (!last) return this.totalCount;
        return last.startIndex;
    }

    /**
     * Fetch pages backwards until `index` is within the cached range, or we
     * hit the beginning of the chat.
     */
    async ensureCoverage(index: number): Promise<void> {
        if (index < 0) return;
        if (this.pages.length === 0) await this.init();

        while (this.lowestCachedIndex() > index) {
            const oldest = this.pages[this.pages.length - 1];
            if (!oldest || !oldest.hasMoreBefore) return;
            try {
                const older = await this.handle.history.before(oldest, { limit: PAGE_LIMIT });
                this.pages.push(older);
            } catch (err) {
                console.error('[Summaryception] Failed to fetch history page', err);
                return;
            }
        }
    }

    /**
     * Get a single message by absolute index. Returns null if the index is
     * out of range or the page couldn't be loaded.
     */
    async getMessage(index: number): Promise<ChatMessage | null> {
        if (index < 0 || index >= this.totalCount) return null;
        await this.ensureCoverage(index);
        return this.getMessageCached(index);
    }

    private getMessageCached(index: number): ChatMessage | null {
        for (const page of this.pages) {
            const local = index - page.startIndex;
            if (local >= 0 && local < page.messages.length) {
                return page.messages[local] ?? null;
            }
        }
        return null;
    }

    /**
     * Get messages in the inclusive range [startIdx, endIdx].
     *
     * Pages are fetched as needed. Missing messages (gaps that couldn't be
     * loaded) are silently skipped.
     */
    async getRange(startIdx: number, endIdx: number): Promise<ChatMessage[]> {
        if (startIdx > endIdx) return [];
        if (startIdx < 0) startIdx = 0;
        if (endIdx >= this.totalCount) endIdx = this.totalCount - 1;
        if (startIdx > endIdx) return [];

        await this.ensureCoverage(startIdx);

        const result: ChatMessage[] = [];
        for (let i = startIdx; i <= endIdx; i++) {
            const msg = this.getMessageCached(i);
            if (msg) result.push(msg);
        }
        return result;
    }

    /**
     * Iterate all messages from `startIdx` to the end of the chat, applying
     * a filter. Returns the matching messages with their absolute indices.
     */
    async collectFiltered(
        startIdx: number,
        predicate: (msg: ChatMessage, index: number) => boolean,
        options: { limit?: number; scanLimit?: number } = {},
    ): Promise<Array<{ index: number; message: ChatMessage }>> {
        const limit = options.limit ?? Infinity;
        const scanLimit = options.scanLimit ?? Infinity;

        const result: Array<{ index: number; message: ChatMessage }> = [];
        let scanned = 0;

        for (let i = startIdx; i < this.totalCount && result.length < limit && scanned < scanLimit; i++) {
            const msg = await this.getMessage(i);
            scanned++;
            if (!msg) continue;
            if (predicate(msg, i)) {
                result.push({ index: i, message: msg });
            }
        }

        return result;
    }
}

// ─── Buffer factory ───────────────────────────────────────────────────

let bufferInstance: MessageBuffer | null = null;
let bufferChatRef: unknown = null;

/**
 * Get or create a MessageBuffer for the current chat.
 *
 * If the chat has changed (different ref), the old buffer is discarded and a
 * new one is created. This ensures we never serve stale pages from a
 * different chat.
 */
export async function getMessageBuffer(host: HostClient): Promise<MessageBuffer> {
    const handle = host.getCurrentChatHandle();
    if (!handle) {
        throw new Error('No active chat handle available.');
    }

    const ref = handle.ref;
    const refKey = JSON.stringify(ref);

    if (bufferInstance && bufferChatRef === refKey) {
        return bufferInstance;
    }

    bufferInstance = new MessageBuffer(handle);
    bufferChatRef = refKey;
    await bufferInstance.init();
    return bufferInstance;
}

/**
 * Invalidate the cached buffer. Call this when the chat changes.
 */
export function invalidateMessageBuffer(): void {
    bufferInstance = null;
    bufferChatRef = null;
}

// ─── Assistant turn helpers ───────────────────────────────────────────

/**
 * Determine if a message is an assistant turn.
 *
 * A message counts as assistant if:
 *   - It's not a user message.
 *   - It's not a system message (UNLESS it was ghosted by us, in which case
 *     ST may have flipped is_system on it).
 *   - It has non-empty `mes`.
 *
 * The `ghostedIndices` set is used as a fallback for windowed-out messages
 * where `extra.sc_ghosted` can't be set.
 */
export function isAssistantTurn(
    msg: ChatMessage,
    absoluteIndex: number,
    ghostedIndices: ReadonlySet<number>,
): boolean {
    if (!msg || !msg.mes || !msg.mes.trim()) return false;
    if (msg.is_user) return false;
    const isOurGhost = msg.extra?.sc_ghosted === true || ghostedIndices.has(absoluteIndex);
    if (msg.is_system && !isOurGhost) return false;
    return true;
}

export function isGhosted(
    msg: ChatMessage | null,
    absoluteIndex: number,
    ghostedIndices: ReadonlySet<number>,
): boolean {
    if (!msg) return ghostedIndices.has(absoluteIndex);
    return msg.extra?.sc_ghosted === true || ghostedIndices.has(absoluteIndex);
}

/**
 * Collect all assistant turns from `startIdx` to end of chat.
 *
 * Ghosted turns ARE included (the original Summaryception counts them as
 * "all assistant turns" for the purpose of determining overflow).
 */
export async function getAssistantTurns(
    buffer: MessageBuffer,
    startIdx: number,
    ghostedIndices: ReadonlySet<number>,
    options: { scanLimit?: number } = {},
): Promise<AssistantTurn[]> {
    const hits = await buffer.collectFiltered(
        startIdx,
        (msg, idx) => isAssistantTurn(msg, idx, ghostedIndices),
        options,
    );
    return hits.map(({ index, message }) => ({
        index,
        mes: message.mes,
        name: message.name || 'Assistant',
    }));
}

/**
 * Collect only VISIBLE (non-ghosted) assistant turns.
 */
export async function getVisibleAssistantTurns(
    buffer: MessageBuffer,
    startIdx: number,
    ghostedIndices: ReadonlySet<number>,
    options: { scanLimit?: number } = {},
): Promise<AssistantTurn[]> {
    const hits = await buffer.collectFiltered(
        startIdx,
        (msg, idx) =>
            isAssistantTurn(msg, idx, ghostedIndices) &&
            !isGhosted(msg, idx, ghostedIndices),
        options,
    );
    return hits.map(({ index, message }) => ({
        index,
        mes: message.mes,
        name: message.name || 'Assistant',
    }));
}
