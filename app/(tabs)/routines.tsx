/**
 * Routines screen — Daily Morning Routine
 *
 * Order: Meditation → Breathwork → Core Balance → G-O-A-T-A Floor →
 *        Tai Chi/Qigong/Bagua → Main Exercises (Mon/Wed/Fri)
 *
 * Persistence: AsyncStorage / Firestore via useRoutineProgress
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { Colors } from '../../constants/Colors';
import { EXERCISE_POPPING_REGRESSION_NOTE } from '../../constants/movementQualityNotes';
import { useRoutineProgress, useRoutineDay } from '../../hooks/useHealthData';
import { useExerciseSettings } from '../../hooks/useExerciseSettings';
import {
  shouldShowPtRehabSection,
  buildPtRehabContextLines,
  buildPtRehabExerciseRows,
  buildPtRehabExtraNotes,
} from '../../lib/buildPtRehabSection';
import { getHiddenRoutineSectionIds, isRoutineSectionVisible } from '../../lib/mergeRoutineWithPt';
import { PtRoutineMergePanel } from '../../components/PtRoutineMergePanel';
import {
  MEDITATIONS,
  BREATHWORK,
  CORE_BALANCE,
  GOATA_FLOOR,
  TAI_CHI_QI_GONG_BAGUA,
  QIGONG_TAICHI_INTRO,
  WARMUP,
  NERVOUS_SYSTEM_FASCIA,
  ROUTINE_DAY_NAMES,
  isMainBlockDay,
  getMainExerciseDay,
  getMainExercises,
  LONGEVITY_CARDIO,
  VERTICAL_LOAD_PROGRESSION,
  ADVANCED_VERTICAL_LEAP_PROGRESSION,
  GYMNASTICS_FORZA_STYLE_PROGRESSION,
  FLOOR_GYMNASTICS_PROGRESSION,
  PARALLEL_BARS_GYMNASTICS_PROGRESSION,
  UNEVEN_BARS_GYMNASTICS_PROGRESSION,
  HIGH_BAR_GYMNASTICS_PROGRESSION,
  LOW_BAR_GYMNASTICS_PROGRESSION,
  FLOOR_FLIP_FOUNDATIONS_PROGRESSION,
  BALANCE_FUN_SPORTS,
  MEWING_FACE_EXERCISES_BY_LEVEL,
  FACE_MOBILITY_EXERCISES_BY_LEVEL,
  NECK_EXERCISES_BY_LEVEL,
  HAND_MUDRAS_DAY_1,
  HAND_MUDRAS_DAY_3,
  HAND_MUDRAS_DAY_5,
  FOOT_EXERCISES_DAY_1,
  FOOT_EXERCISES_DAY_3,
  FOOT_EXERCISES_DAY_5,
  MAIN_EXERCISE_REGRESSIONS,
  NERVOUS_SYSTEM_QUICK_TWITCH_BY_DAY,
  NERVOUS_SYSTEM_STABILITY_BALL_BY_DAY,
  NERVOUS_SYSTEM_POOL_OPTIONS_BY_DAY,
} from '../../constants/DailyRoutine';
import type { MainExerciseRegression } from '../../constants/DailyRoutine';

// ── Helpers ─────────────────────────────────────────────────────────────────
function formatTime(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function safeDeactivateKeepAwake(tag: string): void {
  void deactivateKeepAwake(tag).catch(() => {});
}

function inferDurationSeconds(detail: string | null, reps: string | null): number | null {
  const text = `${detail ?? ''} ${reps ?? ''}`.toLowerCase();
  const m = text.match(/(\d+)(?:\s*[–-]\s*\d+)?\s*(sec|seconds|min|minutes)\b/);
  if (!m) return null;
  const n = Number(m[1]);
  if (!Number.isFinite(n) || n <= 0) return null;
  const unit = m[2];
  if (unit.startsWith('min')) return n * 60;
  return n;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}


// ── Section component ───────────────────────────────────────────────────────
function Section({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={[styles.sectionHeader, { borderLeftColor: color }]}>
        <Ionicons name={icon} size={20} color={color} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

// ── Exercise item ────────────────────────────────────────────────────────────
type ExerciseItemProps = {
  name: string;
  detail: string | null;
  reps: string | null;
  videoUrl?: string | null;
  learnMoreUrl?: string | null;
  regression?: MainExerciseRegression | null;
  onTimerComplete?: (exerciseName: string) => void;
  autoEasier?: boolean;
  /** Show movement-quality line under the exercise (default: all routine exercises). */
  showPoppingNote?: boolean;
  /**
   * Mon/Wed/Fri main list only: always put title + detail on their own row above actions so
   * mobile web never squeezes the label into a single-character column.
   */
  mainBlockExercise?: boolean;
};
/** Viewport width below this: title row full width, actions wrap (avoids one-letter-per-line labels). */
const NARROW_ROUTINE_WIDTH = 560;

type LsitTier = 'easier' | 'middle' | 'full';

function ExerciseItem({
  name,
  detail,
  reps,
  videoUrl,
  learnMoreUrl,
  regression,
  onTimerComplete,
  autoEasier = false,
  showPoppingNote = true,
  mainBlockExercise = false,
}: ExerciseItemProps) {
  const { width: windowWidth } = useWindowDimensions();
  const breakTitleRow = mainBlockExercise || windowWidth < NARROW_ROUTINE_WIDTH;
  const hasLadder = !!(regression?.intermediateStep);
  const [tier, setTier] = useState<LsitTier>(() => (autoEasier ? 'easier' : 'full'));
  const [useRegression, setUseRegression] = useState(
    () => !!(regression && !regression.intermediateStep && autoEasier)
  );
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const keepAwakeTagRef = useRef(`exercise-timer-${name.replace(/\s+/g, '-').toLowerCase()}`);

  useEffect(() => {
    if (hasLadder) {
      setTier(autoEasier ? 'easier' : 'full');
    } else {
      setUseRegression(autoEasier && !!regression);
    }
  }, [name, regression?.name, regression?.intermediateStep?.name, autoEasier, hasLadder]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      safeDeactivateKeepAwake(keepAwakeTagRef.current);
    };
  }, []);

  let activeVideoUrl: string | undefined;
  let activeLearnMoreUrl: string | undefined;
  let activeName: string;
  let baseDetail: string | null;
  let baseReps: string | null;

  if (hasLadder && regression) {
    if (tier === 'easier') {
      activeName = regression.name;
      baseDetail = regression.detail;
      baseReps = regression.reps;
      activeVideoUrl = regression.videoUrl ?? undefined;
      activeLearnMoreUrl = regression.learnMoreUrl ?? undefined;
    } else if (tier === 'middle' && regression.intermediateStep) {
      const m = regression.intermediateStep;
      activeName = m.name;
      baseDetail = m.detail;
      baseReps = m.reps;
      activeVideoUrl = m.videoUrl ?? undefined;
      activeLearnMoreUrl = m.learnMoreUrl ?? undefined;
    } else {
      activeName = name;
      baseDetail = detail;
      baseReps = reps;
      activeVideoUrl = videoUrl ?? undefined;
      activeLearnMoreUrl = learnMoreUrl ?? undefined;
    }
  } else {
    activeVideoUrl = useRegression && regression?.videoUrl ? regression.videoUrl : videoUrl ?? undefined;
    activeLearnMoreUrl = useRegression && regression?.learnMoreUrl ? regression.learnMoreUrl : learnMoreUrl ?? undefined;
    activeName = useRegression && regression ? regression.name : name;
    baseDetail = useRegression && regression ? regression.detail : detail;
    baseReps = useRegression && regression ? regression.reps : reps;
  }

  const activeDetail = autoEasier
    ? [baseDetail, 'Reduced range of motion; stop before pain.'].filter(Boolean).join(' · ')
    : baseDetail;
  const activeReps = autoEasier
    ? [baseReps, 'Use ~60–80% of listed reps/time to start.'].filter(Boolean).join(' · ')
    : baseReps;

  const linkUrl = activeVideoUrl || activeLearnMoreUrl;
  const linkLabel = activeVideoUrl ? 'Watch' : 'Learn more';
  const inferredSeconds = inferDurationSeconds(activeDetail, activeReps);

  const startExerciseTimer = async () => {
    if (!inferredSeconds || inferredSeconds <= 0) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerRunning(true);
    setTimeLeft(inferredSeconds);
    try {
      await activateKeepAwakeAsync(keepAwakeTagRef.current);
    } catch {}

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setTimerRunning(false);
          safeDeactivateKeepAwake(keepAwakeTagRef.current);
          onTimerComplete?.(activeName);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopExerciseTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setTimerRunning(false);
    setTimeLeft(0);
    safeDeactivateKeepAwake(keepAwakeTagRef.current);
  };

  const webMainBlockText =
    mainBlockExercise && Platform.OS === 'web'
      ? ({
          whiteSpace: 'normal',
          wordBreak: 'normal',
          overflowWrap: 'break-word',
        } as import('react-native').TextStyle)
      : undefined;

  return (
    <View style={styles.exerciseItemBlock}>
      <View style={[styles.exerciseRow, breakTitleRow && styles.exerciseRowWrap]}>
        <View style={[styles.exerciseMain, breakTitleRow && styles.exerciseMainBreakRow]}>
          <Text
            style={[
              styles.exerciseName,
              mainBlockExercise ? styles.exerciseNameMainBlock : null,
              webMainBlockText,
            ]}
          >
            {activeName}
          </Text>
          {(activeDetail || activeReps) && (
            <Text
              style={[
                styles.exerciseDetail,
                mainBlockExercise ? styles.exerciseDetailMainBlock : null,
                webMainBlockText,
              ]}
            >
              {[activeDetail, activeReps].filter(Boolean).join(' · ')}
            </Text>
          )}
        </View>

        <View
          style={
            breakTitleRow
              ? styles.exerciseActionsRowWrap
              : { flexDirection: 'row', gap: 8, alignItems: 'center' }
          }
        >
          {inferredSeconds ? (
            <TouchableOpacity
              style={styles.exerciseLinkBtnOutline}
              onPress={timerRunning ? stopExerciseTimer : startExerciseTimer}
            >
              <Ionicons name={timerRunning ? 'stop-outline' : 'timer-outline'} size={16} color={Colors.primary} />
              <Text style={[styles.exerciseLinkText, { color: Colors.primary }]}>
                {timerRunning ? formatTime(timeLeft) : `Timer ${formatTime(inferredSeconds)}`}
              </Text>
            </TouchableOpacity>
          ) : null}

          {linkUrl ? (
            <TouchableOpacity
              style={styles.exerciseLinkBtn}
              onPress={() => linkUrl && Linking.openURL(linkUrl)}
            >
              <Ionicons name={activeVideoUrl ? 'play-circle-outline' : 'open-outline'} size={16} color={Colors.primary} />
              <Text style={styles.exerciseLinkText}>{linkLabel}</Text>
            </TouchableOpacity>
          ) : null}

          {hasLadder && regression?.intermediateStep ? (
            <View style={styles.tierBtnGroup}>
              {(['easier', 'middle', 'full'] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.tierBtn, tier === t && styles.tierBtnActive]}
                  onPress={() => setTier(t)}
                >
                  <Text style={[styles.tierBtnText, tier === t && styles.tierBtnTextActive]}>
                    {t === 'easier' ? 'Knee tuck' : t === 'middle' ? 'Assisted' : 'L-sit'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : regression ? (
            <TouchableOpacity
              style={styles.exerciseLinkBtnOutline}
              onPress={() => setUseRegression((v) => !v)}
            >
              <Text style={[styles.exerciseLinkText, { color: Colors.primary }]}>
                {useRegression ? (autoEasier ? 'Beginner option active' : 'Full option') : 'Easier option'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {showPoppingNote ? (
        <Text style={styles.exercisePoppingNote}>{EXERCISE_POPPING_REGRESSION_NOTE}</Text>
      ) : null}
    </View>
  );
}

export default function RoutinesScreen() {
  const router = useRouter();
  const { progress, loading: loadingProgress, markDay } = useRoutineProgress();
  const { routineDay, pushBack, pushForward, setToToday, setDay } = useRoutineDay();
  const mainBlockToday = isMainBlockDay(routineDay);
  const mainDay = getMainExerciseDay(routineDay);
  const mainExercises = getMainExercises(mainDay);
  const {
    loading: loadingExerciseSettings,
    needsSelection,
    level,
    source,
    setLevel,
    settings,
    updateRoutineMerge,
  } = useExerciseSettings();

  const [activeBreathworkDay, setActiveBreathworkDay] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeMeditationTimer, setActiveMeditationTimer] = useState(false);
  const [meditationTimeLeft, setMeditationTimeLeft] = useState(0);
  const meditationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathKeepAwakeTag = 'gcf-breathwork-timer';
  const medKeepAwakeTag = 'gcf-meditation-timer';
  const completionSoundRef = useRef<Audio.Sound | null>(null);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const levelPromptedRef = useRef(false);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeBreathworkDay) {
      safeDeactivateKeepAwake(breathKeepAwakeTag);
      return;
    }
    activateKeepAwakeAsync(breathKeepAwakeTag).catch(() => {});
    return () => {
      safeDeactivateKeepAwake(breathKeepAwakeTag);
    };
  }, [activeBreathworkDay]);

  useEffect(() => {
    if (!activeMeditationTimer) {
      safeDeactivateKeepAwake(medKeepAwakeTag);
      return;
    }
    activateKeepAwakeAsync(medKeepAwakeTag).catch(() => {});
    return () => {
      safeDeactivateKeepAwake(medKeepAwakeTag);
    };
  }, [activeMeditationTimer]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current!);
      clearInterval(meditationTimerRef.current!);
      safeDeactivateKeepAwake(breathKeepAwakeTag);
      safeDeactivateKeepAwake(medKeepAwakeTag);
      if (completionSoundRef.current) {
        completionSoundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    if (loadingExerciseSettings) return;
    if (!needsSelection) return;
    if (levelPromptedRef.current) return;
    levelPromptedRef.current = true;

    Alert.alert('Choose your exercise level', 'Select one (you can change this anytime):', [
      { text: 'Beginner', onPress: () => setLevel('beginner', 'signup') },
      { text: 'Intermediate', onPress: () => setLevel('intermediate', 'signup') },
      { text: 'Advanced', onPress: () => setLevel('advanced', 'signup') },
    ]);
  }, [loadingExerciseSettings, needsSelection, setLevel]);

  const meditation = MEDITATIONS[routineDay - 1];
  const breathwork = BREATHWORK[routineDay - 1];
  const taiChiDay = TAI_CHI_QI_GONG_BAGUA[routineDay - 1];
  const dayName = ROUTINE_DAY_NAMES[routineDay - 1];

  // Guard: if routine data is missing (e.g. old deploy), show fallback instead of crashing
  const hasFullRoutine =
    meditation != null &&
    breathwork != null &&
    taiChiDay != null &&
    Array.isArray(CORE_BALANCE) &&
    CORE_BALANCE.length > 0 &&
    Array.isArray(mainExercises);

  if (!hasFullRoutine) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={[styles.container, { paddingTop: 40 }]}>
          <Text style={styles.screenTitle}>Daily Morning Routine</Text>
          <Text style={[styles.screenSub, { marginTop: 12 }]}>
            Routine data is still loading or this build is outdated. Try a hard refresh (Ctrl+Shift+R).
          </Text>
          <Text style={[styles.screenSub2, { marginTop: 8 }]}>
            If the problem persists, the latest update may not have deployed yet.
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const breathworkCompleted = progress[breathwork.day]?.completed ?? false;
  const breathworkBadgeStyle = { ...styles.dayBadge, backgroundColor: breathwork.color + '22' };

  const showMudrasAndFeet = routineDay === 1 || routineDay === 3 || routineDay === 5;

  function pickTwoLadderExercises<T extends { name: string }>(items: T[]) {
    if (items.length <= 2) return items;
    const start = (routineDay - 1) % items.length;
    return [items[start], items[(start + 1) % items.length]];
  }

  const faceExercises = pickTwoLadderExercises(MEWING_FACE_EXERCISES_BY_LEVEL[level] || MEWING_FACE_EXERCISES_BY_LEVEL.beginner);
  const faceMobilityExercises = pickTwoLadderExercises(
    FACE_MOBILITY_EXERCISES_BY_LEVEL[level] || FACE_MOBILITY_EXERCISES_BY_LEVEL.beginner
  );
  const neckExercises = pickTwoLadderExercises(NECK_EXERCISES_BY_LEVEL[level] || NECK_EXERCISES_BY_LEVEL.beginner);

  const ptProgram = settings.ptProgram;
  const showPtRehab = shouldShowPtRehabSection(source, ptProgram);
  const ptRehabRows =
    showPtRehab && ptProgram ? buildPtRehabExerciseRows(ptProgram) : [];
  const ptRehabContext =
    showPtRehab && ptProgram ? buildPtRehabContextLines(ptProgram) : [];
  const ptRehabExtras =
    showPtRehab && ptProgram ? buildPtRehabExtraNotes(ptProgram) : [];

  const hiddenSections = useMemo(
    () => getHiddenRoutineSectionIds(source, ptProgram ?? undefined),
    [source, ptProgram]
  );
  const showSec = useCallback((id: string) => isRoutineSectionVisible(hiddenSections, id), [hiddenSections]);

  const mudras = routineDay === 1 ? HAND_MUDRAS_DAY_1 : routineDay === 3 ? HAND_MUDRAS_DAY_3 : HAND_MUDRAS_DAY_5;
  const feet = routineDay === 1 ? FOOT_EXERCISES_DAY_1 : routineDay === 3 ? FOOT_EXERCISES_DAY_3 : FOOT_EXERCISES_DAY_5;
  const quickTwitchFinisher = NERVOUS_SYSTEM_QUICK_TWITCH_BY_DAY[routineDay] ?? [];
  const stabilityBallBlock = NERVOUS_SYSTEM_STABILITY_BALL_BY_DAY[routineDay] ?? [];
  const poolOptionsBlock = NERVOUS_SYSTEM_POOL_OPTIONS_BY_DAY[routineDay] ?? [];
  const qigongRegressionByDay: Record<number, { title: string; videoUrl: string; videoTitle: string }> = {
    1: { title: 'Qigong regression: 8 Brocades basics', videoUrl: TAI_CHI_QI_GONG_BAGUA[1].videoUrl, videoTitle: TAI_CHI_QI_GONG_BAGUA[1].videoTitle },
    3: { title: 'Qigong regression: standing + breath flow', videoUrl: TAI_CHI_QI_GONG_BAGUA[4].videoUrl, videoTitle: TAI_CHI_QI_GONG_BAGUA[4].videoTitle },
    4: { title: 'Qigong regression: 8 Brocades basics', videoUrl: TAI_CHI_QI_GONG_BAGUA[1].videoUrl, videoTitle: TAI_CHI_QI_GONG_BAGUA[1].videoTitle },
    6: { title: 'Qigong regression: standing + breath flow', videoUrl: TAI_CHI_QI_GONG_BAGUA[4].videoUrl, videoTitle: TAI_CHI_QI_GONG_BAGUA[4].videoTitle },
    7: { title: 'Qigong regression: 8 Brocades basics', videoUrl: TAI_CHI_QI_GONG_BAGUA[1].videoUrl, videoTitle: TAI_CHI_QI_GONG_BAGUA[1].videoTitle },
  };
  const qigongRegression = qigongRegressionByDay[taiChiDay.day];

  const playDoneSound = useCallback(async () => {
    try {
      if (completionSoundRef.current) {
        await completionSoundRef.current.unloadAsync();
        completionSoundRef.current = null;
      }
      const { sound } = await Audio.Sound.createAsync({
        uri: 'https://www.soundjay.com/buttons/sounds/button-3.mp3',
      });
      completionSoundRef.current = sound;
      await sound.playAsync();
    } catch {
      // Keep UI flow even if sound fails.
    }
  }, []);

  const startBreathworkTimer = useCallback((day: number, duration: number) => {
    clearInterval(timerRef.current!);
    setActiveBreathworkDay(day);
    setTimeLeft(duration * 60);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setActiveBreathworkDay(null);
          safeDeactivateKeepAwake(breathKeepAwakeTag);
          markDay(day, true);
          playDoneSound().catch(() => {});
          Alert.alert('Breathwork Complete! 🌿', `Day ${day} done. Great work!`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [markDay, playDoneSound]);

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current!);
    setActiveBreathworkDay(null);
    setTimeLeft(0);
    safeDeactivateKeepAwake(breathKeepAwakeTag);
  }, []);

  const startMeditationTimer = useCallback((duration: number) => {
    clearInterval(meditationTimerRef.current!);
    setActiveMeditationTimer(true);
    setMeditationTimeLeft(duration * 60);
    meditationTimerRef.current = setInterval(() => {
      setMeditationTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(meditationTimerRef.current!);
          setActiveMeditationTimer(false);
          safeDeactivateKeepAwake(medKeepAwakeTag);
          playDoneSound().catch(() => {});
          Alert.alert('Meditation Complete 🌿', `${meditation.name} done. Nice focus.`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [meditation.name, playDoneSound]);

  const stopMeditationTimer = useCallback(() => {
    clearInterval(meditationTimerRef.current!);
    setActiveMeditationTimer(false);
    setMeditationTimeLeft(0);
    safeDeactivateKeepAwake(medKeepAwakeTag);
  }, []);

  const toggleComplete = useCallback((day: number) => {
    markDay(day, !progress[day]?.completed);
  }, [progress, markDay]);

  const onExerciseTimerComplete = useCallback(
    async (exerciseName: string) => {
      await playDoneSound();
      Alert.alert('Timer complete', `${exerciseName} timer finished.`);
    },
    [playDoneSound]
  );

  if (loadingProgress) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={true}>
        <Text style={styles.screenTitle}>Daily Morning Routine</Text>
        <Text style={styles.screenSub}>
          Routine Day {routineDay} ({dayName}-style) · {mainBlockToday ? `Main: ${mainDay}` : 'Nervous System & Fascia'}
        </Text>
        <Text style={styles.screenSub2}>
          Meditation · Breathwork · Mewing/Face · Neck · Core Balance · GOATA · Qigong · Tai Chi · {mainBlockToday ? 'Main' : 'Nervous System'} · Optional cardio
        </Text>

        {/* Day shift controls */}
        <View style={styles.dayControls}>
          <TouchableOpacity style={styles.dayBtn} onPress={pushBack}>
            <Ionicons name="chevron-back" size={20} color={Colors.primary} />
            <Text style={styles.dayBtnText}>Push back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dayBtn, styles.dayBtnCenter]}
            onPress={() => setShowDayPicker(!showDayPicker)}
          >
            <Text style={styles.dayBtnLabel}>Day {routineDay}</Text>
            <Text style={styles.dayBtnSub}>{dayName}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dayBtn} onPress={pushForward}>
            <Text style={styles.dayBtnText}>Push forward</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.levelSelectorRow}>
          <Text style={styles.levelSelectorLabel}>Exercise Level</Text>
          <View style={styles.levelSelectorTabs}>
            {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
              <TouchableOpacity
                key={lvl}
                style={[styles.levelTabBtn, level === lvl && styles.levelTabBtnActive]}
                onPress={() => setLevel(lvl, 'user')}
              >
                <Text style={[styles.levelTabText, level === lvl && styles.levelTabTextActive]}>
                  {lvl[0].toUpperCase() + lvl.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {showDayPicker && (
          <View style={styles.dayPicker}>
            <Text style={styles.dayPickerLabel}>Pick routine day:</Text>
            <View style={styles.dayPickerRow}>
              {ROUTINE_DAY_NAMES.map((name, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.dayPickerBtn, routineDay === i + 1 && styles.dayPickerBtnActive]}
                  onPress={() => { setDay(i + 1); setShowDayPicker(false); }}
                >
                  <Text style={[styles.dayPickerBtnText, routineDay === i + 1 && styles.dayPickerBtnTextActive]}>
                    {i + 1}
                  </Text>
                  <Text style={[styles.dayPickerBtnSub, routineDay === i + 1 && styles.dayPickerBtnTextActive]}>
                    {name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.setTodayBtn} onPress={() => { setToToday(); setShowDayPicker(false); }}>
              <Ionicons name="today-outline" size={16} color={Colors.primary} />
              <Text style={styles.setTodayText}>Set to today</Text>
            </TouchableOpacity>
          </View>
        )}

        {source === 'pt' && hiddenSections.size > 0 ? (
          <View style={styles.ptMergeBanner}>
            <Ionicons name="information-circle-outline" size={18} color={Colors.hrv} />
            <Text style={styles.ptMergeBannerText}>
              Some usual sections are hidden based on your PT handoff (merge rules). Your prescribed rehab block stays
              available when assigned.
            </Text>
          </View>
        ) : null}

        {source === 'pt' && ptProgram ? (
          <PtRoutineMergePanel ptProgram={ptProgram} updateRoutineMerge={updateRoutineMerge} />
        ) : null}

        {/* 1. Meditation */}
        {showSec('meditation') ? (
        <Section title="1. Meditation" icon="leaf-outline" color={meditation.color}>
          <View style={styles.sessionCard}>
            <Text style={styles.sessionTitle}>{meditation.name}</Text>
            <Text style={styles.sessionDesc}>{meditation.description}</Text>
            <Text style={styles.durationHint}>~{meditation.duration} min</Text>
            <View style={[styles.cardFooter, { marginTop: 10 }]}>
              <View style={styles.durationChip}>
                <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
                <Text style={styles.durationText}>{meditation.duration} min</Text>
              </View>
              {activeMeditationTimer ? (
                <Text style={[styles.timerDisplay, { color: meditation.color }]}>{formatTime(meditationTimeLeft)}</Text>
              ) : null}
              <TouchableOpacity
                style={[styles.timerBtn, { backgroundColor: activeMeditationTimer ? Colors.error : meditation.color }]}
                onPress={() =>
                  activeMeditationTimer
                    ? stopMeditationTimer()
                    : startMeditationTimer(meditation.duration)
                }
              >
                <Ionicons name={activeMeditationTimer ? 'stop' : 'play'} size={14} color={Colors.white} />
                <Text style={styles.timerBtnText}>{activeMeditationTimer ? 'Stop' : 'Start'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Section>
        ) : null}

        {/* 2. Breathwork */}
        {showSec('breathwork') ? (
        <Section title="2. Breathwork" icon="heart-outline" color={breathwork.color}>
          <View style={[styles.dayCard, breathworkCompleted && styles.dayCardDone]}>
            <View style={styles.cardHeader}>
              <View style={breathworkBadgeStyle}>
                <Ionicons name={breathwork.icon} size={18} color={breathwork.color} />
              </View>
              <View style={styles.cardTitles}>
                <Text style={styles.dayLabel}>Day {breathwork.day}</Text>
                <Text style={styles.sessionTitle}>{breathwork.title}</Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleComplete(breathwork.day)}
                style={[styles.checkbox, breathworkCompleted && { backgroundColor: Colors.primary, borderColor: Colors.primary }]}
              >
                {breathworkCompleted && <Ionicons name="checkmark" size={14} color={Colors.white} />}
              </TouchableOpacity>
            </View>
            <Text style={styles.description}>{breathwork.description}</Text>
            <View style={styles.cardFooter}>
              <View style={styles.durationChip}>
                <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
                <Text style={styles.durationText}>{breathwork.duration} min</Text>
              </View>
              {activeBreathworkDay === breathwork.day && (
                <Text style={[styles.timerDisplay, { color: breathwork.color }]}>{formatTime(timeLeft)}</Text>
              )}
              <TouchableOpacity
                style={[styles.timerBtn, { backgroundColor: activeBreathworkDay === breathwork.day ? Colors.error : breathwork.color }]}
                onPress={() =>
                  activeBreathworkDay === breathwork.day
                    ? stopTimer()
                    : startBreathworkTimer(breathwork.day, breathwork.duration)
                }
              >
                <Ionicons name={activeBreathworkDay === breathwork.day ? 'stop' : 'play'} size={14} color={Colors.white} />
                <Text style={styles.timerBtnText}>{activeBreathworkDay === breathwork.day ? 'Stop' : 'Start'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Section>
        ) : null}

        {/* PT rehab from handoff (Firestore ptHandoffRequests → useExerciseSettings) */}
        {showPtRehab && ptProgram && showSec('pt_rehab') ? (
          <Section title="Your PT rehab program" icon="medkit-outline" color={Colors.hrv}>
            <Text style={styles.attributionHint}>
              From your physical therapist handoff — follow their guidance first; this does not replace medical care.
            </Text>
            {ptRehabContext.length > 0 ? (
              <View style={{ marginBottom: 10 }}>
                {ptRehabContext.map((line, i) => (
                  <Text key={`pt-ctx-${i}`} style={styles.screenSub2}>
                    {line}
                  </Text>
                ))}
              </View>
            ) : null}
            {ptRehabRows.length > 0 ? (
              ptRehabRows.map((ex, i) => (
                <ExerciseItem
                  key={`pt-rehab-${i}-${ex.name}`}
                  name={ex.name}
                  detail={ex.detail}
                  reps={ex.reps}
                  onTimerComplete={onExerciseTimerComplete}
                  autoEasier={level === 'beginner'}
                />
              ))
            ) : (
              <Text style={styles.screenSub}>
                Your PT program is on file. When your therapist includes custom exercises in the handoff export, they
                will list here. Keep following any instructions they gave you outside the app.
              </Text>
            )}
            {ptRehabExtras.length > 0 ? (
              <View style={{ marginTop: 12 }}>
                {ptRehabExtras.map((line, i) => (
                  <Text key={`pt-extra-${i}`} style={[styles.screenSub2, i > 0 ? { marginTop: 6 } : undefined]}>
                    {line}
                  </Text>
                ))}
              </View>
            ) : null}
          </Section>
        ) : null}

        {/* 3. Mewing & Face (Level-based) */}
        {showSec('mewing_face') ? (
        <Section title="Mewing & Face (Level-based)" icon="body-outline" color={Colors.primary}>
          <Text style={styles.attributionHint}>Pain-free posture/mobility suggestions.</Text>
          {faceExercises.map((ex, i) => (
            <ExerciseItem
              key={`face-${i}-${ex.name}`}
              name={ex.name}
              detail={ex.detail}
              reps={ex.reps}
              learnMoreUrl={ex.learnMoreUrl}
              regression={ex.regression}
              onTimerComplete={onExerciseTimerComplete}
            />
          ))}
          <Text style={[styles.subsectionLabel, { marginTop: 14 }]}>Face mobility (beyond mewing)</Text>
          {faceMobilityExercises.map((ex, i) => (
            <ExerciseItem
              key={`face-mob-${i}-${ex.name}`}
              name={ex.name}
              detail={ex.detail}
              reps={ex.reps}
              learnMoreUrl={ex.learnMoreUrl}
              regression={ex.regression}
              onTimerComplete={onExerciseTimerComplete}
            />
          ))}
        </Section>
        ) : null}

        {/* 4. Neck Exercises (Level-based) */}
        {showSec('neck') ? (
        <Section title="Neck Exercises (Level-based)" icon="pulse-outline" color={Colors.secondary}>
          {neckExercises.map((ex, i) => (
            <ExerciseItem
              key={`neck-${i}-${ex.name}`}
              name={ex.name}
              detail={ex.detail}
              reps={ex.reps}
              learnMoreUrl={ex.learnMoreUrl}
              regression={ex.regression}
              onTimerComplete={onExerciseTimerComplete}
            />
          ))}
        </Section>
        ) : null}

        {/* Days 1/3/5 extras */}
        {showMudrasAndFeet ? (
          <>
            {showSec('hand_mudras') ? (
            <Section title="Hand Mudras (Days 1/3/5)" icon="leaf-outline" color={Colors.gut}>
              {mudras.map((ex, i) => (
                <ExerciseItem
                  key={`mudra-${i}-${ex.name}`}
                  name={ex.name}
                  detail={ex.detail}
                  reps={ex.reps}
                  learnMoreUrl={ex.learnMoreUrl}
                  onTimerComplete={onExerciseTimerComplete}
                />
              ))}
            </Section>
            ) : null}

            {showSec('foot_exercises') ? (
            <Section title="Foot Exercises (Days 1/3/5)" icon="fitness-outline" color={Colors.energy}>
              {feet.map((ex, i) => (
                <ExerciseItem
                  key={`foot-${i}-${ex.name}`}
                  name={ex.name}
                  detail={ex.detail}
                  reps={ex.reps}
                  learnMoreUrl={ex.learnMoreUrl}
                  onTimerComplete={onExerciseTimerComplete}
                />
              ))}
            </Section>
            ) : null}
          </>
        ) : null}

        {/* 3. Core Balance */}
        {showSec('core_balance') ? (
        <Section title="3. Core Balance" icon="body-outline" color={Colors.primary}>
          <Text style={styles.attributionHint}>Dr. Ryan Peebles — corebalancetraining.com</Text>
          {CORE_BALANCE.map((ex, i) => (
            <ExerciseItem key={i} name={ex.name} detail={ex.detail} reps={ex.reps} videoUrl={'videoUrl' in ex ? optionalString(ex.videoUrl) : undefined} learnMoreUrl={'learnMoreUrl' in ex ? optionalString(ex.learnMoreUrl) : undefined} onTimerComplete={onExerciseTimerComplete} autoEasier={level === 'beginner'} />
          ))}
        </Section>
        ) : null}

        {/* 4. G-O-A-T-A Floor */}
        {showSec('goata_floor') ? (
        <Section title="4. G-O-A-T-A Floor" icon="fitness-outline" color={Colors.secondary}>
          <Text style={styles.attributionHint}>GOATA / Nick Ball — nickballtraining.com</Text>
          {GOATA_FLOOR.map((ex, i) => (
            <ExerciseItem key={i} name={ex.name} detail={ex.detail} reps={ex.reps} videoUrl={'videoUrl' in ex ? optionalString(ex.videoUrl) : undefined} learnMoreUrl={'learnMoreUrl' in ex ? optionalString(ex.learnMoreUrl) : undefined} onTimerComplete={onExerciseTimerComplete} autoEasier={level === 'beginner'} />
          ))}
        </Section>
        ) : null}

        {/* 5. Qigong → Tai Chi */}
        {showSec('qigong_tai_chi') ? (
        <Section title="5. Qigong → Tai Chi" icon="leaf-outline" color={Colors.gut}>
          <View style={styles.qigongIntro}>
            <Text style={styles.qigongIntroText}>{QIGONG_TAICHI_INTRO}</Text>
          </View>
          <View style={styles.sessionCard}>
            <Text style={styles.sessionTitle}>Day {taiChiDay.day}: {taiChiDay.title}</Text>
            <Text style={styles.sessionDesc}>{taiChiDay.description}</Text>
            <TouchableOpacity
              style={styles.videoLink}
              onPress={() => Linking.openURL(taiChiDay.videoUrl)}
            >
              <Ionicons name="play-circle-outline" size={20} color={Colors.secondary} />
              <Text style={styles.videoLinkText}>{taiChiDay.videoTitle}</Text>
            </TouchableOpacity>
            {taiChiDay.imageUrl && (
              <TouchableOpacity
                style={styles.videoLink}
                onPress={() => Linking.openURL(taiChiDay.imageUrl!)}
              >
                <Ionicons name="image-outline" size={20} color={Colors.secondary} />
                <Text style={styles.videoLinkText}>{taiChiDay.imageCredit}</Text>
              </TouchableOpacity>
            )}
          </View>
          {qigongRegression ? (
            <View style={styles.sessionCard}>
              <Text style={styles.sessionTitle}>Beginner regression (Qigong first step)</Text>
              <Text style={styles.sessionDesc}>
                Start with a simpler Qigong drill before this day&apos;s Tai Chi/Bagua form to learn detail slower.
              </Text>
              <Text style={styles.sessionDesc}>{qigongRegression.title}</Text>
              <TouchableOpacity
                style={styles.videoLink}
                onPress={() => Linking.openURL(qigongRegression.videoUrl)}
              >
                <Ionicons name="play-circle-outline" size={20} color={Colors.secondary} />
                <Text style={styles.videoLinkText}>{qigongRegression.videoTitle}</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </Section>
        ) : null}

        {/* 6. Main Block OR Nervous System & Fascia */}
        {showSec('main_strength') ? (
        mainBlockToday ? (
          <Section title={`6. Warm-up + Main (Day ${mainDay})`} icon="flame-outline" color={Colors.warning}>
            <Text style={styles.attributionHint}>Knees-over-toes style + GOATA</Text>
            <Text style={styles.subsectionLabel}>Warm-up</Text>
            {WARMUP.map((ex, i) => (
              <ExerciseItem key={`w-${i}`} name={ex.name} detail={ex.detail} reps={ex.reps} videoUrl={'videoUrl' in ex ? optionalString(ex.videoUrl) : undefined} learnMoreUrl={'learnMoreUrl' in ex ? optionalString(ex.learnMoreUrl) : undefined} onTimerComplete={onExerciseTimerComplete} autoEasier={level === 'beginner'} />
            ))}
            <Text style={[styles.subsectionLabel, { marginTop: 12 }]}>Main exercises</Text>
            {mainExercises.map((ex, i) => (
              <ExerciseItem
                key={`m-${i}`}
                name={ex.name}
                detail={ex.detail}
                reps={ex.reps}
                videoUrl={'videoUrl' in ex ? optionalString(ex.videoUrl) : undefined}
                learnMoreUrl={'learnMoreUrl' in ex ? optionalString(ex.learnMoreUrl) : undefined}
                regression={MAIN_EXERCISE_REGRESSIONS[ex.name]}
                onTimerComplete={onExerciseTimerComplete}
                autoEasier={level === 'beginner'}
                mainBlockExercise
              />
            ))}
          </Section>
        ) : (
          <Section title="6. Nervous System & Fascia" icon="pulse-outline" color={Colors.hrv}>
            <Text style={styles.nsFasciaHint}>Lighter block. Vagal tone, fascia release. ~15–25 min.</Text>
            {NERVOUS_SYSTEM_FASCIA.map((ex, i) => (
              <ExerciseItem key={`ns-${i}`} name={ex.name} detail={ex.detail} reps={ex.reps} videoUrl={'videoUrl' in ex ? optionalString(ex.videoUrl) : undefined} learnMoreUrl={'learnMoreUrl' in ex ? optionalString(ex.learnMoreUrl) : undefined} onTimerComplete={onExerciseTimerComplete} autoEasier={level === 'beginner'} />
            ))}
            {stabilityBallBlock.length ? (
              <>
                <Text style={[styles.subsectionLabel, { marginTop: 12 }]}>Stability ball (Tue/Thu/Sat)</Text>
                <Text style={styles.nsFasciaHint}>Reaction, deceleration, and core — Schroeder/Marinovich-inspired themes.</Text>
                {stabilityBallBlock.map((ex, i) => (
                  <ExerciseItem
                    key={`ball-${routineDay}-${i}`}
                    name={ex.name}
                    detail={ex.detail}
                    reps={ex.reps}
                    learnMoreUrl={ex.learnMoreUrl}
                    onTimerComplete={onExerciseTimerComplete}
                    autoEasier={level === 'beginner'}
                  />
                ))}
              </>
            ) : null}
            {poolOptionsBlock.length ? (
              <>
                <Text style={[styles.subsectionLabel, { marginTop: 12 }]}>Pool / water options (optional)</Text>
                <Text style={styles.nsFasciaHint}>
                  Competent swimmer only; shallow water; no breath-hold contests. Skip if no safe pool access.
                </Text>
                {poolOptionsBlock.map((ex, i) => (
                  <ExerciseItem
                    key={`pool-${routineDay}-${i}`}
                    name={ex.name}
                    detail={ex.detail}
                    reps={ex.reps}
                    learnMoreUrl={ex.learnMoreUrl}
                    onTimerComplete={onExerciseTimerComplete}
                    autoEasier={level === 'beginner'}
                  />
                ))}
              </>
            ) : null}
            {quickTwitchFinisher.length ? (
              <>
                <Text style={[styles.subsectionLabel, { marginTop: 12 }]}>Marinovich/Schroeder + Quick Twitch Finisher</Text>
                {quickTwitchFinisher.map((ex, i) => (
                  <ExerciseItem
                    key={`qt-${routineDay}-${i}`}
                    name={ex.name}
                    detail={ex.detail}
                    reps={ex.reps}
                    learnMoreUrl={ex.learnMoreUrl}
                    onTimerComplete={onExerciseTimerComplete}
                    autoEasier={level === 'beginner'}
                  />
                ))}
              </>
            ) : null}
          </Section>
        )
        ) : null}

        {/* Longevity cardio (optional, outside morning routine) */}
        {showSec('longevity_cardio') ? (
        <Section title="Optional: Zone 2 & Zone 5" icon="fitness-outline" color={Colors.energy}>
          <Text style={styles.subsectionLabel}>For longevity: aerobic base + VO2 max</Text>
          <View style={styles.cardioRow}>
            <Text style={styles.cardioTitle}>{LONGEVITY_CARDIO.zone2.title}</Text>
            <Text style={styles.cardioTarget}>{LONGEVITY_CARDIO.zone2.target}</Text>
          </View>
          <Text style={styles.cardioDetail}>{LONGEVITY_CARDIO.zone2.detail}</Text>
          <View style={styles.chiwalkHint}>
            <Text style={styles.chiwalkText}>💡 {LONGEVITY_CARDIO.chiwalk.detail}</Text>
          </View>
          <View style={[styles.cardioRow, { marginTop: 10 }]}>
            <Text style={styles.cardioTitle}>{LONGEVITY_CARDIO.zone5.title}</Text>
            <Text style={styles.cardioTarget}>{LONGEVITY_CARDIO.zone5.target}</Text>
          </View>
          <Text style={styles.cardioDetail}>{LONGEVITY_CARDIO.zone5.detail}</Text>

          <Text style={[styles.subsectionLabel, { marginTop: 14 }]}>Balance fun (advanced/medium)</Text>
          <Text style={styles.balanceFunHint}>Build balance before heavy jump work — pick a sport to explore:</Text>
          <View style={styles.balanceFunGrid}>
            {BALANCE_FUN_SPORTS.map((s) => (
              <View key={s} style={styles.balanceFunChip}>
                <Text style={styles.balanceFunText}>{s}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.subsectionLabel, { marginTop: 14 }]}>Vertical load progression</Text>
          {VERTICAL_LOAD_PROGRESSION.map((v, i) => (
            <View key={i} style={styles.progressionRow}>
              <Text style={styles.progressionStage}>{v.stage}</Text>
              <Text style={styles.progressionDetail}>{v.detail}</Text>
            </View>
          ))}
          <Text style={[styles.subsectionLabel, { marginTop: 14 }]}>Advanced progression (after jump rope)</Text>
          {ADVANCED_VERTICAL_LEAP_PROGRESSION.map((v, i) => (
            <View key={`adv-${i}`} style={styles.progressionRow}>
              <Text style={styles.progressionStage}>{v.stage}</Text>
              <Text style={styles.progressionDetail}>{v.detail}</Text>
              <TouchableOpacity style={styles.exerciseLinkBtn} onPress={() => Linking.openURL(v.learnMoreUrl)}>
                <Ionicons name="open-outline" size={16} color={Colors.primary} />
                <Text style={styles.exerciseLinkText}>Learn more</Text>
              </TouchableOpacity>
            </View>
          ))}

          <Text style={[styles.subsectionLabel, { marginTop: 16 }]}>Advanced athlete track — gymnastics (optional)</Text>
          <Text style={styles.nsFasciaHint}>
            Optional progressions after jump training. “Beginner” here means first rungs of these tracks, not the main morning routine. Balance fun above complements this work.
          </Text>

          <Text style={[styles.subsectionLabel, { marginTop: 10 }]}>Gymnastics Forza–style (rings / harness)</Text>
          <Text style={styles.nsFasciaHint}>Equipment optional; vendor-specific harness systems — learn before buying.</Text>
          {GYMNASTICS_FORZA_STYLE_PROGRESSION.map((v, i) => (
            <View key={`forza-${i}`} style={styles.progressionRow}>
              <Text style={styles.progressionStage}>{v.stage}</Text>
              <Text style={styles.progressionDetail}>{v.detail}</Text>
              <TouchableOpacity style={styles.exerciseLinkBtn} onPress={() => Linking.openURL(v.learnMoreUrl)}>
                <Ionicons name="open-outline" size={16} color={Colors.primary} />
                <Text style={styles.exerciseLinkText}>Learn more</Text>
              </TouchableOpacity>
            </View>
          ))}

          <Text style={[styles.subsectionLabel, { marginTop: 14 }]}>Floor gymnastics (general)</Text>
          {FLOOR_GYMNASTICS_PROGRESSION.map((v, i) => (
            <View key={`floor-${i}`} style={styles.progressionRow}>
              <Text style={styles.progressionStage}>{v.stage}</Text>
              <Text style={styles.progressionDetail}>{v.detail}</Text>
              <TouchableOpacity style={styles.exerciseLinkBtn} onPress={() => Linking.openURL(v.learnMoreUrl)}>
                <Ionicons name="open-outline" size={16} color={Colors.primary} />
                <Text style={styles.exerciseLinkText}>Learn more</Text>
              </TouchableOpacity>
            </View>
          ))}

          <Text style={[styles.subsectionLabel, { marginTop: 14 }]}>Parallel bars (style drills)</Text>
          {PARALLEL_BARS_GYMNASTICS_PROGRESSION.map((v, i) => (
            <View key={`pb-${i}`} style={styles.progressionRow}>
              <Text style={styles.progressionStage}>{v.stage}</Text>
              <Text style={styles.progressionDetail}>{v.detail}</Text>
              <TouchableOpacity style={styles.exerciseLinkBtn} onPress={() => Linking.openURL(v.learnMoreUrl)}>
                <Ionicons name="open-outline" size={16} color={Colors.primary} />
                <Text style={styles.exerciseLinkText}>Learn more</Text>
              </TouchableOpacity>
            </View>
          ))}

          <Text style={[styles.subsectionLabel, { marginTop: 14 }]}>Uneven bars (basics)</Text>
          {UNEVEN_BARS_GYMNASTICS_PROGRESSION.map((v, i) => (
            <View key={`ub-${i}`} style={styles.progressionRow}>
              <Text style={styles.progressionStage}>{v.stage}</Text>
              <Text style={styles.progressionDetail}>{v.detail}</Text>
              <TouchableOpacity style={styles.exerciseLinkBtn} onPress={() => Linking.openURL(v.learnMoreUrl)}>
                <Ionicons name="open-outline" size={16} color={Colors.primary} />
                <Text style={styles.exerciseLinkText}>Learn more</Text>
              </TouchableOpacity>
            </View>
          ))}

          <Text style={[styles.subsectionLabel, { marginTop: 14 }]}>High bar</Text>
          {HIGH_BAR_GYMNASTICS_PROGRESSION.map((v, i) => (
            <View key={`hb-${i}`} style={styles.progressionRow}>
              <Text style={styles.progressionStage}>{v.stage}</Text>
              <Text style={styles.progressionDetail}>{v.detail}</Text>
              <TouchableOpacity style={styles.exerciseLinkBtn} onPress={() => Linking.openURL(v.learnMoreUrl)}>
                <Ionicons name="open-outline" size={16} color={Colors.primary} />
                <Text style={styles.exerciseLinkText}>Learn more</Text>
              </TouchableOpacity>
            </View>
          ))}

          <Text style={[styles.subsectionLabel, { marginTop: 14 }]}>Low bar</Text>
          {LOW_BAR_GYMNASTICS_PROGRESSION.map((v, i) => (
            <View key={`lb-${i}`} style={styles.progressionRow}>
              <Text style={styles.progressionStage}>{v.stage}</Text>
              <Text style={styles.progressionDetail}>{v.detail}</Text>
              <TouchableOpacity style={styles.exerciseLinkBtn} onPress={() => Linking.openURL(v.learnMoreUrl)}>
                <Ionicons name="open-outline" size={16} color={Colors.primary} />
                <Text style={styles.exerciseLinkText}>Learn more</Text>
              </TouchableOpacity>
            </View>
          ))}

          <Text style={[styles.subsectionLabel, { marginTop: 14 }]}>Floor flip foundations (conditioning only)</Text>
          <Text style={styles.nsFasciaHint}>
            Full flips and advanced tumbling require a qualified coach, proper mats, and facility access. Do not attempt acrobatics unsupervised.
          </Text>
          {FLOOR_FLIP_FOUNDATIONS_PROGRESSION.map((v, i) => (
            <View key={`flip-${i}`} style={styles.progressionRow}>
              <Text style={styles.progressionStage}>{v.stage}</Text>
              <Text style={styles.progressionDetail}>{v.detail}</Text>
              <TouchableOpacity style={styles.exerciseLinkBtn} onPress={() => Linking.openURL(v.learnMoreUrl)}>
                <Ionicons name="open-outline" size={16} color={Colors.primary} />
                <Text style={styles.exerciseLinkText}>Learn more</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Section>
        ) : null}

        {/* Mark routine complete */}
        <TouchableOpacity
          style={styles.completeCard}
          onPress={() => toggleComplete(routineDay)}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.completeCheckbox,
              progress[routineDay]?.completed && { backgroundColor: Colors.primary, borderColor: Colors.primary },
            ]}
          >
            {progress[routineDay]?.completed && <Ionicons name="checkmark" size={18} color={Colors.white} />}
          </View>
          <View style={styles.completeText}>
            <Text style={styles.completeTitle}>Mark routine complete</Text>
            <Text style={styles.completeSub}>
              {progress[routineDay]?.completed ? 'Done for today!' : 'Confirm you finished all sections.'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resourcesLink}
          onPress={() => router.push('/resources')}
        >
          <Ionicons name="library-outline" size={18} color={Colors.primary} />
          <Text style={styles.resourcesLinkText}>Sources & attributions (Core Balance, ATG, GOATA, Qigong & Tai Chi)</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Duration by day and energy. Adjust as needed. 🌿</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: 20, paddingBottom: 40 },

  screenTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  screenSub: { color: Colors.textSecondary, fontSize: 13, marginBottom: 4 },
  screenSub2: { color: Colors.textMuted, fontSize: 11, marginBottom: 12 },
  ptMergeBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    marginBottom: 14,
    borderRadius: 10,
    backgroundColor: `${Colors.hrv}18`,
    borderWidth: 1,
    borderColor: `${Colors.hrv}44`,
  },
  ptMergeBannerText: { flex: 1, color: Colors.textSecondary, fontSize: 12, lineHeight: 17 },

  dayControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  levelSelectorRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14, paddingHorizontal: 2 },
  levelSelectorLabel: { color: Colors.textSecondary, fontSize: 12, fontWeight: '700' },
  levelSelectorTabs: { flexDirection: 'row', gap: 8, marginLeft: 'auto' },
  levelTabBtn: {
    borderWidth: 1,
    borderColor: `${Colors.primary}44`,
    backgroundColor: 'transparent',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  levelTabBtnActive: { backgroundColor: `${Colors.primary}22`, borderColor: `${Colors.primary}88` },
  levelTabText: { color: Colors.textSecondary, fontSize: 12, fontWeight: '700' },
  levelTabTextActive: { color: Colors.primary, fontWeight: '800' },
  dayBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: Colors.bgCard,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayBtnCenter: { flex: 1.2 },
  dayBtnText: { color: Colors.primary, fontSize: 12, fontWeight: '600' },
  dayBtnLabel: { color: Colors.textPrimary, fontSize: 14, fontWeight: '700' },
  dayBtnSub: { color: Colors.textMuted, fontSize: 11 },

  dayPicker: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayPickerLabel: { color: Colors.textSecondary, fontSize: 12, fontWeight: '600', marginBottom: 10 },
  dayPickerRow: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  dayPickerBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayPickerBtnActive: { backgroundColor: Colors.primary + '33', borderColor: Colors.primary },
  dayPickerBtnText: { color: Colors.textPrimary, fontSize: 12, fontWeight: '700' },
  dayPickerBtnSub: { color: Colors.textMuted, fontSize: 9 },
  dayPickerBtnTextActive: { color: Colors.primary },
  setTodayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  setTodayText: { color: Colors.primary, fontSize: 13, fontWeight: '600' },

  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    paddingLeft: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },

  sessionCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sessionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  sessionDesc: { color: Colors.textSecondary, fontSize: 13, lineHeight: 18 },
  durationHint: { color: Colors.textMuted, fontSize: 12, marginTop: 6 },
  qigongIntro: {
    backgroundColor: Colors.bgCardLight,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  qigongIntroText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19, fontStyle: 'italic' },
  videoLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.bgCardLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  videoLinkText: { color: Colors.secondary, fontSize: 13, fontWeight: '600', flex: 1 },

  dayCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayCardDone: { borderColor: `${Colors.primary}66` },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  dayBadge: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardTitles: { flex: 1 },
  dayLabel: { color: Colors.textMuted, fontSize: 11, fontWeight: '600' },
  description: { color: Colors.textSecondary, fontSize: 13, lineHeight: 18, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
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
  timerDisplay: { fontSize: 20, fontWeight: '800', flex: 1, textAlign: 'center' },
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
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  attributionHint: { color: Colors.textMuted, fontSize: 11, fontStyle: 'italic', marginBottom: 8 },
  subsectionLabel: { color: Colors.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 8 },
  nsFasciaHint: { color: Colors.textSecondary, fontSize: 13, marginBottom: 12, fontStyle: 'italic' },
  exerciseItemBlock: { marginBottom: 10 },
  exerciseRow: {
    backgroundColor: Colors.bgCard,
    borderRadius: 8,
    padding: 10,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'flex-start',
    gap: 10,
  },
  /** Narrow viewports: title uses full first row; actions wrap on row 2+ (no single-character columns). */
  exerciseRowWrap: {
    flexWrap: 'wrap',
  },
  exerciseMain: { flex: 1, minWidth: 0 },
  exerciseMainBreakRow: {
    flexBasis: '100%',
    width: '100%',
    minWidth: 0,
    alignSelf: 'stretch',
  },
  exerciseActionsRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    flexGrow: 1,
    flexBasis: '100%',
    minWidth: 0,
    maxWidth: '100%',
  },
  exerciseName: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  exerciseNameMainBlock: {
    width: '100%',
    maxWidth: '100%',
    flexShrink: 0,
  },
  exerciseDetailMainBlock: {
    width: '100%',
    maxWidth: '100%',
  },
  tierBtnGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
  tierBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${Colors.primary}44`,
    backgroundColor: 'transparent',
  },
  tierBtnActive: {
    backgroundColor: `${Colors.primary}22`,
    borderColor: `${Colors.primary}88`,
  },
  tierBtnText: { fontSize: 11, fontWeight: '700', color: Colors.primary },
  tierBtnTextActive: { fontWeight: '800' },
  exerciseDetail: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  exercisePoppingNote: {
    fontSize: 10,
    lineHeight: 14,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 6,
    paddingHorizontal: 4,
    paddingBottom: 2,
  },
  exerciseLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: `${Colors.primary}18`,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${Colors.primary}44`,
  },
  exerciseLinkBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${Colors.primary}44`,
  },
  exerciseLinkText: { fontSize: 12, color: Colors.primary, fontWeight: '600' },

  cardioRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardioTitle: { fontSize: 14, fontWeight: '700', color: Colors.energy },
  cardioTarget: { fontSize: 12, color: Colors.primary, fontWeight: '600' },
  cardioDetail: { fontSize: 12, color: Colors.textSecondary, marginTop: 2, lineHeight: 18 },
  chiwalkHint: { marginTop: 8, paddingLeft: 4 },
  chiwalkText: { fontSize: 12, color: Colors.textSecondary, fontStyle: 'italic' },
  completeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  completeCheckbox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeText: { flex: 1 },
  completeTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  completeSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },

  resourcesLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: `${Colors.primary}18`,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: `${Colors.primary}44`,
  },
  resourcesLinkText: { fontSize: 12, color: Colors.primary, fontWeight: '600', flex: 1 },
  progressionRow: { marginBottom: 8 },
  progressionStage: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  progressionDetail: { fontSize: 12, color: Colors.textSecondary, marginTop: 2, lineHeight: 17 },
  balanceFunHint: { fontSize: 12, color: Colors.textSecondary, marginBottom: 8 },
  balanceFunGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  balanceFunChip: {
    backgroundColor: Colors.bgCardLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  balanceFunText: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },

  footer: { marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: Colors.border },
  footerText: { color: Colors.textMuted, fontSize: 12, fontStyle: 'italic' },
});
