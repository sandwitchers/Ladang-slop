<template>
    <div class="sc-stats-box">
        <div class="sc-layer-stat">
            👻 <strong>{{ ghostedCount }}</strong>
            {{ ghostingLabel }}
        </div>
        <div v-for="entry in layerEntries" :key="entry.idx" class="sc-layer-stat">
            <span class="sc-layer-label">{{ entry.label }}:</span>
            <strong>{{ entry.count }}</strong> / {{ snippetsPerLayer }} snippets
        </div>
        <div class="sc-layer-stat sc-muted">
            Summarized up to chat index: {{ summarizedUpTo }}
        </div>
        <div v-if="!hasAny" class="sc-layer-stat sc-muted">No summaries yet for this chat.</div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEngine } from '../ui/useEngine';

const engine = useEngine();
const store = engine.chatStore;
const settings = engine.settings;

const ghostedCount = computed(() => store.state.ghostedIndices.length);

const ghostingLabel = computed(() =>
    settings.state.disableGhosting
        ? 'messages ghosted (metadata only — not visually hidden)'
        : 'messages ghosted (hidden from LLM, visible to you)',
);

const snippetsPerLayer = computed(() => settings.state.snippetsPerLayer);

const summarizedUpTo = computed(() => store.state.summarizedUpTo ?? -1);

const layerEntries = computed(() => {
    const layers = store.state.layers;
    if (!layers) return [];
    const entries: Array<{ idx: number; label: string; count: number }> = [];
    for (let i = layers.length - 1; i >= 0; i--) {
        const layer = layers[i];
        if (!layer || layer.length === 0) continue;
        entries.push({
            idx: i,
            label: i === 0 ? 'Layer 0 (turn summaries)' : `Layer ${i} (depth ${i} meta)`,
            count: layer.length,
        });
    }
    return entries;
});

const hasAny = computed(() => layerEntries.value.length > 0);
</script>
