/**
 * Layer promotion — the "ception" of Summaryception.
 *
 * When a layer fills up (default: 30 snippets), the oldest snippets are
 * promoted to the next deeper layer:
 *
 * 1. Seed promotion — The first time a deeper layer opens, the oldest
 *    snippet is promoted directly as a seed (no LLM call). This preserves
 *    maximum information as the foundation.
 *
 * 2. Subsequent promotions — Overflow snippets (default: 3 at a time) are
 *    summarized together against the destination layer's existing content
 *    as prior context.
 *
 * 3. Cascade — If the destination layer also fills up, the process repeats,
 *    creating Layer 2, Layer 3, etc.
 */

import { toastInfo } from '../host/st-bridge';
import type { SummaryceptionSettings } from '../settings/defaults';
import type { ChatStore, Snippet } from '../store/chat-store';
import { buildFullContext } from './passage';
import { callSummarizer } from './summarizer';

const MODULE_NAME = 'summaryception';

function log(settings: SummaryceptionSettings, ...args: unknown[]): void {
    if (settings.debugMode) console.log(`[${MODULE_NAME}]`, ...args);
}

/**
 * Check if a layer needs promotion, and if so, promote.
 *
 * This function is recursive: if promoting to layer N+1 causes layer N+1 to
 * overflow, it calls itself for layer N+1.
 */
export async function maybePromoteLayer(
    settings: SummaryceptionSettings,
    store: ChatStore,
    layerIndex: number,
): Promise<void> {
    if (layerIndex >= settings.maxLayers - 1) {
        log(settings, `Max layer depth (${settings.maxLayers}) reached.`);
        return;
    }

    const state = store.state;
    const layer = state.layers[layerIndex];
    if (!layer || layer.length <= settings.snippetsPerLayer) return;

    log(
        settings,
        `Layer ${layerIndex}: ${layer.length} snippets > limit ${settings.snippetsPerLayer} → promoting`,
    );

    // Ensure destination layer exists.
    if (!state.layers[layerIndex + 1]) {
        state.layers.push([]);
    }
    const destLayer = state.layers[layerIndex + 1]!;

    // ─── Seed promotion ───
    if (destLayer.length === 0) {
        const seed = layer.shift() as Snippet;
        seed.promoted = true;
        seed.seedFromLayer = layerIndex;
        destLayer.push(seed);

        log(
            settings,
            `Seeded Layer ${layerIndex + 1} with oldest snippet from Layer ${layerIndex} (no LLM call)`,
        );

        toastInfo(
            `Seeded Layer ${layerIndex + 1} from Layer ${layerIndex} (free promotion)`,
            'Summaryception',
            { timeOut: 2000 },
        );

        // Recurse: source layer might still be over limit, and dest layer
        // might now have 1 snippet (which is fine, but check cascade).
        if (layer.length > settings.snippetsPerLayer) {
            await maybePromoteLayer(settings, store, layerIndex);
        }
        if (destLayer.length > settings.snippetsPerLayer) {
            await maybePromoteLayer(settings, store, layerIndex + 1);
        }
        return;
    }

    // ─── Subsequent promotion: summarize overflow snippets ───
    const toMerge = layer.splice(0, settings.snippetsPerPromotion) as Snippet[];
    const storyTxt = toMerge.map((sn) => sn.text).join(' ');
    const contextStr = buildFullContext(state.layers, layerIndex + 1);

    toastInfo(
        `Promoting ${toMerge.length} snippets: Layer ${layerIndex} → Layer ${layerIndex + 1}`,
        'Summaryception',
        { timeOut: 3000, progressBar: true },
    );

    const metaSummary = await callSummarizer(settings, storyTxt, contextStr);
    if (!metaSummary) {
        // Summarizer failed — put the snippets back.
        layer.unshift(...toMerge);
        return;
    }

    destLayer.push({
        text: metaSummary,
        fromLayer: layerIndex,
        mergedCount: toMerge.length,
        timestamp: Date.now(),
    });

    log(settings, `Layer ${layerIndex + 1} now has ${destLayer.length} snippets`);

    if (layer.length > settings.snippetsPerLayer) {
        await maybePromoteLayer(settings, store, layerIndex);
    }
    if (destLayer.length > settings.snippetsPerLayer) {
        await maybePromoteLayer(settings, store, layerIndex + 1);
    }
}
