# Summaryception for TauriTavern

A native TauriTavern port of [Summaryception](https://github.com/Lodactio/Extension-Summaryception) v5.5.3 — layered recursive memory for long-form roleplay.

This is not the vanilla SillyTavern extension dropped into TauriTavern. It is rebuilt to use TauriTavern's host ABI (`window.__TAURITAVERN__`) for per-chat state and message history, with Vue 3 + Vite replacing the original jQuery + HTML template architecture.

## What it does

Summaryception compresses old conversation turns into ultra-compact summary snippets organized in recursive layers. Your most recent turns stay verbatim; everything older is summarized. The result: thousands of turns of narrative history in under 20k tokens, with no plot threads lost.

See the [original README](https://github.com/Lodactio/Extension-Summaryception) for the full feature description.

## Architecture

### TauriTavern-native surfaces

| Concern | Original (ST) | This port (TauriTavern) |
|---|---|---|
| Per-chat state | `chatMetadata[MODULE_NAME]` | `handle.metadata.setExtension({namespace, value})` |
| Message history | `getContext().chat[i]` (breaks in windowed mode) | `handle.history.tail/before` (paged, full history) |
| Message count | `chat.length` | `handle.summary().message_count` |
| Global settings | `extension_settings[MODULE_NAME]` | `localStorage` |
| Build system | Vanilla JS, drop-in folder | Vue 3 + Vite, `dist/index.js` + `dist/style.css` |
| UI | jQuery + HTML template | Vue 3 SFC components |

### SillyTavern fallbacks (no TauriTavern equivalent)

These ST surfaces have no TauriTavern ABI equivalent and are accessed via `window.SillyTavern.getContext()`:

- `setExtensionPrompt` — LLM context injection
- `generateRaw` — summarizer LLM call (default mode)
- `executeSlashCommandsWithOptions` — `/hide`, `/unhide` slash commands
- `eventSource` + `event_types` — MESSAGE_RECEIVED, CHAT_CHANGED, GENERATION_STARTED
- `promptManager` — snapshot/disable/restore prompt toggles during summarization
- `ConnectionManagerRequestService` — Connection Profile backend

All ST access is centralized in `src/host/st-bridge.ts`.

### Project structure

```
src/
├── index.ts                      # Entry: mount, events, slash commands
├── App.vue                       # Root component
├── style.css                     # All styles
├── host/
│   ├── api.ts                    # TauriTavern ABI types + ST context types
│   ├── client.ts                 # HostClient + capability detection
│   └── st-bridge.ts              # SillyTavern globals wrapper
├── settings/
│   ├── defaults.ts               # defaultSettings + PROMPT_PRESETS + RETRY_CONFIG
│   └── store.ts                  # Global settings via localStorage (Vue reactive)
├── store/
│   └── chat-store.ts             # Per-chat state via handle.metadata.setExtension
├── engine/
│   ├── messages.ts               # MessageBuffer (paged history access)
│   ├── passage.ts                # Build passage + full context from layers
│   ├── ghosting.ts               # Ghost/unghost via /hide /unhide
│   ├── connection.ts             # 4 backends: default/profile/ollama/openai
│   ├── summarizer.ts             # LLM call with retry + prompt toggle management
│   ├── promotion.ts              # Layer promotion ("ception")
│   ├── injection.ts              # assembleSummaryBlock + setExtensionPrompt
│   └── pipeline.ts               # maybeSummarizeTurns, batches, catchup, import/export
├── ui/
│   └── useEngine.ts              # Vue composable binding engine to UI
└── components/
    ├── SettingsDrawer.vue        # Enable/pause/ghosting toggles + action buttons
    ├── SnippetBrowser.vue        # Browse/edit/regenerate/delete snippets
    ├── LayerStats.vue            # Live layer stats
    ├── InjectionPreview.vue      # Injection preview
    ├── ConnectionPanel.vue       # Connection source settings
    └── AdvancedSettings.vue      # Sliders, prompts, strip patterns, debug
```

## Installation

### Requirements

- TauriTavern 2.1+ (preserves SillyTavern 1.18.0 frontend)
- Node.js 22.12+
- npm

### Build

```bash
cd tauritavern-summaryception
npm install
npm run build
```

Produces `dist/index.js` + `dist/style.css`.

### Install into TauriTavern

Copy the entire folder into TauriTavern's third-party extensions directory:

- **Local:** `data/default-user/extensions/tauritavern-summaryception/`
- **Global:** `data/extensions/third-party/tauritavern-summaryception/`

The folder must contain at minimum:
- `manifest.json`
- `dist/index.js`
- `dist/style.css`

Restart TauriTavern. Find **🧠 Summaryception** in Extensions settings.

### Development

```bash
npm install
npm run dev      # vite build --watch — rebuilds on save
```

After each rebuild, refresh TauriTavern (Ctrl+R / Cmd+R) to reload the extension.

```bash
npm run typecheck   # vue-tsc — must pass before each build
```

## Slash commands

| Command | Action |
|---|---|
| `/sc-status` | Show layer status (snippet counts, summarizedUpTo, ghosted count) |
| `/sc-preview` | Preview the summary block that would be injected |
| `/sc-clear` | Clear all memory for the current chat and unghost messages |

## Connection backends

| Source | Description |
|---|---|
| **Default** (default) | Uses SillyTavern's active connection via `generateRaw`. Prompt toggles are temporarily disabled during summarizer calls. |
| **Connection Profile** | Uses an ST Connection Profile via `ConnectionManagerRequestService`. ⚠️ Inherits preset formatting — may degrade summary quality. |
| **Ollama** | Local Ollama instance. Requires CORS proxy or `OLLAMA_ORIGINS=*`. |
| **OpenAI Compatible** | Any OpenAI-compatible endpoint (LM Studio, KoboldCPP, vLLM, OpenRouter, etc.). Streaming. |

## Differences from the original

1. **Windowed-payload safe.** The original directly indexed `chat[i]` which breaks in TauriTavern's windowed mode. This port uses `handle.history.tail/before` for paged full-history access, with `ghostedIndices` in metadata as the source of truth (the `sc_ghosted` flag on message objects is best-effort for windowed-in messages only).

2. **Per-chat state via host ABI.** Uses `handle.metadata.setExtension` instead of `chatMetadata[MODULE_NAME]`. The Rust backend manages persistence and transparently handles windowed-payload boundaries.

3. **Global settings via localStorage.** Decoupled from ST's `extension_settings`. Simpler, survives TauriTavern upgrades, doesn't require ST to be loaded.

4. **Vue 3 + TypeScript.** Replaces jQuery + HTML template with reactive SFC components. Type-safe throughout.

5. **HostClient capability gating.** The extension refuses to mount if the host doesn't expose the `chat` API, rather than silently failing.

## License

AGPL-3.0 (inherited from the original Summaryception)

## Credits

- Original Summaryception by [Lodactio](https://github.com/Lodactio/Extension-Summaryception) — this is a TauriTavern-native port of their AGPL-3.0 work
- TauriTavern by [Darkatse](https://github.com/Darkatse/TauriTavern)
