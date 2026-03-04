/**
 * Gut Health Log screen
 *
 * Daily log for:
 *  - Probiotic/fermented foods consumed (dropdown + free text)
 *  - Mood rating (1–10)
 *  - Energy rating (1–10)
 *  - Notes
 *
 * Entries are stored locally in AsyncStorage as a JSON array keyed by date.
 *
 * Upgrade path:
 *  - Sync to Firebase Firestore (replace AsyncStorage calls with Firestore)
 *  - Add charts (Victory Native or react-native-svg) to show mood/energy trends
 *  - Add photo upload (fermented food photos) via expo-image-picker
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useGutHealthLogs } from '../../hooks/useHealthData';
import {
  BIOME_HIERARCHY,
  GUT_NUTRITION_TIPS,
  FUELING_FOR_EXERCISE,
  MEAL_STRUCTURE,
  GUT_DIVERSITY_TIPS,
} from '../../constants/GutNutrition';

// ── Probiotic/fermented food options ────────────────────────────────────────
const FOOD_OPTIONS = [
  'None today',
  'Kefir',
  'Sauerkraut',
  'Kimchi',
  'Kombucha',
  'Yogurt (live cultures)',
  'Miso',
  'Tempeh',
  'Natto',
  'Sourdough',
  'Pickles (fermented)',
  'Apple cider vinegar',
  'Other',
];

// Types imported from hook — GutLogEntry lives in useHealthData.ts

// Today's date in YYYY-MM-DD
const todayKey = () => new Date().toISOString().slice(0, 10);

export default function GutHealthScreen() {
  const { logs, loading, addLog, deleteLog: removeLog } = useGutHealthLogs();

  // Form state
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [otherFood, setOtherFood] = useState('');
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const toggleFood = (food: string) => {
    setSelectedFoods((prev) =>
      prev.includes(food) ? prev.filter((f) => f !== food) : [...prev, food]
    );
  };

  const handleSave = async () => {
    if (selectedFoods.length === 0) {
      Alert.alert('No foods selected', 'Please select at least one food option.');
      return;
    }
    setSaving(true);
    try {
      await addLog({
        date: todayKey(),
        foods: selectedFoods,
        otherFood,
        mood,
        energy,
        notes,
        savedAt: new Date().toISOString(),
      });

      // Reset form
      setSelectedFoods([]);
      setOtherFood('');
      setMood(5);
      setEnergy(5);
      setNotes('');

      Alert.alert('Saved! 🌱', 'Gut health entry logged for today.');
    } catch {
      Alert.alert('Error', 'Could not save entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const deleteLog = useCallback((id: string) => {
    Alert.alert('Delete Entry', 'Remove this log entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => removeLog(id),
      },
    ]);
  }, [removeLog]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Gut Health & Meals</Text>
        <Text style={styles.screenSub}>
          Fuel your routines. Track probiotic foods, mood & energy to spot patterns.
        </Text>

        {/* ── Meals & Nutrition Guide ─────────────────────────── */}
        <View style={styles.guideCard}>
          <Text style={styles.guideTitle}>🥗 Meals & Nutrition</Text>
          <Text style={styles.guideSub}>Digestion + fueling for exercise</Text>

          <Text style={styles.guideSection}>Biome first</Text>
          <View style={styles.biomeRow}>
            <Text style={styles.biomeTitle}>{BIOME_HIERARCHY.first.title}</Text>
            <Text style={styles.biomeDetail}>{BIOME_HIERARCHY.first.detail}</Text>
          </View>
          <View style={styles.biomeRow}>
            <Text style={styles.biomeTitle}>{BIOME_HIERARCHY.ifNeeded.title}</Text>
            <Text style={styles.biomeDetail}>{BIOME_HIERARCHY.ifNeeded.detail}</Text>
          </View>

          <Text style={styles.guideSection}>Diversify your gut</Text>
          {GUT_DIVERSITY_TIPS.map((t, i) => (
            <Text key={i} style={styles.diversityTip}>• {t}</Text>
          ))}

          <Text style={styles.guideSection}>5 keys to gut health</Text>
          {GUT_NUTRITION_TIPS.map((tip) => (
            <View key={tip.id} style={styles.tipRow}>
              <Ionicons name={tip.icon} size={18} color={Colors.gut} />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDetail}>{tip.detail}</Text>
              </View>
            </View>
          ))}

          <Text style={styles.guideSection}>Fueling for routines</Text>
          <View style={styles.fuelRow}>
            <Text style={styles.fuelTitle}>{FUELING_FOR_EXERCISE.before.title}</Text>
            <Text style={styles.fuelDetail}>{FUELING_FOR_EXERCISE.before.detail}</Text>
          </View>
          <View style={styles.fuelRow}>
            <Text style={styles.fuelTitle}>{FUELING_FOR_EXERCISE.after.title}</Text>
            <Text style={styles.fuelDetail}>{FUELING_FOR_EXERCISE.after.detail}</Text>
          </View>
          <View style={styles.fuelRow}>
            <Text style={styles.fuelTitle}>{FUELING_FOR_EXERCISE.daily.title}</Text>
            <Text style={styles.fuelDetail}>{FUELING_FOR_EXERCISE.daily.detail}</Text>
          </View>

          <Text style={styles.guideSection}>Meal structure</Text>
          {MEAL_STRUCTURE.map((m) => (
            <View key={m.meal} style={styles.mealRow}>
              <Text style={styles.mealName}>{m.meal}</Text>
              <Text style={styles.mealExamples}>{m.examples}</Text>
            </View>
          ))}
        </View>

        {/* ── Form Card ───────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📅 Today — {todayKey()}</Text>

          {/* Food selection */}
          <Text style={styles.sectionLabel}>Biome / Fermented Foods (log daily)</Text>
          <View style={styles.foodGrid}>
            {FOOD_OPTIONS.map((food) => {
              const selected = selectedFoods.includes(food);
              return (
                <TouchableOpacity
                  key={food}
                  style={[styles.foodChip, selected && styles.foodChipSelected]}
                  onPress={() => toggleFood(food)}
                >
                  <Text
                    style={[styles.foodChipText, selected && styles.foodChipTextSelected]}
                  >
                    {food}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Other food text input */}
          {selectedFoods.includes('Other') && (
            <TextInput
              style={styles.textInput}
              placeholder="Describe the food…"
              placeholderTextColor={Colors.textMuted}
              value={otherFood}
              onChangeText={setOtherFood}
            />
          )}

          {/* Mood rating */}
          <Text style={styles.sectionLabel}>Mood  ({mood}/10)</Text>
          <RatingRow value={mood} onChange={setMood} color={Colors.secondary} />

          {/* Energy rating */}
          <Text style={styles.sectionLabel}>Energy  ({energy}/10)</Text>
          <RatingRow value={energy} onChange={setEnergy} color={Colors.energy} />

          {/* Notes */}
          <Text style={styles.sectionLabel}>Notes (optional)</Text>
          <TextInput
            style={[styles.textInput, styles.notesInput]}
            placeholder="Bloating, digestion, mood changes…"
            placeholderTextColor={Colors.textMuted}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          {/* Save button */}
          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <Ionicons name="save-outline" size={18} color={Colors.white} />
                <Text style={styles.saveBtnText}>Save Today's Log</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Past Logs ───────────────────────────────────────── */}
        {logs.length > 0 && (
          <>
            <Text style={styles.historyTitle}>Recent Entries</Text>
            {logs.slice(0, 10).map((log) => (
              <View key={log.id} style={styles.logEntry}>
                <View style={styles.logHeader}>
                  <Text style={styles.logDate}>{log.date}</Text>
                  <TouchableOpacity onPress={() => deleteLog(log.id)}>
                    <Ionicons name="trash-outline" size={16} color={Colors.error} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.logFoods}>{log.foods.join(', ')}</Text>
                {log.otherFood ? (
                  <Text style={styles.logFoods}>+ {log.otherFood}</Text>
                ) : null}
                <View style={styles.logRatings}>
                  <RatingPill label="Mood" value={log.mood} color={Colors.secondary} />
                  <RatingPill label="Energy" value={log.energy} color={Colors.energy} />
                </View>
                {log.notes ? (
                  <Text style={styles.logNotes}>"{log.notes}"</Text>
                ) : null}
              </View>
            ))}
          </>
        )}

        {logs.length === 0 && (
          <Text style={styles.emptyText}>
            No entries yet — log your first gut health entry above!
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function RatingRow({
  value,
  onChange,
  color,
}: {
  value: number;
  onChange: (v: number) => void;
  color: string;
}) {
  return (
    <View style={styles.ratingRow}>
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <TouchableOpacity
          key={n}
          style={[
            styles.ratingDot,
            n <= value && { backgroundColor: color },
          ]}
          onPress={() => onChange(n)}
        />
      ))}
    </View>
  );
}

function RatingPill({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <View style={[styles.ratingPill, { borderColor: `${color}66` }]}>
      <Text style={[styles.ratingPillText, { color }]}>
        {label}: {value}/10
      </Text>
    </View>
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

  guideCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  guideTitle: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary, marginBottom: 2 },
  guideSub: { color: Colors.textSecondary, fontSize: 12, marginBottom: 14 },
  guideSection: {
    color: Colors.gut,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  tipDetail: { fontSize: 12, color: Colors.textSecondary, marginTop: 2, lineHeight: 17 },
  fuelRow: { marginBottom: 10 },
  fuelTitle: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  fuelDetail: { fontSize: 12, color: Colors.textSecondary, marginTop: 2, lineHeight: 17 },
  mealRow: { marginBottom: 6 },
  mealName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  mealExamples: { fontSize: 12, color: Colors.textSecondary, marginTop: 2, fontStyle: 'italic' },
  biomeRow: { marginBottom: 10 },
  biomeTitle: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  biomeDetail: { fontSize: 12, color: Colors.textSecondary, marginTop: 2, lineHeight: 17 },
  diversityTip: { fontSize: 12, color: Colors.textSecondary, marginBottom: 4, lineHeight: 17 },

  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },

  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 14,
  },

  foodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  foodChip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.bgCardLight,
  },
  foodChipSelected: {
    backgroundColor: `${Colors.gut}33`,
    borderColor: Colors.gut,
  },
  foodChipText: { color: Colors.textSecondary, fontSize: 12 },
  foodChipTextSelected: { color: Colors.gut, fontWeight: '700' },

  textInput: {
    backgroundColor: Colors.bgCardLight,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: Colors.textPrimary,
    fontSize: 14,
    marginTop: 6,
  },
  notesInput: { minHeight: 80 },

  ratingRow: { flexDirection: 'row', gap: 8 },
  ratingDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.border,
    flex: 1,
  },

  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: Colors.white, fontWeight: '700', fontSize: 15 },

  historyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  logEntry: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  logDate: { color: Colors.primary, fontSize: 13, fontWeight: '700' },
  logFoods: { color: Colors.textPrimary, fontSize: 13, marginBottom: 2 },
  logRatings: { flexDirection: 'row', gap: 8, marginTop: 8 },
  ratingPill: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  ratingPillText: { fontSize: 12, fontWeight: '600' },
  logNotes: {
    color: Colors.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 6,
  },

  emptyText: {
    color: Colors.textMuted,
    textAlign: 'center',
    fontSize: 13,
    marginTop: 12,
  },
});
