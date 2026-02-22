/**
 * Dashboard / Home screen
 *
 * Displays mock health metrics for HRV, Coherence, Daily Energy, Sleep,
 * and Stress. Uses ProgressCircle for visual ring indicators and MetricCard
 * for numeric values.
 *
 * Data is mocked here — in production, replace with:
 *  - Wearable API data (Oura, Apple Health, Garmin)
 *  - Firebase Firestore or local AsyncStorage
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import MetricCard from '../../components/MetricCard';
import ProgressCircle from '../../components/ProgressCircle';
import { Colors } from '../../constants/Colors';

// ── Mock data (replace with real API/DB calls) ──────────────────────────────
const TODAY = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

const MOCK_METRICS = {
  hrv: { value: 65, unit: 'ms', trend: 'up' as const, trendLabel: '+4 vs yesterday' },
  coherence: { label: 'High', percentage: 82 },
  energy: { value: 8, outOf: 10 },
  sleep: { value: 7.2, unit: 'hrs', trend: 'neutral' as const },
  stress: { label: 'Low', percentage: 28 },
  breathworkStreak: 5,
};

// ── Insight messages based on HRV ─────────────────────────────────────────
function getHRVInsight(hrv: number): string {
  if (hrv >= 70) return '🟢 Excellent recovery. Great day for high-intensity work.';
  if (hrv >= 55) return '🟡 Good recovery. Moderate activity recommended.';
  return '🔴 Lower HRV today. Prioritise breathwork and rest.';
}

export default function DashboardScreen() {
  const { user, signOut } = useAuth();
  const displayName = user?.email?.split('@')[0] ?? 'Friend';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning, {displayName} 🌿</Text>
            <Text style={styles.date}>{TODAY}</Text>
          </View>
          <TouchableOpacity onPress={signOut} style={styles.signOutBtn}>
            <Ionicons name="log-out-outline" size={22} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* ── HRV Insight Banner ─────────────────────────────────── */}
        <View style={styles.insightBanner}>
          <Ionicons name="information-circle-outline" size={18} color={Colors.secondary} />
          <Text style={styles.insightText}>
            {getHRVInsight(MOCK_METRICS.hrv.value)}
          </Text>
        </View>

        {/* ── Primary Rings ──────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Today's Vitals</Text>
        <View style={styles.ringsRow}>
          <View style={styles.ringItem}>
            <ProgressCircle
              percentage={MOCK_METRICS.coherence.percentage}
              size={90}
              color={Colors.secondary}
              label={MOCK_METRICS.coherence.label}
              sublabel="Coherence"
            />
            <Text style={styles.ringLabel}>Heart Coherence</Text>
          </View>

          <View style={styles.ringItem}>
            <ProgressCircle
              percentage={(MOCK_METRICS.energy.value / MOCK_METRICS.energy.outOf) * 100}
              size={90}
              color={Colors.energy}
              label={`${MOCK_METRICS.energy.value}/10`}
              sublabel="Energy"
            />
            <Text style={styles.ringLabel}>Daily Energy</Text>
          </View>

          <View style={styles.ringItem}>
            {/* Stress is inverted: low stress = high score */}
            <ProgressCircle
              percentage={100 - MOCK_METRICS.stress.percentage}
              size={90}
              color={Colors.gut}
              label={MOCK_METRICS.stress.label}
              sublabel="Stress"
            />
            <Text style={styles.ringLabel}>Stress Level</Text>
          </View>
        </View>

        {/* ── Metric Cards ───────────────────────────────────────── */}
        <View style={styles.cardsGrid}>
          <MetricCard
            icon="heart-outline"
            iconColor={Colors.hrv}
            label="HRV"
            value={String(MOCK_METRICS.hrv.value)}
            unit="ms"
            trend={MOCK_METRICS.hrv.trend}
            trendLabel={MOCK_METRICS.hrv.trendLabel}
          />
          <MetricCard
            icon="moon-outline"
            iconColor={Colors.secondary}
            label="Sleep"
            value={String(MOCK_METRICS.sleep.value)}
            unit="hrs"
            trend={MOCK_METRICS.sleep.trend}
          />
        </View>

        {/* ── Breathwork Streak ──────────────────────────────────── */}
        <View style={styles.streakCard}>
          <Ionicons name="flame-outline" size={24} color={Colors.warning} />
          <View style={styles.streakText}>
            <Text style={styles.streakTitle}>
              🔥 {MOCK_METRICS.breathworkStreak}-Day Breathwork Streak
            </Text>
            <Text style={styles.streakSub}>
              Keep it up! Head to Routines to log today's session.
            </Text>
          </View>
        </View>

        {/* ── Quick Actions ──────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Quick Log</Text>
        <View style={styles.quickActions}>
          <QuickAction icon="fitness-outline" label="Log HRV" color={Colors.hrv} />
          <QuickAction icon="leaf-outline" label="Breathwork" color={Colors.primary} />
          <QuickAction icon="nutrition-outline" label="Gut Log" color={Colors.gut} />
          <QuickAction icon="bed-outline" label="Sleep" color={Colors.secondary} />
        </View>

        <Text style={styles.mockNote}>
          * Displaying mock data — connect a wearable or Firebase to see live metrics.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAction({
  icon,
  label,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
}) {
  return (
    <TouchableOpacity style={styles.quickBtn}>
      <View style={[styles.quickIcon, { backgroundColor: `${color}22` }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: 20, paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greeting: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  date: { color: Colors.textSecondary, fontSize: 13, marginTop: 2 },
  signOutBtn: { padding: 4 },

  insightBanner: {
    flexDirection: 'row',
    backgroundColor: `${Colors.secondary}22`,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: `${Colors.secondary}44`,
    alignItems: 'flex-start',
  },
  insightText: { color: Colors.textPrimary, fontSize: 13, flex: 1, lineHeight: 18 },

  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 14,
  },

  ringsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  ringItem: { alignItems: 'center', gap: 8 },
  ringLabel: { color: Colors.textMuted, fontSize: 11, fontWeight: '600' },

  cardsGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },

  streakCard: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  streakText: { flex: 1 },
  streakTitle: { color: Colors.textPrimary, fontSize: 14, fontWeight: '700' },
  streakSub: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },

  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickBtn: { alignItems: 'center', gap: 6 },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickLabel: { color: Colors.textSecondary, fontSize: 11, fontWeight: '600' },

  mockNote: {
    color: Colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
