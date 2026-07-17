<template>
    <div class="summaryception-connection-section">
        <hr class="sysHR" />
        <div class="summaryception-section-header">
            <span class="fa-solid fa-bolt"></span>
            <span>Summarizer Connection</span>
        </div>
        <small class="summaryception-help-text">
            Choose which LLM connection to use for summarization. Use a cheaper/faster model to save
            costs while keeping your main API for RP.
        </small>

        <!-- Response length override -->
        <div class="summaryception-setting-row">
            <label for="sc_summarizer_response_length">
                <span>Summarizer Response Length</span>
                <small>
                    Override max response tokens for summarizer calls (Default/Profile modes).
                    0 = use your preset's value. If you get "max_tokens > 4096 must have stream=true"
                    errors, set to 4096.
                </small>
            </label>
            <input
                id="sc_summarizer_response_length"
                v-model.number="responseLength"
                type="number"
                class="text_pole"
                min="0"
                step="100"
                placeholder="0 = use preset default"
            />
        </div>

        <!-- Connection source selector -->
        <div class="summaryception-setting-row">
            <label for="summaryception_connection_source">
                <span>Connection Source</span>
            </label>
            <select
                id="summaryception_connection_source"
                v-model="source"
                class="text_pole"
            >
                <option value="default">Default (Main API)</option>
                <option value="profile">Connection Profile</option>
                <option value="ollama">Ollama (Local)</option>
                <option value="openai">OpenAI Compatible</option>
            </select>
        </div>

        <!-- Connection Profile sub-panel -->
        <div v-show="source === 'profile'" class="summaryception-sub-panel">
            <div class="summaryception-setting-row">
                <label for="summaryception_connection_profile">
                    <span>Connection Profile</span>
                </label>
                <select
                    id="summaryception_connection_profile"
                    ref="profileSelect"
                    v-model="profileId"
                    class="text_pole"
                >
                    <option value="">-- Select a Profile --</option>
                </select>
            </div>
            <div class="summaryception-note">
                <span class="fa-solid fa-info-circle"></span>
                <small>
                    Uses a saved SillyTavern Connection Profile. Includes endpoint, API key, model,
                    and presets. ⚠️ Connection Profiles inject preset formatting into summary requests,
                    which may degrade summary quality. Consider using Default or OpenAI Compatible instead.
                </small>
            </div>
        </div>

        <!-- Ollama sub-panel -->
        <div v-show="source === 'ollama'" class="summaryception-sub-panel">
            <div class="summaryception-setting-row">
                <label for="summaryception_ollama_url">
                    <span>Ollama URL</span>
                </label>
                <input
                    id="summaryception_ollama_url"
                    v-model="ollamaUrl"
                    type="text"
                    class="text_pole"
                    placeholder="http://localhost:11434"
                />
            </div>
            <div class="summaryception-setting-row">
                <label for="summaryception_ollama_model">
                    <span>Model</span>
                </label>
                <div class="summaryception-input-group">
                    <select
                        id="summaryception_ollama_model"
                        v-model="ollamaModel"
                        class="text_pole"
                    >
                        <option value="">-- Select Model --</option>
                        <option v-for="m in ollamaModels" :key="m.name" :value="m.name">
                            {{ m.name }}
                        </option>
                    </select>
                    <div
                        class="menu_button menu_button_icon"
                        title="Refresh model list from Ollama"
                        @click="refreshOllama"
                    >
                        <span class="fa-solid fa-arrows-rotate"></span>
                    </div>
                </div>
            </div>
            <div class="summaryception-note">
                <span class="fa-solid fa-info-circle"></span>
                <small>
                    Connects to a local Ollama instance. Requires <code>enableCorsProxy: true</code> in
                    your SillyTavern <code>config.yaml</code>, OR set <code>OLLAMA_ORIGINS=*</code>
                    on your Ollama instance.
                </small>
            </div>
        </div>

        <!-- OpenAI Compatible sub-panel -->
        <div v-show="source === 'openai'" class="summaryception-sub-panel">
            <div class="summaryception-setting-row">
                <label for="summaryception_openai_url">
                    <span>Endpoint URL</span>
                </label>
                <input
                    id="summaryception_openai_url"
                    v-model="openaiUrl"
                    type="text"
                    class="text_pole"
                    placeholder="http://localhost:1234/v1 or https://openrouter.ai/api/v1"
                />
            </div>
            <div class="summaryception-setting-row">
                <label for="summaryception_openai_key">
                    <span>API Key</span>
                </label>
                <input
                    id="summaryception_openai_key"
                    v-model="openaiKey"
                    type="password"
                    class="text_pole"
                    placeholder="(optional, for cloud services)"
                    autocomplete="off"
                />
            </div>
            <div class="summaryception-setting-row">
                <label for="summaryception_openai_model">
                    <span>Model Name</span>
                </label>
                <input
                    id="summaryception_openai_model"
                    v-model="openaiModel"
                    type="text"
                    class="text_pole"
                    placeholder="e.g. gpt-4o-mini, llama-3.1-8b"
                />
            </div>
            <div class="summaryception-setting-row">
                <label for="summaryception_openai_max_tokens">
                    <span>Max Tokens</span>
                </label>
                <input
                    id="summaryception_openai_max_tokens"
                    v-model.number="openaiMaxTokens"
                    type="number"
                    class="text_pole"
                    min="0"
                    step="100"
                    placeholder="0 = no limit (provider default)"
                />
            </div>
            <div class="summaryception-setting-row">
                <div
                    class="menu_button menu_button_icon"
                    title="Test the OpenAI-compatible connection"
                    @click="testOpenAI"
                >
                    <span class="fa-solid fa-plug-circle-check"></span>
                    <span>Test Connection</span>
                </div>
            </div>
            <div class="summaryception-note">
                <span class="fa-solid fa-info-circle"></span>
                <small>
                    Works with LM Studio, KoboldCPP, vLLM, text-generation-webui, OpenRouter, or any
                    OpenAI-compatible endpoint. Enter the base URL up to <code>/v1</code>.
                    Local endpoints require <code>enableCorsProxy: true</code> in <code>config.yaml</code>.
                    Cloud APIs work without the proxy.
                </small>
            </div>
        </div>

        <!-- Connection status -->
        <div
            v-show="status.visible"
            class="summaryception-connection-status"
            :class="status.type"
        >
            <span class="fa-solid" :class="statusIcon"></span>
            <span>{{ status.message }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useEngine } from '../ui/useEngine';
import {
    fetchProfilesFallback,
    populateConnectionProfileDropdown,
    toastError,
    toastSuccess,
} from '../host/st-bridge';
import { fetchOllamaModels, testOpenAIConnection } from '../engine/connection';

const engine = useEngine();
const settings = engine.settings;

const profileSelect = ref<HTMLSelectElement | null>(null);

// ─── Two-way bindings ───
const source = computed({
    get: () => settings.state.connectionSource,
    set: (v) => settings.update({ connectionSource: v }),
});
const responseLength = computed({
    get: () => settings.state.summarizerResponseLength || 0,
    set: (v: number) => settings.update({ summarizerResponseLength: v || 0 }),
});
const profileId = computed({
    get: () => settings.state.connectionProfileId,
    set: (v) => settings.update({ connectionProfileId: v }),
});
const ollamaUrl = computed({
    get: () => settings.state.ollamaUrl,
    set: (v) => settings.update({ ollamaUrl: v.trim() }),
});
const ollamaModel = computed({
    get: () => settings.state.ollamaModel,
    set: (v) => settings.update({ ollamaModel: v }),
});
const ollamaModels = computed(() => settings.state.ollamaModelsCache || []);
const openaiUrl = computed({
    get: () => settings.state.openaiUrl,
    set: (v) => settings.update({ openaiUrl: v.trim() }),
});
const openaiKey = computed({
    get: () => settings.state.openaiKey,
    set: (v) => settings.update({ openaiKey: v.trim() }),
});
const openaiModel = computed({
    get: () => settings.state.openaiModel,
    set: (v) => settings.update({ openaiModel: v.trim() }),
});
const openaiMaxTokens = computed({
    get: () => settings.state.openaiMaxTokens || 0,
    set: (v: number) => settings.update({ openaiMaxTokens: v || 0 }),
});

// ─── Status indicator ───
const status = ref<{ visible: boolean; type: 'success' | 'error' | 'loading'; message: string }>({
    visible: false,
    type: 'loading',
    message: '',
});

const statusIcon = computed(() => {
    switch (status.value.type) {
        case 'success':
            return 'fa-circle-check';
        case 'error':
            return 'fa-circle-xmark';
        case 'loading':
            return 'fa-spinner fa-spin';
    }
});

function showStatus(type: 'success' | 'error' | 'loading', message: string): void {
    status.value = { visible: true, type, message };
    if (type !== 'loading') {
        setTimeout(() => {
            status.value.visible = false;
        }, 8000);
    }
}

// ─── Profile dropdown population ───
async function populateProfiles(): Promise<void> {
    await nextTick();
    if (!profileSelect.value) return;
    const ok = populateConnectionProfileDropdown(profileSelect.value, profileId.value);
    if (!ok) {
        await fetchProfilesFallback(profileSelect.value, profileId.value);
    }
}

watch(source, (v) => {
    if (v === 'profile') {
        void populateProfiles();
    }
});

onMounted(() => {
    if (source.value === 'profile') {
        void populateProfiles();
    }
});

// ─── Ollama refresh ───
async function refreshOllama(): Promise<void> {
    const url = ollamaUrl.value || 'http://localhost:11434';
    showStatus('loading', 'Fetching Ollama models...');
    try {
        const models = await fetchOllamaModels(url);
        settings.update({ ollamaModelsCache: models.map((m) => ({ name: m.name })) });
        showStatus('success', `Found ${models.length} model(s)`);
        toastSuccess(`Found ${models.length} Ollama model(s)`, 'Summaryception');
    } catch (err) {
        const message = (err as Error).message;
        showStatus('error', `Failed: ${message}`);
        toastError(`Failed to fetch Ollama models: ${message}`, 'Summaryception');
    }
}

// ─── OpenAI test ───
async function testOpenAI(): Promise<void> {
    if (!openaiUrl.value) {
        toastError('Please enter an endpoint URL first.', 'Summaryception');
        return;
    }
    if (!openaiModel.value) {
        toastError('Please enter a model name first.', 'Summaryception');
        return;
    }
    showStatus('loading', 'Testing connection...');
    const result = await testOpenAIConnection(
        openaiUrl.value,
        openaiKey.value,
        openaiModel.value,
    );
    if (result.success) {
        showStatus('success', result.message);
        toastSuccess(result.message, 'Summaryception');
    } else {
        showStatus('error', result.message);
        toastError(result.message, 'Summaryception');
    }
}
</script>
