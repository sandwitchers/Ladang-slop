<template>
    <div class="sc-snippet-browser">
        <div v-if="!hasSnippets" class="sc-muted">No snippets to display.</div>
        <div v-else>
            <div
                v-for="(layer, layerIdx) in reversedLayers"
                :key="layerIdx"
                class="sc-browser-layer"
            >
                <div class="sc-browser-layer-title">
                    {{ layerLabel(layerIdx) }}
                </div>
                <div
                    v-for="(sn, snippetIdx) in layer.snippets"
                    :key="snippetIdx"
                    class="sc-snippet"
                >
                    <textarea
                        v-if="editing === `${layerIdx}-${snippetIdx}`"
                        v-model="editText"
                        class="sc-snippet-edit text_pole"
                        rows="2"
                        @keydown="onEditKeydown($event, layerIdx, snippetIdx)"
                        @blur="onEditBlur(layerIdx, snippetIdx)"
                    ></textarea>
                    <span
                        v-else
                        class="sc-snippet-text"
                        :title="'Click to edit'"
                        @click="onEditStart(layerIdx, snippetIdx, sn.text)"
                    >{{ sn.text }}</span>
                    <span class="sc-snippet-meta">{{ snippetMeta(sn) }}</span>
                    <button
                        v-if="sn.turnRange"
                        class="sc-snippet-redo menu_button fa-solid fa-rotate-right"
                        title="Regenerate this snippet"
                        :disabled="engine.isSummarizing"
                        @click="onRegenerate(layerIdx, snippetIdx)"
                    ></button>
                    <button
                        class="sc-snippet-delete menu_button fa-solid fa-xmark"
                        title="Delete this snippet"
                        @click="onDelete(layerIdx, snippetIdx)"
                    ></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useEngine } from '../ui/useEngine';
import { toastInfo, toastSuccess, toastWarning } from '../host/st-bridge';
import type { Snippet } from '../store/chat-store';

const engine = useEngine();
const store = engine.chatStore;

const editing = ref<string | null>(null);
const editText = ref('');

const hasSnippets = computed(() => {
    const layers = store.state.layers;
    return layers && layers.some((l) => l && l.length > 0);
});

// Build a reversed view (deepest first) with original index tracking.
const reversedLayers = computed(() => {
    const layers = store.state.layers;
    if (!layers) return [];
    const result: Array<{ originalIdx: number; snippets: Array<{ snippet: Snippet; originalIdx: number }> }> = [];
    for (let i = layers.length - 1; i >= 0; i--) {
        const layer = layers[i];
        if (!layer || layer.length === 0) continue;
        const snippets = layer.map((snippet, idx) => ({ snippet, originalIdx: idx }));
        result.push({ originalIdx: i, snippets });
    }
    // Flatten into per-layer render data.
    return result.map((entry) => ({
        layerIdx: entry.originalIdx,
        snippets: entry.snippets.map((s) => s.snippet),
        snippetIndices: entry.snippets.map((s) => s.originalIdx),
    }));
});

function layerLabel(reversedIdx: number): string {
    // reversedLayers is already in display order; find the actual layer index.
    const layer = reversedLayers.value[reversedIdx];
    if (!layer) return '';
    const i = layer.layerIdx;
    return i === 0 ? 'Layer 0 (Turn Summaries)' : `Layer ${i} (Meta-Summary)`;
}

function snippetMeta(sn: Snippet): string {
    if (sn.turnRange) {
        return `turns ${sn.turnRange[0]}–${sn.turnRange[1]}`;
    }
    if (sn.mergedCount) {
        return `merged ${sn.mergedCount} from L${sn.fromLayer}`;
    }
    return '';
}

function onEditStart(layerIdx: number, snippetIdx: number, text: string): void {
    editing.value = `${layerIdx}-${snippetIdx}`;
    editText.value = text;
}

async function onEditKeydown(event: KeyboardEvent, layerIdx: number, snippetIdx: number): Promise<void> {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        await commitEdit(layerIdx, snippetIdx);
    } else if (event.key === 'Escape') {
        editing.value = null;
    }
}

async function onEditBlur(layerIdx: number, snippetIdx: number): Promise<void> {
    await commitEdit(layerIdx, snippetIdx);
}

async function commitEdit(layerIdx: number, snippetIdx: number): Promise<void> {
    if (editing.value === null) return;
    const newText = editText.value.trim();
    editing.value = null;
    if (!newText) return;
    try {
        await engine.editSnippet(layerIdx, snippetIdx, newText);
        toastSuccess('Snippet updated', 'Summaryception', { timeOut: 1500 });
    } catch (err) {
        console.error('[Summaryception] Edit failed', err);
    }
}

async function onRegenerate(layerIdx: number, snippetIdx: number): Promise<void> {
    try {
        await engine.regenerateSnippet(layerIdx, snippetIdx);
        toastSuccess('Snippet regenerated', 'Summaryception', { timeOut: 3000 });
    } catch (err) {
        console.error('[Summaryception] Regenerate failed', err);
        toastWarning('Regeneration failed.', 'Summaryception');
    }
}

async function onDelete(layerIdx: number, snippetIdx: number): Promise<void> {
    try {
        await engine.deleteSnippet(layerIdx, snippetIdx);
        toastInfo(`Snippet removed from Layer ${layerIdx}`, 'Summaryception');
    } catch (err) {
        console.error('[Summaryception] Delete failed', err);
    }
}
</script>
