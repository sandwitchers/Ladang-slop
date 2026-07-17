/**
 * Global settings store.
 *
 * Original Summaryception used `extension_settings[MODULE_NAME]` +
 * `saveSettingsDebounced()`. The TauriTavern port uses localStorage instead.
 *
 * Reasons:
 *   1. TauriTavern extensions are independent ESM modules built by Vite —
 *      they don't import from extensions.js, so `extension_settings` isn't
 *      naturally accessible without reaching into ST globals.
 *   2. localStorage is simpler, doesn't require ST to be loaded, and
 *      survives TauriTavern version upgrades.
 *   3. If a user later wants ST-managed settings, the store can be swapped
 *      to `handle.metadata.setExtension` for per-chat or to ST's
 *      `extension_settings` for global, without touching any consumer code.
 */

import { computed, reactive, readonly } from 'vue';
import {
    DEFAULT_SETTINGS,
    PROMPT_PRESETS,
    type PromptPreset,
    type SummaryceptionSettings,
} from './defaults';

const STORAGE_KEY = 'tauritavern-summaryception-settings';
const MODULE_NAME = 'summaryception';

// ─── Helpers ──────────────────────────────────────────────────────────

function deepClone<T>(value: T): T {
    if (typeof structuredClone === 'function') {
        try {
            return structuredClone(value);
        } catch {
            /* fall through to JSON */
        }
    }
    return JSON.parse(JSON.stringify(value)) as T;
}

function loadFromStorage(): SummaryceptionSettings {
    const merged = deepClone(DEFAULT_SETTINGS) as SummaryceptionSettings;

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return merged;

        const parsed = JSON.parse(raw) as Partial<SummaryceptionSettings>;
        for (const key of Object.keys(DEFAULT_SETTINGS) as Array<keyof SummaryceptionSettings>) {
            if (key in parsed && parsed[key] !== undefined) {
                (merged[key] as unknown) = parsed[key];
            }
        }
    } catch (err) {
        console.warn(`[${MODULE_NAME}] Failed to load settings from localStorage`, err);
    }

    // Migration: older versions may not have promptPreset set.
    if (!merged.promptPreset) {
        const currentPrompt = (merged.summarizerUserPrompt || '').trim();
        const gameStatePrompt = PROMPT_PRESETS.gamestate.trim();
        if (!currentPrompt || currentPrompt === gameStatePrompt) {
            merged.promptPreset = 'narrative';
            merged.summarizerUserPrompt = PROMPT_PRESETS.narrative;
        } else {
            merged.promptPreset = 'custom';
        }
    }

    return merged;
}

function saveToStorage(state: SummaryceptionSettings): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
        console.error(`[${MODULE_NAME}] Failed to save settings to localStorage`, err);
    }
}

// ─── Store ────────────────────────────────────────────────────────────

export interface SettingsStore {
    state: Readonly<SummaryceptionSettings>;
    update(patch: Partial<SummaryceptionSettings>): void;
    setPromptPreset(preset: PromptPreset): void;
    setUserPrompt(text: string): void;
    saveCustomPrompt(name: string): boolean;
    loadCustomPrompt(name: string): boolean;
    deleteCustomPrompt(name: string): void;
    resetAdvancedToDefaults(): void;
    subscribe(handler: (state: SummaryceptionSettings) => void): () => void;
}

let storeInstance: SettingsStore | null = null;

export function createSettingsStore(): SettingsStore {
    if (storeInstance) return storeInstance;

    const state = reactive(loadFromStorage()) as SummaryceptionSettings;

    let saveTimer: ReturnType<typeof setTimeout> | null = null;
    const subscribers = new Set<(state: SummaryceptionSettings) => void>();

    function persist() {
        if (saveTimer) clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
            saveToStorage(state);
            saveTimer = null;
        }, 300);
    }

    function notify() {
        for (const handler of subscribers) {
            try {
                handler(state);
            } catch (err) {
                console.error(`[${MODULE_NAME}] Settings subscriber error`, err);
            }
        }
    }

    function update(patch: Partial<SummaryceptionSettings>): void {
        Object.assign(state, patch);
        persist();
        notify();
    }

    function setPromptPreset(preset: PromptPreset): void {
        const previous = state.promptPreset;

        if (previous === 'custom') {
            state.lastCustomPrompt = state.summarizerUserPrompt;
        }

        state.promptPreset = preset;

        if (preset === 'custom') {
            if (state.lastCustomPrompt) {
                state.summarizerUserPrompt = state.lastCustomPrompt;
            }
        } else if (preset === 'narrative' || preset === 'gamestate') {
            state.summarizerUserPrompt = PROMPT_PRESETS[preset];
        }

        persist();
        notify();
    }

    function setUserPrompt(text: string): void {
        state.summarizerUserPrompt = text;

        if (state.promptPreset !== 'custom') {
            const presetText =
                state.promptPreset === 'narrative' || state.promptPreset === 'gamestate'
                    ? PROMPT_PRESETS[state.promptPreset]
                    : '';
            if (text !== presetText) {
                state.promptPreset = 'custom';
                state.lastCustomPrompt = text;
            }
        } else {
            state.lastCustomPrompt = text;
        }

        persist();
        notify();
    }

    function saveCustomPrompt(name: string): boolean {
        if (!name.trim()) return false;
        if (!state.summarizerUserPrompt.trim()) return false;
        state.savedCustomPrompts[name] = state.summarizerUserPrompt;
        persist();
        notify();
        return true;
    }

    function loadCustomPrompt(name: string): boolean {
        const text = state.savedCustomPrompts[name];
        if (!text) return false;
        state.summarizerUserPrompt = text;
        state.lastCustomPrompt = text;
        state.promptPreset = 'custom';
        persist();
        notify();
        return true;
    }

    function deleteCustomPrompt(name: string): void {
        if (name in state.savedCustomPrompts) {
            delete state.savedCustomPrompts[name];
            persist();
            notify();
        }
    }

    function resetAdvancedToDefaults(): void {
        state.verbatimTurns = DEFAULT_SETTINGS.verbatimTurns;
        state.turnsPerSummary = DEFAULT_SETTINGS.turnsPerSummary;
        state.snippetsPerLayer = DEFAULT_SETTINGS.snippetsPerLayer;
        state.snippetsPerPromotion = DEFAULT_SETTINGS.snippetsPerPromotion;
        state.maxLayers = DEFAULT_SETTINGS.maxLayers;
        state.summarizerSystemPrompt = DEFAULT_SETTINGS.summarizerSystemPrompt;
        state.summarizerUserPrompt = DEFAULT_SETTINGS.summarizerUserPrompt;
        state.promptPreset = DEFAULT_SETTINGS.promptPreset;
        state.injectionTemplate = DEFAULT_SETTINGS.injectionTemplate;
        state.stripPatterns = [...DEFAULT_SETTINGS.stripPatterns];
        state.summarizerResponseLength = DEFAULT_SETTINGS.summarizerResponseLength;
        state.debugMode = DEFAULT_SETTINGS.debugMode;
        state.traceMode = DEFAULT_SETTINGS.traceMode;
        persist();
        notify();
    }

    function subscribe(handler: (state: SummaryceptionSettings) => void): () => void {
        subscribers.add(handler);
        return () => subscribers.delete(handler);
    }

    storeInstance = {
        state: readonly(state) as Readonly<SummaryceptionSettings>,
        update,
        setPromptPreset,
        setUserPrompt,
        saveCustomPrompt,
        loadCustomPrompt,
        deleteCustomPrompt,
        resetAdvancedToDefaults,
        subscribe,
    };

    return storeInstance;
}
