/**
 * useHealthData — Central Firestore sync hook
 *
 * ALL Firestore reads/writes for the app live here.
 * No screen or component may call Firestore directly (see .cursor/rules/groundchiflow.mdc).
 *
 * Firestore structure:
 *   users/{uid}/
 *     routines/progress   → { [day: number]: DayProgress }
 *     gutHealth/{entryId} → GutLogEntry
 *
 * Offline strategy:
 *   Firestore's built-in offline cache handles connectivity gaps automatically.
 *   AsyncStorage is used as a secondary fallback only if the user is not authenticated.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, firebaseAvailable } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import type { WearableProviderId } from '../constants/WearableRoadmap';

// Use Firestore only when: real user (not guest) + Firebase available
function useFirestore(user: { uid: string } | null): boolean {
  return !!(user && user.uid !== 'guest' && db && firebaseAvailable);
}

// ── Shared Types ─────────────────────────────────────────────────────────────

export interface DayProgress {
  completed: boolean;
  completedAt: string | null;
}

export type RoutineProgress = Record<number, DayProgress>;

export interface GutLogEntry {
  id: string;
  date: string;
  foods: string[];
  otherFood: string;
  mood: number;
  energy: number;
  notes: string;
  savedAt: string;
}

export interface VitalsEntry {
  date: string;
  hrv?: number;
  sleepHrs?: number;
  sleepQuality?: number;
  energy?: number;
  stress?: number;
  coherence?: number;
  /** Source of data: manual or wearable provider (for future import) */
  source?: WearableProviderId;
  savedAt: string;
}

// ── Internal AsyncStorage keys (fallback for unauthenticated) ────────────────
const AS_ROUTINES_KEY = 'routines_progress';
const AS_GUT_KEY = 'gut_health_logs';
const AS_ROUTINE_DAY_KEY = 'routine_current_day';
const AS_VITALS_KEY = 'vitals';

// ── Helpers ──────────────────────────────────────────────────────────────────

function routinesDocRef(uid: string) {
  if (!db) throw new Error('Firestore not available');
  return doc(db, 'users', uid, 'routines', 'progress');
}

function gutHealthColRef(uid: string) {
  if (!db) throw new Error('Firestore not available');
  return collection(db, 'users', uid, 'gutHealth');
}

function gutHealthEntryRef(uid: string, entryId: string) {
  if (!db) throw new Error('Firestore not available');
  return doc(db, 'users', uid, 'gutHealth', entryId);
}

function vitalsDocRef(uid: string, date: string) {
  if (!db) throw new Error('Firestore not available');
  return doc(db, 'users', uid, 'vitals', date);
}

// ── Hook: Routine Progress ────────────────────────────────────────────────────

export function useRoutineProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<RoutineProgress>({});
  const [loading, setLoading] = useState(true);

  // Subscribe to Firestore in real time when authenticated; else AsyncStorage
  useEffect(() => {
    if (!useFirestore(user)) {
      AsyncStorage.getItem(AS_ROUTINES_KEY)
        .then((raw) => {
          if (raw) setProgress(JSON.parse(raw));
        })
        .catch(() => {})
        .finally(() => setLoading(false));
      return;
    }

    setLoading(true);
    const ref = routinesDocRef(user!.uid);

    // onSnapshot keeps the UI in sync across devices in real time
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setProgress(snap.data() as RoutineProgress);
        }
        setLoading(false);
      },
      () => {
        // Firestore error — fall through to cached data, stop loading
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const saveProgress = useCallback(
    async (updated: RoutineProgress) => {
      setProgress(updated);

      if (!useFirestore(user)) {
        await AsyncStorage.setItem(AS_ROUTINES_KEY, JSON.stringify(updated));
        return;
      }

      await setDoc(routinesDocRef(user!.uid), updated, { merge: true });
    },
    [user]
  );

  const markDay = useCallback(
    async (day: number, completed: boolean) => {
      const updated: RoutineProgress = {
        ...progress,
        [day]: {
          completed,
          completedAt: completed ? new Date().toISOString() : null,
        },
      };
      await saveProgress(updated);
    },
    [progress, saveProgress]
  );

  return { progress, loading, markDay, saveProgress };
}

// ── Hook: Routine Day (shiftable, persists across missed days) ───────────────
// Decouples routine from calendar. Push back/forward when you miss days or vacation.
export function useRoutineDay() {
  const { user } = useAuth();
  const [routineDay, setRoutineDayState] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(AS_ROUTINE_DAY_KEY)
      .then((raw) => {
        if (raw) {
          const n = parseInt(raw, 10);
          if (n >= 1 && n <= 7) setRoutineDayState(n);
        } else {
          // First time: default to today's calendar day
          const d = new Date().getDay();
          const calendarDay = d === 0 ? 7 : d;
          setRoutineDayState(calendarDay);
          AsyncStorage.setItem(AS_ROUTINE_DAY_KEY, String(calendarDay));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveRoutineDay = useCallback(async (day: number) => {
    const d = ((day - 1) % 7 + 7) % 7 + 1; // clamp 1-7
    setRoutineDayState(d);
    await AsyncStorage.setItem(AS_ROUTINE_DAY_KEY, String(d));
  }, []);

  const pushBack = useCallback(() => {
    saveRoutineDay(routineDay - 1); // yesterday's routine
  }, [routineDay, saveRoutineDay]);

  const pushForward = useCallback(() => {
    saveRoutineDay(routineDay + 1); // tomorrow's routine
  }, [routineDay, saveRoutineDay]);

  const setToToday = useCallback(() => {
    const d = new Date().getDay();
    const calendarDay = d === 0 ? 7 : d;
    saveRoutineDay(calendarDay);
  }, [saveRoutineDay]);

  const setDay = useCallback((day: number) => {
    saveRoutineDay(day);
  }, [saveRoutineDay]);

  return { routineDay, loading, pushBack, pushForward, setToToday, setDay };
}

// ── Hook: Gut Health Logs ─────────────────────────────────────────────────────

export function useGutHealthLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<GutLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to Firestore when authenticated; else AsyncStorage
  useEffect(() => {
    if (!useFirestore(user)) {
      AsyncStorage.getItem(AS_GUT_KEY)
        .then((raw) => {
          if (raw) setLogs(JSON.parse(raw));
        })
        .catch(() => {})
        .finally(() => setLoading(false));
      return;
    }

    setLoading(true);
    const colRef = query(
      gutHealthColRef(user!.uid),
      orderBy('savedAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      colRef,
      (snap) => {
        const entries: GutLogEntry[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<GutLogEntry, 'id'>),
        }));
        setLogs(entries);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const addLog = useCallback(
    async (entry: Omit<GutLogEntry, 'id'>): Promise<void> => {
      if (!useFirestore(user)) {
        const newEntry: GutLogEntry = { id: Date.now().toString(), ...entry };
        const updated = [newEntry, ...logs];
        setLogs(updated);
        await AsyncStorage.setItem(AS_GUT_KEY, JSON.stringify(updated));
        return;
      }

      await addDoc(gutHealthColRef(user!.uid), {
        ...entry,
        savedAt: entry.savedAt,
        _createdAt: serverTimestamp(),
      });
      // onSnapshot listener above will update state automatically
    },
    [user, logs]
  );

  const deleteLog = useCallback(
    async (id: string): Promise<void> => {
      if (!useFirestore(user)) {
        const updated = logs.filter((l) => l.id !== id);
        setLogs(updated);
        await AsyncStorage.setItem(AS_GUT_KEY, JSON.stringify(updated));
        return;
      }

      await deleteDoc(gutHealthEntryRef(user!.uid, id));
      // onSnapshot listener above updates state automatically
    },
    [user, logs]
  );

  return { logs, loading, addLog, deleteLog };
}

// ── Hook: Daily Vitals (HRV, Sleep, Energy, Stress) ────────────────────────────
// One entry per date. Merge on save so users can log HRV now, Sleep later.
export function useVitals() {
  const { user } = useAuth();
  const [vitalsByDate, setVitalsByDate] = useState<Record<string, VitalsEntry>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!useFirestore(user)) {
      AsyncStorage.getItem(AS_VITALS_KEY)
        .then((raw) => {
          if (raw) setVitalsByDate(JSON.parse(raw));
        })
        .catch(() => {})
        .finally(() => setLoading(false));
      return;
    }

    setLoading(true);
    const today = new Date().toISOString().slice(0, 10);
    getDoc(vitalsDocRef(user!.uid, today))
      .then((snap) => {
        if (snap.exists()) {
          setVitalsByDate((prev) => ({ ...prev, [today]: snap.data() as VitalsEntry }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const getVitals = useCallback(
    async (date: string): Promise<VitalsEntry | null> => {
      if (!useFirestore(user)) {
        return vitalsByDate[date] ?? null;
      }
      try {
        const snap = await getDoc(vitalsDocRef(user!.uid, date));
        return snap.exists() ? (snap.data() as VitalsEntry) : null;
      } catch {
        return vitalsByDate[date] ?? null;
      }
    },
    [user, vitalsByDate]
  );

  const saveVitals = useCallback(
    async (date: string, data: Partial<Omit<VitalsEntry, 'date' | 'savedAt'>>): Promise<void> => {
      const savedAt = new Date().toISOString();
      // Regression guard: never allow caller payload to overwrite canonical date/savedAt fields.
      const { date: _ignoredDate, savedAt: _ignoredSavedAt, ...safeData } = (data as Partial<VitalsEntry>);
      const entry: VitalsEntry = {
        ...vitalsByDate[date],
        ...safeData,
        date,
        savedAt,
      };
      setVitalsByDate((prev) => ({ ...prev, [date]: entry }));

      if (!useFirestore(user)) {
        const updated = { ...vitalsByDate, [date]: entry };
        await AsyncStorage.setItem(AS_VITALS_KEY, JSON.stringify(updated));
        return;
      }

      await setDoc(vitalsDocRef(user!.uid, date), entry, { merge: true });
    },
    [user, vitalsByDate]
  );

  const loadVitalsForDate = useCallback(
    async (date: string) => {
      if (!useFirestore(user)) return vitalsByDate[date] ?? null;
      try {
        const snap = await getDoc(vitalsDocRef(user!.uid, date));
        const data = snap.exists() ? (snap.data() as VitalsEntry) : null;
        if (data) setVitalsByDate((prev) => ({ ...prev, [date]: data }));
        return data;
      } catch {
        return vitalsByDate[date] ?? null;
      }
    },
    [user, vitalsByDate]
  );

  return { vitalsByDate, loading, getVitals, saveVitals, loadVitalsForDate };
}
