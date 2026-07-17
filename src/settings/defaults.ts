/**
 * Default settings and prompt presets.
 *
 * Ported directly from the original Summaryception v5.5.3. Every field is
 * kept identical so that users migrating from the ST version to the
 * TauriTavern port see the same defaults.
 */

export type PromptPreset = 'narrative' | 'gamestate' | 'custom';
export type ConnectionSource = 'default' | 'profile' | 'ollama' | 'openai';

export interface SummaryceptionSettings {
    enabled: boolean;
    verbatimTurns: number;
    turnsPerSummary: number;
    snippetsPerLayer: number;
    snippetsPerPromotion: number;
    maxLayers: number;
    injectionTemplate: string;

    summarizerSystemPrompt: string;
    summarizerUserPrompt: string;
    promptPreset: PromptPreset;
    savedCustomPrompts: Record<string, string>;
    lastCustomPrompt: string;

    pauseSummarization: boolean;
    disableGhosting: boolean;

    stripPatterns: string[];

    debugMode: boolean;
    traceMode: boolean;

    // ─── Connection Settings ───
    connectionSource: ConnectionSource;
    summarizerResponseLength: number;
    connectionProfileId: string;
    ollamaUrl: string;
    ollamaModel: string;
    ollamaModelsCache: Array<{ name: string }>;
    openaiUrl: string;
    openaiKey: string;
    openaiModel: string;
    openaiMaxTokens: number;
}

export const DEFAULT_SETTINGS: Readonly<SummaryceptionSettings> = Object.freeze({
    enabled: true,
    verbatimTurns: 10,
    turnsPerSummary: 3,
    snippetsPerLayer: 30,
    snippetsPerPromotion: 3,
    maxLayers: 5,
    injectionTemplate: '\n\n<summary>\n{{summary}}\n</summary>\n\n',

    summarizerSystemPrompt:
        'Role: precise narrative-state tracker. Output only the summary line — no preamble, no commentary, no markdown.',

    summarizerUserPrompt: '', // Filled below from PROMPT_PRESETS.narrative at init.

    promptPreset: 'narrative',
    savedCustomPrompts: {},
    lastCustomPrompt: '',

    pauseSummarization: false,
    disableGhosting: false,

    stripPatterns: [
        '<|channel>thought',
        '<channel|>',
        '<output>',
        '</output>',
        '<thinking>',
        '</thinking>',
    ],

    debugMode: false,
    traceMode: false,

    connectionSource: 'default',
    summarizerResponseLength: 0,
    connectionProfileId: '',
    ollamaUrl: 'http://localhost:11434',
    ollamaModel: '',
    ollamaModelsCache: [],
    openaiUrl: '',
    openaiKey: '',
    openaiModel: '',
    openaiMaxTokens: 0,
});

// ─── Prompt presets ───────────────────────────────────────────────────

export const PROMPT_PRESETS: Record<Exclude<PromptPreset, 'custom'>, string> = {
    narrative: `<player_name>
{{player_name}}
</player_name>

<prior_context>
{{context_str}}
</prior_context>

<passage_in_question>
{{story_txt}}
</passage_in_question>

Summarize only the necessary elements from the passage_in_question to coherently continue the prior_context. If the passage_in_question has 2nd person point of view, 'you' pronoun in prose refers to the player. Use the player name in the summary output instead of 'you'.

Focus on: character interactions, dialogue tone, and relationship dynamics; emotional beats and character motivations; atmosphere, mood, and sensory details that establish tone; narrative themes and subtext; names, location changes, and time; plot developments and unresolved tensions.

Exclude anything insubstantial, fluff, atmospheric details, or events already covered in Prior Context.

Write in short phrases, no more than 20; output must be a single line:`,

    gamestate: `<player_name>
{{player_name}}
</player_name>

<prior_context>
{{context_str}}
</prior_context>

<passage_in_question>
{{story_txt}}
</passage_in_question>

Summarize only the necessary elements from the passage_in_question to coherently continue the prior_context.

Focus on: story progression, plot points, plans, tasks, quests; location changes and current location (reference by name); location interactables encountered, used, or discovered; significant changes to player, NPCs, locations, world, or setting.

Exclude anything insubstantial, fluff, atmospheric details, or events already covered in Prior Context.
Skip any passages that are empty, unclear, or lack significant content.
Write in short phrases, no more than 20; output must be a single line:`,
};

export const DEFAULT_PROMPT_PRESET = 'narrative';

// ─── Retry config ─────────────────────────────────────────────────────

export const RETRY_CONFIG = {
    maxRetries: 5,
    baseDelay: 2000,
    maxDelay: 60000,
    backoffMultiplier: 2,
    retryableStatuses: [429, 500, 502, 503, 504],
} as const;

// Fill the default user prompt from the narrative preset.
(DEFAULT_SETTINGS as SummaryceptionSettings).summarizerUserPrompt = PROMPT_PRESETS.narrative;
