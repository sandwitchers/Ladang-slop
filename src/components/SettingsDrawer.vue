<template>
    <div class="sc-row">
        <label class="checkbox_label" for="sc_enabled">
            <input id="sc_enabled" v-model="enabled" type="checkbox" @change="onEnabledChange" />
            <span>Enable Summaryception</span>
        </label>
    </div>

    <div class="sc-row">
        <label class="checkbox_label" for="sc_pause_summarization">
            <input
                id="sc_pause_summarization"
                v-model="pauseSummarization"
                type="checkbox"
                @change="onPauseChange"
            />
            <span>Pause Summarization</span>
            <small class="sc-hint">
                Stop processing new turns while keeping existing summaries injected. Preserves
                prompt cache hits. Unpause or use Force Summarize to catch up.
            </small>
        </label>
    </div>

    <div class="sc-row">
        <label class="checkbox_label" for="sc_disable_ghosting">
            <input
                id="sc_disable_ghosting"
                v-model="disableGhosting"
                type="checkbox"
                @change="onGhostingChange"
            />
            <span>Disable Message Hiding</span>
            <small class="sc-hint">
                Messages will still be summarized and excluded from LLM context, but won't be
                visually hidden. Useful for compatibility with other extensions.
            </small>
        </label>
    </div>

    <div class="sc-button-row">
        <button
            class="menu_button"
            :disabled="engine.isSummarizing"
            @click="onForceSummarize"
        >
            <i class="fa-solid fa-bolt"></i>
            {{ engine.isSummarizing ? 'Working…' : 'Force Summarize Now' }}
        </button>
        <button
            class="menu_button menu_button_danger"
            :disabled="!engine.isSummarizing"
            @click="onStop"
        >
            <i class="fa-solid fa-stop"></i> Stop
        </button>
        <button class="menu_button" :disabled="engine.isSummarizing" @click="onRepair">
            <i class="fa-solid fa-wrench"></i> Repair Orphans
        </button>
    </div>

    <div class="sc-button-row">
        <button class="menu_button" @click="onImport">
            <i class="fa-solid fa-download"></i> Import Memory
        </button>
        <button class="menu_button" @click="engine.exportMemory()">
            <i class="fa-solid fa-upload"></i> Export Memory
        </button>
        <button class="menu_button menu_button_danger" @click="onClearMemory">
            <i class="fa-solid fa-trash"></i> Clear Memory
        </button>
    </div>

    <input
        ref="importInput"
        type="file"
        accept=".json"
        style="display: none"
        @change="onImportFile"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useEngine } from '../ui/useEngine';
import { toastInfo, toastSuccess, toastWarning } from '../host/st-bridge';

const engine = useEngine();
const settings = engine.settings;

const enabled = ref(settings.state.enabled);
const pauseSummarization = ref(settings.state.pauseSummarization);
const disableGhosting = ref(settings.state.disableGhosting);
const importInput = ref<HTMLInputElement | null>(null);

function onEnabledChange(): void {
    settings.update({ enabled: enabled.value });
    engine.refresh();
}

function onPauseChange(): void {
    settings.update({ pauseSummarization: pauseSummarization.value });
    if (pauseSummarization.value) {
        toastInfo(
            'Summarization paused. Existing summaries will continue to be injected. Use Force Summarize or unpause to catch up.',
            'Summaryception',
            { timeOut: 5000 },
        );
    } else {
        toastInfo(
            'Summarization resumed. Will process new turns automatically.',
            'Summaryception',
            { timeOut: 3000 },
        );
    }
}

function onGhostingChange(): void {
    settings.update({ disableGhosting: disableGhosting.value });
    if (disableGhosting.value) {
        toastInfo(
            'Message hiding disabled. Summarized messages will remain visible but still be excluded from LLM context via the sc_ghosted flag.',
            'Summaryception',
            { timeOut: 5000 },
        );
    }
}

async function onForceSummarize(): Promise<void> {
    try {
        await engine.forceSummarize();
    } catch (err) {
        console.error('[Summaryception] Force summarize failed', err);
        toastWarning('Force summarize failed. Check console for details.', 'Summaryception');
    }
}

function onStop(): void {
    engine.stopSummarization();
    toastWarning('Summarization stopped. Progress has been saved.', 'Summaryception', {
        timeOut: 4000,
    });
}

async function onRepair(): Promise<void> {
    try {
        await engine.repairOrphans();
    } catch (err) {
        console.error('[Summaryception] Repair failed', err);
        toastWarning('Repair failed. Check console for details.', 'Summaryception');
    }
}

function onImport(): void {
    importInput.value?.click();
}

async function onImportFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
        await engine.importMemory(file);
    } catch (err) {
        console.error('[Summaryception] Import failed', err);
    }
    input.value = '';
}

async function onClearMemory(): Promise<void> {
    if (!confirm('Clear ALL Summaryception memory for this chat and unghost all messages?')) return;
    try {
        await engine.clearMemory();
        toastSuccess('Memory cleared.', 'Summaryception');
    } catch (err) {
        console.error('[Summaryception] Clear memory failed', err);
        toastWarning('Clear memory failed. Check console for details.', 'Summaryception');
    }
}
</script>
