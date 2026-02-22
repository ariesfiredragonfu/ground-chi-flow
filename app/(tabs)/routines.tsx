/**
 * Routines screen — "7-Day Breathwork Basics" program.
 *
 * Features:
 *  - Scrollable list of daily sessions (Day 1–7)
 *  - Countdown timer per session
 *  - Completion checkboxes persisted to AsyncStorage
 *
 * Persistence:
 *  AsyncStorage key: "routines_progress"
 *  Each day stores { completed: boolean, completedAt: string | null }
 *
 * To upgrade to Firebase Firestore:
 *  Replace AsyncStorage get/set with Firestore doc reads/writes
 *  keyed to the authenticated user's UID.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';

const STORAGE_KEY = 'routines_progress';

// ── Program definition ──────────────────────────────────────────────────────
const PROGRAM = [
  {
    day: 1,
    title: 'Box Breathing',
    duration: 5 * 60,  // seconds
    description: 'Inhale 4s · Hold 4s · Exhale 4s · Hold 4s. Activates the parasympathetic nervous system.',
    icon: 'square-outline' as const,
    color: Colors.primary,
  },
  {
    day: 2,
    title: '4-7-8 Breathing',
    duration: 6 * 60,
    description: 'Inhale 4s · Hold 7s · Exhale 8s. Deep nervous system reset and anxiety relief.',
    icon: 'timer-outline' as const,
    color: Colors.secondary,
  },
  {
    day: 3,
    title: 'Resonant Breathing',
    duration: 8 * 60,
    description: 'Breathe at 5–6 breaths/min (5s in, 5s out). Maximises HRV and heart coherence.',
    icon: 'heart-outline' as const,
    color: Colors.hrv,
  },
  {
    day: 4,
    title: 'Diaphragmatic Breathing',
    duration: 7 * 60,
    description: 'Belly rises on inhale, falls on exhale. Foundation of all breathwork.',
    icon: 'body-outline' as const,
    color: Colors.gut,
  },
  {
    day: 5,
    title: 'Alternate Nostril',
    duration: 8 * 60,
    description: 'Nadi Shodhana Pranayama — balances left/right brain hemispheres.',
    icon: 'git-branch-outline' as const,
    color: Colors.energy,
  },
  {
    day: 6,
    title: 'Wim Hof Method',
    duration: 10 * 60,
    description: '30 deep breaths, retain on exhale. Energising and immune-boosting.',
    icon: 'flame-outline' as const,
    color: Colors.warning,
  },
  {
    day: 7,
    title: 'Integration & Flow',
    duration: 12 * 60,
    description: 'Choose your favourite technique from the week. Build your personal practice.',
    icon: 'leaf-outline' as const,
    color: Colors.primary,
  },
];

// ── Day progress type ────────────────────────────────────────────────────────
interface DayProgress {
  completed: boolean;
  completedAt: string | null;
}
type Progress = Record<number, DayProgress>;

// ── Helper: format seconds as MM:SS ─────────────────────────────────────────
function formatTime(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function RoutinesScreen() {
  const [progress, setProgress] = useState<Progress>({});
  const [loadingProgress, setLoadingProgress] = useState(true);

  // Timer state: tracks which day is running and the remaining seconds
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load saved progress from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setProgress(JSON.parse(stored));
      } catch {
        // Silently fail — user starts with empty progress
      } finally {
        setLoadingProgress(false);
      }
    })();
  }, []);

  // Persist progress whenever it changes
  useEffect(() => {
    if (!loadingProgress) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress)).catch(() => {});
    }
  }, [progress, loadingProgress]);

  // Clean up timer on unmount
  useEffect(() => () => { clearInterval(timerRef.current!); }, []);

  const startTimer = useCallback((day: number, duration: number) => {
    clearInterval(timerRef.current!);
    setActiveDay(day);
    setTimeLeft(duration);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setActiveDay(null);
          // Auto-mark as complete when timer finishes
          setProgress((p) => ({
            ...p,
            [day]: { completed: true, completedAt: new Date().toISOString() },
          }));
          Alert.alert('Session Complete! 🌿', `Day ${day} breathwork done. Great work!`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current!);
    setActiveDay(null);
    setTimeLeft(0);
  }, []);

  const toggleComplete = useCallback((day: number) => {
    setProgress((p) => ({
      ...p,
      [day]: {
        completed: !p[day]?.completed,
        completedAt: !p[day]?.completed ? new Date().toISOString() : null,
      },
    }));
  }, []);

  const completedCount = Object.values(progress).filter((d) => d.completed).length;

  if (loadingProgress) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* ── Header ───────────────────────────────────────────── */}
        <Text style={styles.screenTitle}>7-Day Breathwork Basics</Text>
        <Text style={styles.screenSub}>
          Build a daily nervous system reset practice in one week.
        </Text>

        {/* ── Overall progress bar ─────────────────────────────── */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(completedCount / PROGRAM.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressLabel}>
          {completedCount} / {PROGRAM.length} days completed
        </Text>

        {/* ── Day cards ────────────────────────────────────────── */}
        {PROGRAM.map((session) => {
          const dayProgress = progress[session.day];
          const isCompleted = dayProgress?.completed ?? false;
          const isActive = activeDay === session.day;

          return (
            <View
              key={session.day}
              style={[
                styles.dayCard,
                isCompleted && styles.dayCardDone,
                isActive && styles.dayCardActive,
              ]}
            >
              {/* Card top row */}
              <View style={styles.cardHeader}>
                <View style={[styles.dayBadge, { backgroundColor: `${session.color}22` }]}>
                  <Ionicons name={session.icon} size={18} color={session.color} />
                </View>
                <View style={styles.cardTitles}>
                  <Text style={styles.dayLabel}>Day {session.day}</Text>
                  <Text style={styles.sessionTitle}>{session.title}</Text>
                </View>
                {/* Completion checkbox */}
                <TouchableOpacity
                  onPress={() => toggleComplete(session.day)}
                  style={[
                    styles.checkbox,
                    isCompleted && { backgroundColor: Colors.primary, borderColor: Colors.primary },
                  ]}
                >
                  {isCompleted && (
                    <Ionicons name="checkmark" size={14} color={Colors.white} />
                  )}
                </TouchableOpacity>
              </View>

              {/* Description */}
              <Text style={styles.description}>{session.description}</Text>

              {/* Duration + timer */}
              <View style={styles.cardFooter}>
                <View style={styles.durationChip}>
                  <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
                  <Text style={styles.durationText}>{session.duration / 60} min</Text>
                </View>

                {/* Timer display when active */}
                {isActive && (
                  <Text style={[styles.timerDisplay, { color: session.color }]}>
                    {formatTime(timeLeft)}
                  </Text>
                )}

                {/* Start / Stop button */}
                <TouchableOpacity
                  style={[
                    styles.timerBtn,
                    { backgroundColor: isActive ? Colors.error : session.color },
                  ]}
                  onPress={() =>
                    isActive
                      ? stopTimer()
                      : startTimer(session.day, session.duration)
                  }
                >
                  <Ionicons
                    name={isActive ? 'stop' : 'play'}
                    size={14}
                    color={Colors.white}
                  />
                  <Text style={styles.timerBtnText}>
                    {isActive ? 'Stop' : 'Start'}
                  </Text>
                </TouchableOpacity>
              </View>

              {isCompleted && dayProgress?.completedAt && (
                <Text style={styles.completedAt}>
                  ✓ Completed {new Date(dayProgress.completedAt).toLocaleDateString()}
                </Text>
              )}
            </View>
          );
        })}

        {/* ── Coming soon teaser ────────────────────────────────── */}
        <View style={styles.comingSoon}>
          <Ionicons name="add-circle-outline" size={20} color={Colors.textMuted} />
          <Text style={styles.comingSoonText}>
            More programs coming soon: Somatic Release, Yoga Nidra, Cold Exposure Breathing…
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: 20, paddingBottom: 40 },

  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  screenSub: { color: Colors.textSecondary, fontSize: 13, marginBottom: 16 },

  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    marginBottom: 20,
  },

  dayCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayCardDone: { borderColor: `${Colors.primary}66` },
  dayCardActive: { borderColor: Colors.secondary },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  dayBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitles: { flex: 1 },
  dayLabel: { color: Colors.textMuted, fontSize: 11, fontWeight: '600' },
  sessionTitle: { color: Colors.textPrimary, fontSize: 16, fontWeight: '700' },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  description: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  durationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCardLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  durationText: { color: Colors.textSecondary, fontSize: 12 },

  timerDisplay: {
    fontSize: 20,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
  },
  timerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 4,
    marginLeft: 'auto',
  },
  timerBtnText: { color: Colors.white, fontWeight: '700', fontSize: 13 },

  completedAt: {
    color: Colors.primary,
    fontSize: 11,
    marginTop: 8,
    fontStyle: 'italic',
  },

  comingSoon: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  comingSoonText: { color: Colors.textMuted, fontSize: 13, flex: 1 },
});
