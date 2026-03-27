/**
 * GroundChiFlow → Grok bridge client.
 * Calls the Fortress Grok bridge (/ask) so the API key stays server-side.
 * Set EXPO_PUBLIC_GROK_BRIDGE_URL in .env (e.g. https://grok.howell-forge.com).
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GrokBridgeResponse {
  choices?: Array<{ message?: { content?: string }; finish_reason?: string }>;
  error?: string;
}

const DEFAULT_BRIDGE_URL = 'https://grok.howell-forge.com';

function getBridgeUrl(): string {
  const url = process.env.EXPO_PUBLIC_GROK_BRIDGE_URL;
  if (url && url.startsWith('http')) return url.trim();
  return DEFAULT_BRIDGE_URL;
}

/** Exported so Coach UI can show which bridge URL is in use (debug). */
export function getBridgeUrlForDisplay(): string {
  return getBridgeUrl().replace(/\/$/, '');
}

/**
 * Send messages to the Grok bridge; returns the assistant reply or throws.
 */
export async function sendToAgent(messages: ChatMessage[]): Promise<string> {
  const base = getBridgeUrl().replace(/\/$/, '');
  const endpoint = `${base}/ask`;

  const body = {
    model: 'grok-3-mini',
    messages,
    max_tokens: 1024,
    temperature: 0.7,
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data: GrokBridgeResponse = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = (data as { error?: string }).error || res.statusText;
    throw new Error(err || `Bridge returned ${res.status}`);
  }

  if (data.error) throw new Error(data.error);

  const content = data.choices?.[0]?.message?.content;
  if (content != null) return content.trim();

  throw new Error('No reply from agent');
}

export function isBridgeConfigured(): boolean {
  const url = getBridgeUrl();
  return !!(url && url.startsWith('http'));
}

export interface CoachTtsResponse {
  audio_base64?: string;
  content_type?: string;
  error?: string;
}

const MAX_TTS_CHARS = 4000;

/**
 * Request speech audio from bridge POST /coach/tts (ElevenLabs on server). Returns base64 MP3 or throws.
 */
export async function fetchCoachTts(text: string, voiceId: string): Promise<string> {
  const base = getBridgeUrl().replace(/\/$/, '');
  const endpoint = `${base}/coach/tts`;
  const trimmed = text.trim().slice(0, MAX_TTS_CHARS);

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: trimmed, voice_id: voiceId }),
  });

  const data: CoachTtsResponse = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = data.error || res.statusText;
    throw new Error(typeof err === 'string' ? err : `TTS failed (${res.status})`);
  }

  if (data.error) throw new Error(data.error);

  const b64 = data.audio_base64;
  if (!b64) throw new Error('No audio from bridge');

  return b64;
}
