<template>
    <div class="sc-settings">
        <div class="inline-drawer">
            <div class="inline-drawer-toggle inline-drawer-header" @click="toggleOpen">
                <b>🧠 Summaryception</b>
                <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down" :class="{ rotated: isOpen }"></div>
            </div>
            <div v-show="isOpen" class="inline-drawer-content">
                <SettingsDrawer />

                <hr class="sc-divider" />

                <h4 class="sc-section-title">🗂️ Snippet Browser</h4>
                <SnippetBrowser />

                <hr class="sc-divider" />

                <h4 class="sc-section-title">👁️ Injection Preview</h4>
                <InjectionPreview />

                <hr class="sc-divider" />

                <h4 class="sc-section-title">📊 Layer Stats</h4>
                <LayerStats />

                <hr class="sc-divider" />

                <AdvancedSettings />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SettingsDrawer from './components/SettingsDrawer.vue';
import SnippetBrowser from './components/SnippetBrowser.vue';
import InjectionPreview from './components/InjectionPreview.vue';
import LayerStats from './components/LayerStats.vue';
import AdvancedSettings from './components/AdvancedSettings.vue';

const isOpen = ref(true);

function toggleOpen(): void {
    isOpen.value = !isOpen.value;
}
</script>
