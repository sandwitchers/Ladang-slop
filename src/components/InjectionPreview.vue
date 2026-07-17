<template>
    <div>
        <textarea
            class="text_pole sc-textarea sc-preview"
            rows="6"
            readonly
            :value="previewText"
        ></textarea>
        <div class="sc-button-row">
            <button class="menu_button" @click="engine.refresh()">
                <i class="fa-solid fa-rotate"></i> Refresh
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEngine } from '../ui/useEngine';
import { assembleSummaryBlock } from '../engine/injection';

const engine = useEngine();

const previewText = computed(() => {
    try {
        return assembleSummaryBlock(engine.settings.state, engine.chatStore) || '(empty — no summaries yet)';
    } catch (err) {
        console.error('[Summaryception] Preview assembly failed', err);
        return '(error assembling preview)';
    }
});
</script>
