/**
 * Resources page — front runners, rehab pathways, attributions.
 *
 * GroundChiFlow builds on foundational work by Dr. Ryan Peebles, Ben Patrick,
 * Nick Ball, ChiLiving, and video creators. Display sources and credits.
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import {
  DISCLAIMER,
  FRONT_RUNNERS,
  LIFESTYLE_EXTRAS,
  RELATED_ECOSYSTEM,
  ATTRIBUTIONS,
} from '../../constants/DisclaimerResources';
import { ADVANCED_MODALITIES, NEUROFEEDBACK_FUTURE } from '../../constants/AdvancedLongevity';
import {
  MENTAL_HEALTH_LIFESTYLE,
  DETOX_EVIDENCE_BASED,
  PARASITE_NOTE,
  INTEGRATION_ROADMAP,
} from '../../constants/MentalHealthDetox';
import { WEARABLE_INTEGRATION_TODO } from '../../constants/WearableRoadmap';

export default function ResourcesScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Resources</Text>
        <Text style={styles.screenSub}>
          Front runners, ecosystem, attributions. GroundChiFlow uniquely combines rehab pathways + Tai Chi/Qigong/Bagua + full daily routine.
        </Text>

        {/* ── Related ecosystem ─────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Related ecosystem</Text>
        <Text style={styles.ecosystemIntro}>
          Others integrating longevity, breathwork, nutrition. We attribute and complement.
        </Text>
        {RELATED_ECOSYSTEM.map((e) => (
          <TouchableOpacity
            key={e.id}
            style={styles.ecosystemCard}
            onPress={() => Linking.openURL(e.url)}
            activeOpacity={0.8}
          >
            <View style={styles.ecosystemHeader}>
              <Text style={styles.ecosystemName}>{e.name}</Text>
              <Ionicons name="open-outline" size={16} color={Colors.secondary} />
            </View>
            <Text style={styles.ecosystemTagline}>{e.tagline}</Text>
            <Text style={styles.ecosystemDetail}>{e.detail}</Text>
          </TouchableOpacity>
        ))}

        {/* ── Full Disclaimer ───────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{DISCLAIMER.title}</Text>
          <Text style={styles.cardBody}>{DISCLAIMER.body}</Text>
        </View>

        {/* ── Four Front Runners ───────────────────────────────── */}
        <Text style={styles.sectionTitle}>Four Front Runners</Text>
        {FRONT_RUNNERS.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={styles.runnerCard}
            onPress={() => Linking.openURL(r.url)}
            activeOpacity={0.8}
          >
            <View style={styles.runnerHeader}>
              <Text style={styles.runnerName}>{r.name}</Text>
              <Ionicons name="open-outline" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.runnerProgram}>{r.program}</Text>
            <Text style={styles.runnerFocus}>{r.focus}</Text>
            <View style={styles.runnerWhen}>
              <Ionicons name="arrow-forward-circle" size={14} color={Colors.warning} />
              <Text style={styles.runnerWhenText}>{r.when}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* ── Lifestyle extras ────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Lifestyle Pillars (often overlooked)</Text>
        {LIFESTYLE_EXTRAS.map((e) => (
          <View key={e.id} style={styles.lifestyleRow}>
            <Text style={styles.lifestyleTitle}>{e.title}</Text>
            <Text style={styles.lifestyleDetail}>{e.detail}</Text>
          </View>
        ))}

        {/* ── Neurofeedback (future integration) ────────────────── */}
        <Text style={styles.sectionTitle}>Neurofeedback & brain state (coming)</Text>
        <Text style={styles.ecosystemIntro}>
          EEG-powered meditation. Real-time feedback for calm, focus, flow. References for future integration.
        </Text>
        {NEUROFEEDBACK_FUTURE.map((n) => (
          <TouchableOpacity
            key={n.name}
            style={styles.ecosystemCard}
            onPress={() => Linking.openURL(n.url)}
            activeOpacity={0.8}
          >
            <Text style={styles.ecosystemName}>{n.name}</Text>
            <Text style={styles.ecosystemDetail}>{n.detail}</Text>
          </TouchableOpacity>
        ))}

        {/* ── Advanced longevity modalities ────────────────────── */}
        <Text style={styles.sectionTitle}>Advanced longevity (upper tier)</Text>
        {ADVANCED_MODALITIES.map((m) => (
          <View key={m.id} style={styles.advancedRow}>
            <Ionicons name={m.icon} size={20} color={Colors.warning} />
            <View style={styles.advancedContent}>
              <Text style={styles.advancedTitle}>{m.title}</Text>
              <Text style={styles.advancedDetail}>{m.detail}</Text>
            </View>
          </View>
        ))}

        {/* ── Mental health ────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Mental health & stability</Text>
        <Text style={styles.ecosystemIntro}>
          Lifestyle psychiatry. Sleep, exercise, diet, social connection support brain chemistry.
        </Text>
        {MENTAL_HEALTH_LIFESTYLE.map((m) => (
          <View key={m.id} style={styles.advancedRow}>
            <Ionicons name={m.icon} size={20} color={Colors.secondary} />
            <View style={styles.advancedContent}>
              <Text style={styles.advancedTitle}>{m.title}</Text>
              <Text style={styles.advancedDetail}>{m.detail}</Text>
            </View>
          </View>
        ))}

        {/* ── Detox (evidence-based) ────────────────────────────── */}
        <Text style={styles.sectionTitle}>Detox (evidence-based)</Text>
        <Text style={styles.ecosystemIntro}>
          Safe practices. Hydration, fiber, sauna (with hydration), liver support.
        </Text>
        {DETOX_EVIDENCE_BASED.map((d) => (
          <View key={d.id} style={styles.advancedRow}>
            <Ionicons name={d.icon} size={20} color={Colors.gut} />
            <View style={styles.advancedContent}>
              <Text style={styles.advancedTitle}>{d.title}</Text>
              <Text style={styles.advancedDetail}>{d.detail}</Text>
            </View>
          </View>
        ))}
        <View style={styles.parasiteNote}>
          <Text style={styles.parasiteTitle}>{PARASITE_NOTE.title}</Text>
          <Text style={styles.parasiteDetail}>{PARASITE_NOTE.detail}</Text>
        </View>

        {/* ── Integration roadmap ───────────────────────────────── */}
        <Text style={styles.sectionTitle}>Integration roadmap (coming)</Text>
        <Text style={styles.ecosystemIntro}>
          Muse, Wellness Core, wearables. Past, present, future — mind, body, soul.
        </Text>
        {INTEGRATION_ROADMAP.map((i) => (
          <TouchableOpacity
            key={i.name}
            style={styles.ecosystemCard}
            onPress={() => i.url && Linking.openURL(i.url)}
            activeOpacity={i.url ? 0.8 : 1}
            disabled={!i.url}
          >
            <Text style={styles.ecosystemName}>{i.name}</Text>
            <Text style={styles.ecosystemDetail}>{i.detail}</Text>
          </TouchableOpacity>
        ))}

        {/* ── Wearable integrations (to-do) ──────────────────────── */}
        <Text style={styles.sectionTitle}>Wearable integrations (to-do)</Text>
        <Text style={styles.ecosystemIntro}>
          Manual input is primary. When you add devices, the groundwork is ready. Priority: Muse → Hume band → Ring.
        </Text>
        {WEARABLE_INTEGRATION_TODO.slice(0, 5).map((w) => (
          <View key={w.id} style={styles.wearableRow}>
            <View style={styles.wearableBadge}>
              <Text style={styles.wearablePriority}>{w.priority}</Text>
            </View>
            <View style={styles.wearableContent}>
              <Text style={styles.wearableName}>{w.name}</Text>
              <Text style={styles.wearableDetail}>{w.dataTypes.join(', ')}</Text>
            </View>
          </View>
        ))}

        {/* ── Attributions ─────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Sources & Attributions</Text>
        <View style={styles.attribCard}>
          {ATTRIBUTIONS.map((a, i) => (
            <View key={i} style={styles.attribRow}>
              <Text style={styles.attribSection}>{a.section}</Text>
              <TouchableOpacity onPress={() => a.url && Linking.openURL(a.url)}>
                <Text style={styles.attribSource}>{a.source} →</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          We recognize these practitioners for their foundational work. Thank you.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: 20, paddingBottom: 40 },

  screenTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  screenSub: { color: Colors.textSecondary, fontSize: 13, marginBottom: 20 },

  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 10 },
  cardBody: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },

  sectionTitle: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  ecosystemIntro: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  ecosystemCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ecosystemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  ecosystemName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  ecosystemTagline: { fontSize: 12, fontWeight: '600', color: Colors.secondary, marginBottom: 4 },
  ecosystemDetail: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17 },
  parasiteNote: {
    backgroundColor: `${Colors.warning}18`,
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: `${Colors.warning}44`,
  },
  parasiteTitle: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  parasiteDetail: { fontSize: 12, color: Colors.textSecondary, marginTop: 4, lineHeight: 17 },

  runnerCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  runnerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  runnerName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  runnerProgram: { fontSize: 13, fontWeight: '600', color: Colors.primary, marginBottom: 4 },
  runnerFocus: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17 },
  runnerWhen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  runnerWhenText: { fontSize: 12, color: Colors.warning, fontWeight: '600', flex: 1 },

  lifestyleRow: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  lifestyleTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  lifestyleDetail: { fontSize: 12, color: Colors.textSecondary, marginTop: 4, lineHeight: 17 },

  advancedRow: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  advancedContent: { flex: 1 },
  advancedTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  advancedDetail: { fontSize: 12, color: Colors.textSecondary, marginTop: 4, lineHeight: 17 },

  attribCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  attribRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  attribSection: { fontSize: 12, color: Colors.textSecondary, flex: 1 },
  attribSource: { fontSize: 12, color: Colors.primary, fontWeight: '600' },

  wearableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  wearableBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${Colors.primary}33`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wearablePriority: { fontSize: 12, fontWeight: '800', color: Colors.primary },
  wearableContent: { flex: 1 },
  wearableName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  wearableDetail: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },

  footer: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 24,
  },
});
