/**
 * Injection assembly.
 *
 * Assembles the full summary block from all layers and injects it into the
 * LLM context via SillyTavern's `setExtensionPrompt`.
 *
 * TauriTavern does not expose a native equivalent for `setExtensionPrompt`,
 * so we go through the ST bridge.
 *
 * The assembled block is ordered deepest-layer-first, layer-0-last, so the
 * LLM reads the most compressed (oldest) context first and the freshest
 * turn-level summaries last.
 */

import { clearExtensionPrompt, setExtensionPrompt } from '../host/st-bridge';
import type { SummaryceptionSettings } from '../settings/defaults';
import type { ChatStore } from '../store/chat-store';

const MODULE_NAME = 'summaryception';

let lastInjected = '';

/**
 * Assemble the summary block from all layers.
 *
 * Ordering: deepest layer first (most compressed / oldest), layer 0 last
 * (freshest turn-level summaries). Each layer's snippets are joined in
 * chronological order.
 *
 * Returns an empty string if there are no snippets in any layer.
 */
export function assembleSummaryBlock(
    settings: SummaryceptionSettings,
    store: ChatStore,
): string {
    const layers = store.state.layers;
    if (!layers || layers.every((l) => !l || l.length === 0)) return '';

    const snippets: string[] = [];

    // Deeper layers first (index high → low), skip layer 0 for now.
    for (let i = layers.length - 1; i >= 1; i--) {
        const layer = layers[i];
        if (!layer || layer.length === 0) continue;
        for (const sn of layer) {
            snippets.push(sn.text);
        }
    }

    // Layer 0 last.
    if (layers[0] && layers[0].length > 0) {
        for (const sn of layers[0]) {
            snippets.push(sn.text);
        }
    }

    if (snippets.length === 0) return '';
    return settings.injectionTemplate.replace('{{summary}}', snippets.join(' '));
}

/**
 * Update the injected prompt.
 *
 * Skips the ST call if the block hasn't changed since last injection (saves
 * a redundant setExtensionPrompt round-trip). Clears the prompt entirely if
 * the extension is disabled.
 */
export function updateInjection(
    settings: SummaryceptionSettings,
    store: ChatStore,
): void {
    try {
        if (!settings.enabled) {
            if (lastInjected !== '') {
                clearExtensionPrompt();
                lastInjected = '';
            }
            return;
        }

        const block = assembleSummaryBlock(settings, store);
        if (block === lastInjected) return;

        setExtensionPrompt(block || '');
        lastInjected = block || '';

        if (settings.debugMode) {
            console.log(`[${MODULE_NAME}] Injection updated: ${block.length} chars`);
        }
    } catch (err) {
        console.error(`[${MODULE_NAME}] updateInjection error:`, err);
    }
}

/**
 * Force-clear the injection. Called during dispose/unmount.
 */
export function clearInjection(): void {
    if (lastInjected !== '') {
        clearExtensionPrompt();
        lastInjected = '';
    }
}
