/**
 * Summarizer connection layer.
 *
 * Routes summarization requests through one of four backends:
 *   - default:  SillyTavern's generateRaw() (active connection)
 *   - profile:  ST Connection Profile via ConnectionManagerRequestService
 *   - ollama:   Local Ollama instance (via ST CORS proxy or direct)
 *   - openai:   OpenAI-compatible endpoint (streaming, via ST CORS proxy)
 *
 * Ported from connectionutil.js with TypeScript types and the ST bridge
 * module replacing direct SillyTavern.getContext() calls.
 */

import {
    generateRaw,
    getProxyHeaders,
    proxiedUrl,
    sendViaConnectionProfile,
} from '../host/st-bridge';
import type { SummaryceptionSettings } from '../settings/defaults';

// ─── Custom error ─────────────────────────────────────────────────────

export class ConnectionError extends Error {
    retryable: boolean;
    status: number | null;

    constructor(message: string, options: { retryable?: boolean; status?: number | null } = {}) {
        super(message);
        this.name = 'ConnectionError';
        this.retryable = options.retryable ?? false;
        this.status = options.status ?? null;
    }
}

// ─── Retry helpers ────────────────────────────────────────────────────

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function parseRetryAfter(error: unknown): number | null {
    try {
        const err = error as Record<string, unknown>;
        const headers = (err.response as Record<string, unknown> | undefined)?.headers as
            | Record<string, unknown>
            | undefined;
        const retryAfter =
            (headers?.['retry-after'] as string | undefined) ??
            (err.retryAfter as string | undefined) ??
            ((err.data as Record<string, unknown> | undefined)?.retry_after as string | undefined);

        if (!retryAfter) return null;
        const seconds = Number(retryAfter);
        if (!isNaN(seconds)) return seconds * 1000;
        const date = new Date(String(retryAfter));
        if (!isNaN(date.getTime())) {
            return Math.max(0, date.getTime() - Date.now());
        }
    } catch {
        /* ignore */
    }
    return null;
}

export function isRetryableError(error: unknown): boolean {
    if (!error) return false;
    const err = error as Record<string, unknown> & { name?: string; message?: string };

    if (err.name === 'AbortError') return false;

    if (err.name === 'ConnectionError' && typeof err.retryable === 'boolean') {
        return err.retryable;
    }

    if (err.name === 'TypeError' && typeof err.message === 'string' && err.message.includes('fetch')) {
        return true;
    }

    const status =
        (err.status as number | undefined) ??
        ((err.response as { status?: number } | undefined)?.status as number | undefined) ??
        (err.statusCode as number | undefined);
    if (status && [429, 500, 502, 503, 504].includes(status)) return true;

    const msg = (err.message ?? String(err)).toLowerCase();
    if (
        msg.includes('rate limit') ||
        msg.includes('too many requests') ||
        msg.includes('server error') ||
        msg.includes('timeout') ||
        msg.includes('econnreset') ||
        msg.includes('econnrefused') ||
        msg.includes('network') ||
        msg.includes('overloaded') ||
        msg.includes('capacity')
    ) {
        return true;
    }

    return false;
}

// ─── Output cleaning ──────────────────────────────────────────────────

/**
 * Strip reasoning tags, thinking blocks, and other model artifacts from
 * summarizer output. Uses configurable patterns plus regex for common
 * reasoning block formats.
 */
export function cleanSummarizerOutput(raw: string, settings: SummaryceptionSettings): string {
    let text = raw;

    for (const pattern of settings.stripPatterns) {
        while (text.includes(pattern)) {
            text = text.replace(pattern, '');
        }
    }

    const blockPatterns: Array<{ regex: RegExp; keepContent: boolean }> = [
        { regex: /<\|channel>thought[\s\S]*?<channel\|>/gi, keepContent: false },
        { regex: /<thinking>[\s\S]*?<\/thinking>/gi, keepContent: false },
        { regex: /<output>([\s\S]*?)<\/output>/gi, keepContent: true },
        { regex: /<reasoning>[\s\S]*?<\/reasoning>/gi, keepContent: false },
        { regex: /<thought>[\s\S]*?<\/thought>/gi, keepContent: false },
        { regex: /<reflect>[\s\S]*?<\/reflect>/gi, keepContent: false },
        { regex: /<inner_monologue>[\s\S]*?<\/inner_monologue>/gi, keepContent: false },
    ];

    for (const { regex, keepContent } of blockPatterns) {
        if (keepContent) {
            text = text.replace(regex, '$1');
        } else {
            text = text.replace(regex, '');
        }
    }

    text = text.replace(/\n{3,}/g, '\n').trim();
    return text;
}

// ─── Main entry point ─────────────────────────────────────────────────

export async function sendSummarizerRequest(
    settings: SummaryceptionSettings,
    systemPrompt: string,
    userPrompt: string,
    signal: AbortSignal,
): Promise<string> {
    const source = settings.connectionSource || 'default';

    switch (source) {
        case 'profile':
            return await sendViaProfileSafe(settings.connectionProfileId, systemPrompt, userPrompt);
        case 'ollama':
            return await sendViaOllama(
                settings.ollamaUrl,
                settings.ollamaModel,
                systemPrompt,
                userPrompt,
            );
        case 'openai':
            return await sendViaOpenAI(
                settings.openaiUrl,
                settings.openaiKey,
                settings.openaiModel,
                systemPrompt,
                userPrompt,
                settings.openaiMaxTokens,
                signal,
            );
        case 'default':
        default:
            return await sendViaDefault(systemPrompt, userPrompt, settings.summarizerResponseLength);
    }
}

// ─── Mode 1: Default (generateRaw) ────────────────────────────────────

async function sendViaDefault(
    systemPrompt: string,
    userPrompt: string,
    responseLength: number,
): Promise<string> {
    try {
        return await generateRaw(userPrompt, systemPrompt, responseLength);
    } catch (err) {
        const msg = (err as Error)?.message ?? String(err);
        throw new ConnectionError(`Default connection failed: ${msg}`, { retryable: true });
    }
}

// ─── Mode 2: Connection Profile ───────────────────────────────────────

async function sendViaProfileSafe(
    profileId: string,
    systemPrompt: string,
    userPrompt: string,
): Promise<string> {
    if (!profileId) {
        throw new ConnectionError(
            'No Connection Profile selected. Please select one in Summaryception settings.',
            { retryable: false },
        );
    }

    try {
        return await sendViaConnectionProfile(profileId, systemPrompt, userPrompt);
    } catch (error) {
        if (error instanceof ConnectionError) throw error;
        const err = error as Error & { status?: number };
        const msg = err.message || String(error);
        const status = err.status;

        if (status === 401 || msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
            throw new ConnectionError(
                `Connection Profile auth failed (401). This may be the API key switching bug (ST Issue #5348). Original error: ${msg}`,
                { retryable: false, status: 401 },
            );
        }

        if (msg.includes('not found') || msg.includes('profile')) {
            throw new ConnectionError(
                `Connection Profile "${profileId}" not found. It may have been deleted. Please re-select a profile in Summaryception settings.`,
                { retryable: false, status: 404 },
            );
        }

        throw new ConnectionError(`Connection Profile request failed: ${msg}`, {
            retryable: true,
            status,
        });
    }
}

// ─── Mode 3: Ollama ───────────────────────────────────────────────────

async function sendViaOllama(
    url: string,
    model: string,
    systemPrompt: string,
    userPrompt: string,
): Promise<string> {
    if (!url) {
        throw new ConnectionError('Ollama URL is not configured.', { retryable: false });
    }
    if (!model) {
        throw new ConnectionError('Ollama model is not selected.', { retryable: false });
    }

    const baseUrl = url.replace(/\/+$/, '');
    const targetUrl = `${baseUrl}/api/chat`;
    const body = JSON.stringify({
        model,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ],
        stream: false,
        options: { temperature: 0.3 },
    });

    let response: Response;
    try {
        response = await fetch(proxiedUrl(targetUrl), {
            method: 'POST',
            headers: { ...getProxyHeaders(), 'Content-Type': 'application/json' },
            body,
        });
    } catch (proxyError) {
        try {
            response = await fetch(targetUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body,
            });
        } catch (directError) {
            throw new ConnectionError(
                `Failed to connect to Ollama at ${baseUrl}. Proxy error: ${(proxyError as Error).message}. Direct error: ${(directError as Error).message}. Set OLLAMA_ORIGINS=* on your Ollama instance or enable the CORS proxy.`,
                { retryable: true },
            );
        }
    }

    if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new ConnectionError(`Ollama request failed (${response.status}): ${errorText}`, {
            retryable: response.status >= 500,
            status: response.status,
        });
    }

    const data = (await response.json()) as { message?: { content?: string } };
    if (!data?.message?.content) {
        throw new ConnectionError('Ollama returned an empty or invalid response.', {
            retryable: true,
        });
    }
    return data.message.content;
}

export async function fetchOllamaModels(url: string): Promise<Array<{ name: string }>> {
    if (!url) throw new Error('Ollama URL is not configured.');

    const baseUrl = url.replace(/\/+$/, '');
    const targetUrl = `${baseUrl}/api/tags`;

    let response: Response;
    try {
        response = await fetch(proxiedUrl(targetUrl), { method: 'GET', headers: getProxyHeaders() });
    } catch (proxyError) {
        try {
            response = await fetch(targetUrl, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (directError) {
            throw new Error(
                `Failed to connect to Ollama at ${baseUrl}. Proxy: ${(proxyError as Error).message}. Direct: ${(directError as Error).message}`,
            );
        }
    }

    if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Failed to fetch Ollama models (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as { models?: Array<{ name: string }> };
    if (!data?.models || !Array.isArray(data.models)) {
        throw new Error('Unexpected response format from Ollama /api/tags.');
    }
    return data.models;
}

// ─── Mode 4: OpenAI Compatible (streaming) ───────────────────────────

const LOCAL_HOST_REGEX =
    /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?/i;

async function sendViaOpenAI(
    url: string,
    apiKey: string,
    model: string,
    systemPrompt: string,
    userPrompt: string,
    maxTokens: number,
    signal: AbortSignal,
): Promise<string> {
    if (!url) {
        throw new ConnectionError('OpenAI Compatible URL is not configured.', { retryable: false });
    }
    if (!model) {
        throw new ConnectionError('OpenAI Compatible model name is not set.', { retryable: false });
    }

    const baseUrl = url.replace(/\/+$/, '');
    let endpoint = baseUrl;
    if (!endpoint.endsWith('/chat/completions')) {
        if (endpoint.endsWith('/v1')) {
            endpoint += '/chat/completions';
        } else if (!endpoint.includes('/chat/completions')) {
            endpoint += '/v1/chat/completions';
        }
    }

    const isLocal = LOCAL_HOST_REGEX.test(endpoint);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

    const requestBody: Record<string, unknown> = {
        model,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        stream: true,
    };
    if (maxTokens && maxTokens > 0) {
        requestBody.max_tokens = maxTokens;
    }

    const body = JSON.stringify(requestBody);

    let response: Response;
    if (isLocal) {
        try {
            response = await fetch(proxiedUrl(endpoint), {
                method: 'POST',
                headers: { ...getProxyHeaders(), ...headers },
                body,
                signal,
            });
        } catch (proxyError) {
            if (signal.aborted) throw proxyError;
            try {
                response = await fetch(endpoint, { method: 'POST', headers, body, signal });
            } catch (directError) {
                throw new ConnectionError(
                    `Failed to connect to ${baseUrl}. Proxy: ${(proxyError as Error).message}. Direct: ${(directError as Error).message}`,
                    { retryable: true },
                );
            }
        }
    } else {
        try {
            response = await fetch(endpoint, { method: 'POST', headers, body, signal });
        } catch (fetchError) {
            if (signal.aborted) throw fetchError;
            throw new ConnectionError(`Failed to connect to ${baseUrl}: ${(fetchError as Error).message}`, {
                retryable: true,
            });
        }
    }

    if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        if (response.status === 401) {
            throw new ConnectionError(
                'OpenAI Compatible endpoint returned 401 Unauthorized. Check your API key.',
                { retryable: false, status: 401 },
            );
        }
        if (response.status === 403) {
            throw new ConnectionError(`OpenAI Compatible endpoint returned 403 Forbidden: ${errorText}`, {
                retryable: false,
                status: 403,
            });
        }
        throw new ConnectionError(
            `OpenAI Compatible request failed (${response.status}): ${errorText}`,
            { retryable: response.status >= 500 || response.status === 429, status: response.status },
        );
    }

    // ─── Stream reading ───────────────────────────────────────────
    const reader = response.body?.getReader();
    if (!reader) {
        throw new ConnectionError('OpenAI Compatible endpoint returned no readable body.', {
            retryable: true,
        });
    }

    const decoder = new TextDecoder();
    let fullContent = '';
    let buffer = '';

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || !trimmed.startsWith('data:')) continue;
                const data = trimmed.slice(5).trim();
                if (data === '[DONE]') continue;
                try {
                    const parsed = JSON.parse(data) as {
                        choices?: Array<{ delta?: { content?: string } }>;
                    };
                    const delta = parsed.choices?.[0]?.delta?.content;
                    if (delta) fullContent += delta;
                } catch {
                    // Skip unparseable chunks.
                }
            }
        }
    } finally {
        reader.releaseLock();
    }

    if (!fullContent.trim()) {
        throw new ConnectionError('OpenAI Compatible endpoint returned an empty response (streaming).', {
            retryable: true,
        });
    }
    return fullContent;
}

export async function testOpenAIConnection(
    url: string,
    apiKey: string,
    model: string,
): Promise<{ success: boolean; message: string }> {
    try {
        const controller = new AbortController();
        const result = await sendViaOpenAI(
            url,
            apiKey,
            model || 'test',
            'You are a test assistant.',
            'Respond with exactly: CONNECTION_OK',
            100,
            controller.signal,
        );
        return {
            success: true,
            message: `Connection successful! Response: "${result.slice(0, 100)}"`,
        };
    } catch (error) {
        return {
            success: false,
            message: `Connection failed: ${(error as Error).message}`,
        };
    }
}
