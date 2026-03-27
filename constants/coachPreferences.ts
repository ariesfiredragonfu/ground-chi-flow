/**
 * Coach voice + persona presets (v2). Voice IDs are public ElevenLabs defaults; TTS runs on the bridge.
 */

export type CoachPersonaId = 'balanced' | 'warm' | 'direct' | 'clinical';

export interface CoachPersona {
  id: CoachPersonaId;
  label: string;
  /** Merged before the main system prompt. */
  promptFragment: string;
}

export const COACH_PERSONAS: CoachPersona[] = [
  {
    id: 'balanced',
    label: 'Balanced',
    promptFragment: '',
  },
  {
    id: 'warm',
    label: 'Warm mentor',
    promptFragment:
      'Speak in a warm, encouraging tone—like a trusted friend who respects the user’s intelligence. Use short paragraphs.',
  },
  {
    id: 'direct',
    label: 'Direct',
    promptFragment:
      'Be concise and direct. Lead with the answer, then one supporting sentence if needed. Avoid filler.',
  },
  {
    id: 'clinical',
    label: 'Clinical-neutral',
    promptFragment:
      'Use neutral, professional language suitable for health education. Avoid hype; cite general mechanisms when helpful.',
  },
];

/** Default ElevenLabs voices (public catalog ids). */
export const COACH_VOICES: { id: string; label: string }[] = [
  { id: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel' },
  { id: 'AZnzlk1XvdvUeBnXmlld', label: 'Domi' },
  { id: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', label: 'Josh' },
];

export const DEFAULT_COACH_VOICE_ID = COACH_VOICES[0].id;
export const DEFAULT_COACH_PERSONA_ID: CoachPersonaId = 'balanced';
