/**
 * useExerciseSettings — exercise difficulty level + PT handoff source.
 *
 * Rules:
 * - No component/screen may call Firestore directly. This hook owns all Firestore IO.
 * - Firebase unavailable → fall back to AsyncStorage (local-only).
 */
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, firebaseAvailable } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export type ExerciseLevel = 'beginner' | 'intermediate' | 'advanced';
export type ExerciseSource = 'pt' | 'signup' | 'user' | 'guest';

export interface ExerciseSettings {
  level: ExerciseLevel;
  source: ExerciseSource;
  updatedAt: string | null;
  ptProgram?: {
    protocolKey?: string;
    protocolSeverity?: string;
    phaseKeys?: string[];
    customExercises?: Array<{ name: string; dosage?: string; rom_limit?: string }>;
    customNutritionNotes?: string;
    redFlagWatchlist?: string[];
    ptAuthor?: string;
  } | null;
}

const AS_EXERCISE_SETTINGS_KEY = 'exercise_settings_v1';

function isValidLevel(v: unknown): v is ExerciseLevel {
  return v === 'beginner' || v === 'intermediate' || v === 'advanced';
}

function normalizeEmail(email: string | undefined | null): string | null {
  if (!email) return null;
  const e = String(email).trim().toLowerCase();
  if (!e || !e.includes('@')) return null;
  return e;
}

// Use Firestore only when: real user (not guest) + Firebase available
function useFirestore(user: { uid: string } | null): boolean {
  return !!(user && user.uid !== 'guest' && db && firebaseAvailable);
}

export function useExerciseSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [needsSelection, setNeedsSelection] = useState(false);
  const [settings, setSettings] = useState<ExerciseSettings>({
    level: 'beginner',
    source: user?.uid === 'guest' ? 'guest' : 'signup',
    updatedAt: null,
    ptProgram: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setNeedsSelection(false);

      try {
        // Guest / no Firebase: AsyncStorage only
        if (!useFirestore(user)) {
          const raw = await AsyncStorage.getItem(AS_EXERCISE_SETTINGS_KEY);
          if (cancelled) return;

          if (raw) {
            const parsed = JSON.parse(raw) as Partial<ExerciseSettings>;
            const level = isValidLevel(parsed.level) ? parsed.level : 'beginner';
            setSettings({
              level,
              source: parsed.source ?? 'guest',
              updatedAt: parsed.updatedAt ?? null,
              ptProgram: parsed.ptProgram ?? null,
            });
            setNeedsSelection(false);
          } else {
            setSettings({ level: 'beginner', source: 'guest', updatedAt: null, ptProgram: null });
            setNeedsSelection(true);
          }
          return;
        }

        // Authenticated: Firestore first (user settings)
        const uid = user!.uid;
        const userSettingsRef = doc(db!, 'users', uid, 'exerciseSettings');
        const snap = await getDoc(userSettingsRef);
        if (cancelled) return;

        if (snap.exists()) {
          const data = snap.data() as Partial<ExerciseSettings>;
          const level = isValidLevel(data.level) ? data.level : 'beginner';
          setSettings({
            level,
            source: (data.source as ExerciseSource) ?? 'user',
            updatedAt: data.updatedAt ?? null,
            ptProgram: data.ptProgram ?? null,
          });
          setNeedsSelection(false);
          return;
        }

        // If no user settings yet, check PT handoff by patient email
        const email = normalizeEmail(user!.email);
        if (email) {
          const ptRef = doc(db!, 'ptHandoffRequests', email);
          const ptSnap = await getDoc(ptRef);
          if (cancelled) return;

          if (ptSnap.exists()) {
            const ptData = ptSnap.data() as Partial<{
              level: ExerciseLevel;
              protocolKey: string;
              protocolSeverity: string;
              phaseKeys: string[];
              customExercises: Array<{ name: string; dosage?: string; rom_limit?: string }>;
              customNutritionNotes: string;
              redFlagWatchlist: string[];
              ptAuthor: string;
            }>;
            const ptLevel = isValidLevel(ptData.level) ? ptData.level : 'beginner';
            setSettings({
              level: ptLevel,
              source: 'pt',
              updatedAt: null,
              ptProgram: {
                protocolKey: ptData.protocolKey,
                protocolSeverity: ptData.protocolSeverity,
                phaseKeys: ptData.phaseKeys,
                customExercises: ptData.customExercises,
                customNutritionNotes: ptData.customNutritionNotes,
                redFlagWatchlist: ptData.redFlagWatchlist,
                ptAuthor: ptData.ptAuthor,
              },
            });
            // PT already picked an initial level; do not force signup selection.
            setNeedsSelection(false);
            return;
          }
        }

        // Neither user settings nor PT handoff found → ask the client
        setSettings({ level: 'beginner', source: 'signup', updatedAt: null, ptProgram: null });
        setNeedsSelection(true);
      } catch {
        // If anything fails, keep the app usable by defaulting to beginner.
        if (cancelled) return;
        setSettings({ level: 'beginner', source: user?.uid === 'guest' ? 'guest' : 'signup', updatedAt: null, ptProgram: null });
        setNeedsSelection(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const setLevel = useCallback(
    async (level: ExerciseLevel, sourceOverride: ExerciseSource = 'user') => {
      setSettings((prev) => ({ ...prev, level, source: sourceOverride }));
      setNeedsSelection(false);

      // Guest / no Firebase
      if (!useFirestore(user)) {
        await AsyncStorage.setItem(
          AS_EXERCISE_SETTINGS_KEY,
          JSON.stringify({
            level,
            source: sourceOverride,
            updatedAt: new Date().toISOString(),
          } satisfies ExerciseSettings)
        );
        return;
      }

      // Firestore
      const uid = user!.uid;
      const userSettingsRef = doc(db!, 'users', uid, 'exerciseSettings');
      await setDoc(
        userSettingsRef,
        {
          level,
          source: sourceOverride,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    },
    [user]
  );

  return { loading, needsSelection, settings, level: settings.level, source: settings.source, setLevel };
}

