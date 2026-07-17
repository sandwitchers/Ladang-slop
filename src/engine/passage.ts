/**
 * Passage builder.
 *
 * Assembles the "story_txt" sent to the summarizer from a range of chat
 * messages. User messages become "Player: ..." and assistant messages become
 * "Assistant: ...". Hidden/empty messages are skipped unless they were
 * ghosted by Summaryception.
 */

import type { ChatMessage } from '../host/api';
import type { MessageBuffer } from './messages';

/**
 * Build the passage text for a range of messages [startIdx, endIdx].
 *
 * Rules:
 *   - Messages with no `mes` or empty `mes` are skipped.
 *   - Messages hidden by the user (`is_hidden` or `is_system` without our
 *     `sc_ghosted` flag) are skipped — they shouldn't reach the summarizer.
 *   - Messages ghosted by Summaryception (`extra.sc_ghosted === true`) ARE
 *     included if they're in the range. This happens when the store's
 *     `summarizedUpTo` hasn't advanced yet but ghosting already ran.
 */
export async function buildPassageFromRange(
    buffer: MessageBuffer,
    startIdx: number,
    endIdx: number,
): Promise<string> {
    const messages = await buffer.getRange(startIdx, endIdx);
    const lines: string[] = [];

    for (const m of messages) {
        if (!m.mes || !m.mes.trim()) continue;

        const isUserHidden = (m.is_system || m.is_hidden) && !m.extra?.sc_ghosted;
        if (isUserHidden) continue;

        const speaker = m.is_user ? 'Player' : 'Assistant';
        lines.push(`${speaker}: ${m.mes.trim()}`);
    }

    return lines.join('\n');
}

/**
 * Build a full context string from all layers down to (and including) a
 * target layer.
 *
 * Deepest layers come first in the string, target layer last. This gives the
 * summarizer full awareness of what's already been captured so it can write
 * a minimal diff instead of a redundant recap.
 *
 * If `excludeSnippet` is provided, that snippet is skipped (used during
 * regeneration to avoid the snippet being its own context).
 */
export function buildFullContext(
    layers: import('../store/chat-store').Snippet[][],
    downToLayer: number,
    exclude?: { layer: number; index: number },
): string {
    const parts: string[] = [];

    for (let i = layers.length - 1; i >= downToLayer; i--) {
        const layer = layers[i];
        if (!layer || layer.length === 0) continue;
        for (let j = 0; j < layer.length; j++) {
            if (exclude && exclude.layer === i && exclude.index === j) continue;
            const sn = layer[j];
            if (sn) parts.push(sn.text);
        }
    }

    return parts.length > 0 ? parts.join(' ') : '(none yet)';
}
