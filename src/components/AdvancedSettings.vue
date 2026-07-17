<template>
    <div class="inline-drawer">
        <div class="inline-drawer-toggle inline-drawer-header" @click="isOpen = !isOpen">
            <b>⚙️ Advanced Settings</b>
            <div
                class="inline-drawer-icon fa-solid fa-circle-chevron-down down"
                :class="{ rotated: isOpen }"
            ></div>
        </div>
        <div v-show="isOpen" class="inline-drawer-content">
            <!-- Connection settings -->
            <ConnectionPanel />

            <hr class="sc-divider" />

            <!-- Verbatim turn settings -->
            <h4 class="sc-section-title">📖 Verbatim Turn Settings</h4>
            <div class="sc-row">
                <label for="sc_verbatim_turns">
                    <span>Verbatim Assistant Turns to Keep</span>
                    <small class="sc-hint">Recent assistant turns sent word-for-word. Older ones are summarized.</small>
                </label>
                <div class="sc-slider-row">
                    <input
                        id="sc_verbatim_turns"
                        v-model.number="verbatimTurns"
                        type="range"
                        min="1"
                        max="50"
                        step="1"
                    />
                    <span class="sc-val">{{ verbatimTurns }}</span>
                </div>
            </div>
            <div class="sc-row">
                <label for="sc_turns_per_summary">
                    <span>Turns per Summary Batch</span>
                    <small class="sc-hint">When limit is exceeded, this many oldest turns are summarized together.</small>
                </label>
                <div class="sc-slider-row">
                    <input
                        id="sc_turns_per_summary"
                        v-model.number="turnsPerSummary"
                        type="range"
                        min="1"
                        max="20"
                        step="1"
                    />
                    <span class="sc-val">{{ turnsPerSummary }}</span>
                </div>
            </div>

            <hr class="sc-divider" />

            <!-- Layer settings -->
            <h4 class="sc-section-title">🔄 Layer Settings (the "ception")</h4>
            <div class="sc-row">
                <label for="sc_snippets_per_layer">
                    <span>Max Snippets per Layer</span>
                    <small class="sc-hint">When exceeded, oldest snippets are promoted into a deeper layer.</small>
                </label>
                <div class="sc-slider-row">
                    <input
                        id="sc_snippets_per_layer"
                        v-model.number="snippetsPerLayer"
                        type="range"
                        min="3"
                        max="100"
                        step="1"
                    />
                    <span class="sc-val">{{ snippetsPerLayer }}</span>
                </div>
            </div>
            <div class="sc-row">
                <label for="sc_snippets_per_promotion">
                    <span>Snippets per Promotion</span>
                    <small class="sc-hint">How many oldest snippets merge when promoting to the next layer.</small>
                </label>
                <div class="sc-slider-row">
                    <input
                        id="sc_snippets_per_promotion"
                        v-model.number="snippetsPerPromotion"
                        type="range"
                        min="2"
                        max="20"
                        step="1"
                    />
                    <span class="sc-val">{{ snippetsPerPromotion }}</span>
                </div>
            </div>
            <div class="sc-row">
                <label for="sc_max_layers">
                    <span>Maximum Layer Depth</span>
                    <small class="sc-hint">How many recursive layers of summarization are allowed.</small>
                </label>
                <div class="sc-slider-row">
                    <input
                        id="sc_max_layers"
                        v-model.number="maxLayers"
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                    />
                    <span class="sc-val">{{ maxLayers }}</span>
                </div>
            </div>

            <hr class="sc-divider" />

            <!-- Prompts -->
            <h4 class="sc-section-title">✏️ Summarizer Prompts</h4>
            <div class="sc-row">
                <label for="sc_summarizer_system_prompt">
                    <span>System Prompt</span>
                </label>
                <textarea
                    id="sc_summarizer_system_prompt"
                    v-model="systemPrompt"
                    class="text_pole sc-textarea"
                    rows="3"
                    @change="onSystemPromptChange"
                ></textarea>
            </div>
            <div class="sc-setting-item">
                <label for="sc_prompt_preset">
                    <small>Prompt Preset</small>
                </label>
                <select
                    id="sc_prompt_preset"
                    v-model="presetValue"
                    class="text_pole"
                    @change="onPresetChange"
                >
                    <option value="narrative">Narrative State (Default)</option>
                    <option value="gamestate">Game State</option>
                    <option value="custom">Custom</option>
                </select>
            </div>

            <!-- Custom prompt manager -->
            <div v-show="presetValue === 'custom'" class="sc-custom-prompt-manager">
                <div class="sc-custom-prompt-row">
                    <div class="sc-custom-prompt-slots">
                        <label for="sc_custom_prompt_slot">
                            <small>Saved Custom Prompts</small>
                        </label>
                        <div class="sc-custom-prompt-slot-row">
                            <select
                                id="sc_custom_prompt_slot"
                                v-model="selectedSlot"
                                class="text_pole"
                            >
                                <option value="">-- Load a saved prompt --</option>
                                <option v-for="name in customPromptNames" :key="name" :value="name">
                                    {{ name }}
                                </option>
                            </select>
                            <button
                                class="menu_button"
                                title="Load selected prompt"
                                @click="onLoadSlot"
                            >
                                <i class="fa-solid fa-folder-open"></i>
                            </button>
                            <button
                                class="menu_button menu_button_danger"
                                title="Delete selected prompt"
                                @click="onDeleteSlot"
                            >
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="sc-custom-prompt-actions">
                        <div class="sc-custom-prompt-save-row">
                            <input
                                id="sc_custom_prompt_name"
                                v-model="newPromptName"
                                type="text"
                                class="text_pole"
                                placeholder="Prompt name..."
                            />
                            <button
                                class="menu_button"
                                title="Save current prompt"
                                @click="onSaveSlot"
                            >
                                <i class="fa-solid fa-floppy-disk"></i> Save
                            </button>
                        </div>
                        <div class="sc-custom-prompt-io-row">
                            <button
                                class="menu_button"
                                title="Export current prompt as .txt"
                                @click="onExportPrompt"
                            >
                                <i class="fa-solid fa-file-export"></i> Export
                            </button>
                            <button
                                class="menu_button"
                                title="Import prompt from .txt"
                                @click="onImportPrompt"
                            >
                                <i class="fa-solid fa-file-import"></i> Import
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="sc-row">
                <label for="sc_summarizer_user_prompt">
                    <span>User Prompt (Turn → Snippet & Layer Promotion)</span>
                    <small class="sc-hint">
                        Variables: <code v-pre>{{player_name}}</code>
                        <code v-pre>{{context_str}}</code> (that layer's existing snippets)
                        <code v-pre>{{story_txt}}</code> (passage to summarize)
                    </small>
                </label>
                <textarea
                    id="sc_summarizer_user_prompt"
                    v-model="userPrompt"
                    class="text_pole sc-textarea sc-textarea-tall"
                    rows="10"
                    @input="onUserPromptInput"
                ></textarea>
            </div>

            <div class="sc-row">
                <label for="sc_injection_template">
                    <span>Injection Wrapper Template</span>
                    <small class="sc-hint">
                        Wraps the assembled block. Use <code v-pre>{{summary}}</code> for the combined text.
                    </small>
                </label>
                <textarea
                    id="sc_injection_template"
                    v-model="injectionTemplate"
                    class="text_pole sc-textarea"
                    rows="3"
                    @change="onInjectionTemplateChange"
                ></textarea>
            </div>

            <hr class="sc-divider" />

            <!-- Strip patterns -->
            <div class="sc-row">
                <label for="sc_strip_patterns">
                    <span>Strip Patterns (one per line)</span>
                    <small class="sc-hint">Tags and prefixes to remove from summarizer output.</small>
                </label>
                <textarea
                    id="sc_strip_patterns"
                    v-model="stripPatternsText"
                    class="text_pole sc-textarea"
                    rows="4"
                    @change="onStripPatternsChange"
                ></textarea>
            </div>

            <hr class="sc-divider" />

            <!-- Debug -->
            <div class="sc-row">
                <label class="checkbox_label" for="sc_debug_mode">
                    <input id="sc_debug_mode" v-model="debugMode" type="checkbox" @change="onDebugChange" />
                    <span>Debug Mode (verbose console logs)</span>
                </label>
            </div>
            <div class="sc-row">
                <label class="checkbox_label" for="sc_trace_mode">
                    <input id="sc_trace_mode" v-model="traceMode" type="checkbox" @change="onTraceChange" />
                    <span>Trace Mode (detailed flow logs)</span>
                </label>
                <small class="sc-hint">Requires Debug Mode to be enabled.</small>
            </div>

            <hr class="sc-divider" />

            <div class="sc-button-row">
                <button class="menu_button" @click="onResetDefaults">
                    <i class="fa-solid fa-arrow-rotate-left"></i> Reset to Defaults
                </button>
            </div>

            <input
                ref="promptImportInput"
                type="file"
                accept=".txt,.text"
                style="display: none"
                @change="onPromptImportFile"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useEngine } from '../ui/useEngine';
import {
    toastError,
    toastInfo,
    toastSuccess,
    toastWarning,
} from '../host/st-bridge';
import ConnectionPanel from './ConnectionPanel.vue';

const engine = useEngine();
const settings = engine.settings;

const isOpen = ref(true);
const promptImportInput = ref<HTMLInputElement | null>(null);

// ─── Sliders ───
const verbatimTurns = computed({
    get: () => settings.state.verbatimTurns,
    set: (v: number) => settings.update({ verbatimTurns: v }),
});
const turnsPerSummary = computed({
    get: () => settings.state.turnsPerSummary,
    set: (v: number) => settings.update({ turnsPerSummary: v }),
});
const snippetsPerLayer = computed({
    get: () => settings.state.snippetsPerLayer,
    set: (v: number) => settings.update({ snippetsPerLayer: v }),
});
const snippetsPerPromotion = computed({
    get: () => settings.state.snippetsPerPromotion,
    set: (v: number) => settings.update({ snippetsPerPromotion: v }),
});
const maxLayers = computed({
    get: () => settings.state.maxLayers,
    set: (v: number) => settings.update({ maxLayers: v }),
});

// ─── Prompts ───
const systemPrompt = ref(settings.state.summarizerSystemPrompt);
const userPrompt = ref(settings.state.summarizerUserPrompt);
const injectionTemplate = ref(settings.state.injectionTemplate);
const stripPatternsText = ref((settings.state.stripPatterns || []).join('\n'));

const presetValue = ref(settings.state.promptPreset);

const customPromptNames = computed(() =>
    Object.keys(settings.state.savedCustomPrompts || {}).sort(),
);

const selectedSlot = ref('');
const newPromptName = ref('');

function onSystemPromptChange(): void {
    settings.update({ summarizerSystemPrompt: systemPrompt.value });
}

function onPresetChange(): void {
    settings.setPromptPreset(presetValue.value);
    // The store may have updated the user prompt.
    userPrompt.value = settings.state.summarizerUserPrompt;
}

function onUserPromptInput(): void {
    settings.setUserPrompt(userPrompt.value);
    presetValue.value = settings.state.promptPreset;
}

function onInjectionTemplateChange(): void {
    settings.update({ injectionTemplate: injectionTemplate.value });
}

function onStripPatternsChange(): void {
    const lines = stripPatternsText.value
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
    settings.update({ stripPatterns: lines });
}

function onDebugChange(): void {
    settings.update({ debugMode: debugMode.value });
}

function onTraceChange(): void {
    settings.update({ traceMode: traceMode.value });
}

const debugMode = ref(settings.state.debugMode);
const traceMode = ref(settings.state.traceMode);

// ─── Custom prompt slots ───
function onSaveSlot(): void {
    if (!newPromptName.value.trim()) {
        toastWarning('Enter a name for the prompt.', 'Summaryception');
        return;
    }
    if (settings.saveCustomPrompt(newPromptName.value.trim())) {
        const name = newPromptName.value.trim();
        newPromptName.value = '';
        toastSuccess(`Prompt "${name}" saved.`, 'Summaryception', { timeOut: 2000 });
    } else {
        toastWarning('Prompt is empty — nothing to save.', 'Summaryception');
    }
}

function onLoadSlot(): void {
    if (!selectedSlot.value) {
        toastWarning('Select a saved prompt to load.', 'Summaryception');
        return;
    }
    if (settings.loadCustomPrompt(selectedSlot.value)) {
        userPrompt.value = settings.state.summarizerUserPrompt;
        presetValue.value = 'custom';
        toastSuccess(`Loaded prompt "${selectedSlot.value}".`, 'Summaryception', { timeOut: 2000 });
    } else {
        toastError(`Prompt "${selectedSlot.value}" not found.`, 'Summaryception');
    }
}

function onDeleteSlot(): void {
    if (!selectedSlot.value) {
        toastWarning('Select a saved prompt to delete.', 'Summaryception');
        return;
    }
    if (!confirm(`Delete saved prompt "${selectedSlot.value}"?`)) return;
    settings.deleteCustomPrompt(selectedSlot.value);
    selectedSlot.value = '';
    toastInfo(`Prompt deleted.`, 'Summaryception', { timeOut: 2000 });
}

function onExportPrompt(): void {
    const text = userPrompt.value;
    if (!text.trim()) {
        toastWarning('Prompt is empty — nothing to export.', 'Summaryception');
        return;
    }
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summaryception_prompt_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toastSuccess('Prompt exported.', 'Summaryception', { timeOut: 2000 });
}

function onImportPrompt(): void {
    promptImportInput.value?.click();
}

async function onPromptImportFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
        const text = await file.text();
        if (!text.trim()) {
            toastWarning('File is empty.', 'Summaryception');
            return;
        }
        userPrompt.value = text;
        settings.setUserPrompt(text);
        presetValue.value = 'custom';
        toastSuccess(`Prompt imported from "${file.name}".`, 'Summaryception', { timeOut: 3000 });
    } catch (err) {
        console.error('[Summaryception] Prompt import failed', err);
        toastError('Import failed — check console.', 'Summaryception');
    }
    input.value = '';
}

function onResetDefaults(): void {
    if (
        !confirm(
            'Reset all Advanced Settings to defaults?\n\n' +
                'This will reset sliders, prompts, injection template, and strip patterns.\n' +
                'It will NOT clear your summary memory or connection settings.',
        )
    ) {
        return;
    }
    settings.resetAdvancedToDefaults();
    // Sync local refs.
    systemPrompt.value = settings.state.summarizerSystemPrompt;
    userPrompt.value = settings.state.summarizerUserPrompt;
    injectionTemplate.value = settings.state.injectionTemplate;
    stripPatternsText.value = (settings.state.stripPatterns || []).join('\n');
    presetValue.value = settings.state.promptPreset;
    debugMode.value = settings.state.debugMode;
    traceMode.value = settings.state.traceMode;
    toastSuccess(
        'Advanced settings reset to defaults. Connection settings and summary memory were preserved.',
        'Summaryception',
        { timeOut: 4000 },
    );
}
</script>
