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
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

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

// ── Internal AsyncStorage keys (fallback for unauthenticated) ────────────────
const AS_ROUTINES_KEY = 'routines_progress';
const AS_GUT_KEY = 'gut_health_logs';

// ── Helpers ──────────────────────────────────────────────────────────────────

function routinesDocRef(uid: string) {
  return doc(db, 'users', uid, 'routines', 'progress');
}

function gutHealthColRef(uid: string) {
  return collection(db, 'users', uid, 'gutHealth');
}

function gutHealthEntryRef(uid: string, entryId: string) {
  return doc(db, 'users', uid, 'gutHealth', entryId);
}

// ── Hook: Routine Progress ────────────────────────────────────────────────────

export function useRoutineProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<RoutineProgress>({});
  const [loading, setLoading] = useState(true);

  // Subscribe to Firestore in real time when authenticated
  useEffect(() => {
    if (!user) {
      // Fallback: load from AsyncStorage
      AsyncStorage.getItem(AS_ROUTINES_KEY)
        .then((raw) => {
          if (raw) setProgress(JSON.parse(raw));
        })
        .catch(() => {})
        .finally(() => setLoading(false));
      return;
    }

    setLoading(true);
    const ref = routinesDocRef(user.uid);

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

      if (!user) {
        await AsyncStorage.setItem(AS_ROUTINES_KEY, JSON.stringify(updated));
        return;
      }

      await setDoc(routinesDocRef(user.uid), updated, { merge: true });
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

// ── Hook: Gut Health Logs ─────────────────────────────────────────────────────

export function useGutHealthLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<GutLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to Firestore in real time when authenticated
  useEffect(() => {
    if (!user) {
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
      gutHealthColRef(user.uid),
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
      if (!user) {
        const newEntry: GutLogEntry = { id: Date.now().toString(), ...entry };
        const updated = [newEntry, ...logs];
        setLogs(updated);
        await AsyncStorage.setItem(AS_GUT_KEY, JSON.stringify(updated));
        return;
      }

      // Firestore path — id is assigned by Firestore
      await addDoc(gutHealthColRef(user.uid), {
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
      if (!user) {
        const updated = logs.filter((l) => l.id !== id);
        setLogs(updated);
        await AsyncStorage.setItem(AS_GUT_KEY, JSON.stringify(updated));
        return;
      }

      await deleteDoc(gutHealthEntryRef(user.uid, id));
      // onSnapshot listener above updates state automatically
    },
    [user, logs]
  );

  return { logs, loading, addLog, deleteLog };
}
