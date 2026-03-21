/**
 * Batch D — PT client UI for routineMerge (conflict tags + hide sections).
 * Persists via useExerciseSettings.updateRoutineMerge → Firestore.
 */
import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import type { PtProgramPayload, PtRoutineMerge } from '../lib/buildPtRehabSection';
import { ROUTINE_SECTION_IDS } from '../lib/routineSectionIds';

const CONFLICT_TAG_OPTIONS: { id: string; label: string; hint: string }[] = [
  { id: 'neck', label: 'Neck / upper quarter', hint: 'Hides mewing & neck blocks' },
  { id: 'knee', label: 'Knee', hint: 'Hides GOATA floor & main strength' },
  { id: 'lower_body_load', label: 'Lower-body load', hint: 'Same hide map as knee' },
];

const SECTION_LABELS: Record<string, string> = {
  meditation: 'Meditation',
  breathwork: 'Breathwork',
  pt_rehab: 'PT rehab block',
  mewing_face: 'Mewing & face',
  neck: 'Neck exercises',
  hand_mudras: 'Hand mudras',
  foot_exercises: 'Foot exercises',
  mudras_and_feet: 'Mudras + feet (both)',
  core_balance: 'Core balance',
  goata_floor: 'GOATA floor',
  qigong_tai_chi: 'Qigong / Tai Chi',
  main_strength: 'Main strength',
  longevity_cardio: 'Longevity cardio',
};

type Props = {
  ptProgram: PtProgramPayload;
  updateRoutineMerge: (patch: Partial<PtRoutineMerge>) => Promise<void>;
};

export function PtRoutineMergePanel({ ptProgram, updateRoutineMerge }: Props) {
  const [open, setOpen] = useState(false);

  const rm = ptProgram.routineMerge ?? {};
  const disabled = useMemo(() => new Set(rm.disabledSections ?? []), [rm.disabledSections]);
  const tags = useMemo(
    () => new Set((rm.conflictTagsActive ?? []).map((t) => String(t).trim().toLowerCase().replace(/\s+/g, '_'))),
    [rm.conflictTagsActive]
  );

  const toggleTag = useCallback(
    async (tagId: string) => {
      const next = new Set(tags);
      if (next.has(tagId)) next.delete(tagId);
      else next.add(tagId);
      await updateRoutineMerge({ conflictTagsActive: [...next] });
    },
    [tags, updateRoutineMerge]
  );

  const toggleSectionHidden = useCallback(
    async (sectionId: string) => {
      const next = new Set(disabled);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      await updateRoutineMerge({ disabledSections: [...next] });
    },
    [disabled, updateRoutineMerge]
  );

  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setOpen((v) => !v)}
        accessibilityRole="button"
        accessibilityLabel={open ? 'Collapse PT routine visibility' : 'Expand PT routine visibility'}
      >
        <Ionicons name="options-outline" size={20} color={Colors.hrv} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Routine visibility (PT)</Text>
          <Text style={styles.headerSub}>Hide GCF blocks that clash with your rehab — saved to your account</Text>
        </View>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={22} color={Colors.textSecondary} />
      </TouchableOpacity>

      {open ? (
        <View style={styles.body}>
          <Text style={styles.sectionLabel}>Conflict tags (from your care plan)</Text>
          {CONFLICT_TAG_OPTIONS.map((opt) => {
            const on = tags.has(opt.id);
            return (
              <TouchableOpacity
                key={opt.id}
                style={[styles.row, on && styles.rowOn]}
                onPress={() => toggleTag(opt.id)}
              >
                <View style={[styles.check, on && styles.checkOn]}>
                  {on ? <Ionicons name="checkmark" size={14} color={Colors.white} /> : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{opt.label}</Text>
                  <Text style={styles.rowHint}>{opt.hint}</Text>
                </View>
              </TouchableOpacity>
            );
          })}

          <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Also hide these sections</Text>
          <Text style={styles.bodyHint}>
            Turn on to remove a block from this screen. Your PT rehab section can stay visible even if other work is
            paused.
          </Text>
          {ROUTINE_SECTION_IDS.map((sid) => {
            const on = disabled.has(sid);
            const label = SECTION_LABELS[sid] ?? sid;
            return (
              <TouchableOpacity
                key={sid}
                style={[styles.row, styles.rowCompact, on && styles.rowOn]}
                onPress={() => toggleSectionHidden(sid)}
              >
                <View style={[styles.check, on && styles.checkOn]}>
                  {on ? <Ionicons name="checkmark" size={14} color={Colors.white} /> : null}
                </View>
                <Text style={styles.rowTitle}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${Colors.hrv}55`,
    backgroundColor: `${Colors.hrv}10`,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  headerSub: { fontSize: 11, color: Colors.textSecondary, marginTop: 2, lineHeight: 15 },
  body: { paddingHorizontal: 12, paddingBottom: 14 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  bodyHint: { fontSize: 11, color: Colors.textSecondary, marginBottom: 10, lineHeight: 15 },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  rowCompact: { alignItems: 'center' },
  rowOn: { borderColor: `${Colors.hrv}99`, backgroundColor: `${Colors.hrv}14` },
  check: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  checkOn: { backgroundColor: Colors.hrv, borderColor: Colors.hrv },
  rowTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  rowHint: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
});
