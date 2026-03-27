/**
 * Persist Coach voice + persona (AsyncStorage). No secrets — voice IDs are public.
 */
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DEFAULT_COACH_PERSONA_ID,
  DEFAULT_COACH_VOICE_ID,
  type CoachPersonaId,
} from '../constants/coachPreferences';

const STORAGE_KEY = 'coach_prefs_v2';

export interface CoachPreferences {
  voiceId: string;
  personaId: CoachPersonaId;
}

export function useCoachPreferences() {
  const [ready, setReady] = useState(false);
  const [voiceId, setVoiceIdState] = useState(DEFAULT_COACH_VOICE_ID);
  const [personaId, setPersonaIdState] = useState<CoachPersonaId>(DEFAULT_COACH_PERSONA_ID);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;
        if (raw) {
          const p = JSON.parse(raw) as Partial<CoachPreferences>;
          if (typeof p.voiceId === 'string' && p.voiceId.length > 4) {
            setVoiceIdState(p.voiceId);
          }
          if (
            typeof p.personaId === 'string' &&
            ['balanced', 'warm', 'direct', 'clinical'].includes(p.personaId)
          ) {
            setPersonaIdState(p.personaId as CoachPersonaId);
          }
        }
      } catch {
        /* keep defaults */
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (next: CoachPreferences) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const setVoiceId = useCallback(
    async (id: string) => {
      setVoiceIdState(id);
      await persist({ voiceId: id, personaId });
    },
    [personaId, persist]
  );

  const setPersonaId = useCallback(
    async (id: CoachPersonaId) => {
      setPersonaIdState(id);
      await persist({ voiceId, personaId: id });
    },
    [voiceId, persist]
  );

  return {
    ready,
    voiceId,
    personaId,
    setVoiceId,
    setPersonaId,
  };
}
