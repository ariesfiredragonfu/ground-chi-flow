/**
 * Blood Work & Biomarkers screen
 *
 * Current state: Placeholder with mock data entries.
 *
 * Planned features (comments show integration points):
 *  - Import Function Health panel results (CSV/JSON upload)
 *  - Import methylation panel: homocysteine, B12, folate, MTHFR
 *  - Connect to Apple Health / Google Fit for HRV from wearables
 *  - Trend charts over time using Victory Native or react-native-svg
 *
 * Manual entry form included for:
 *  - HRV (from wearable)
 *  - Homocysteine (µmol/L)
 *  - Vitamin B12 (pg/mL)
 *  - Folate (ng/mL)
 *  - Vitamin D (ng/mL)
 *  - Omega-3 Index (%)
 *  - Fasting Glucose (mg/dL)
 *
 * Entries saved to AsyncStorage. Upgrade to Firebase Firestore for cloud sync.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';
import { parseLabText, type ParsedLabResult } from '../../lib/parseLabText';
import { isBridgeConfigured } from '../../lib/grokBridge';

const STORAGE_KEY = 'blood_work_entries';

// ── Biomarker definitions with optimal ranges ────────────────────────────────
const BIOMARKERS = [
  {
    key: 'hrv',
    label: 'HRV',
    unit: 'ms',
    icon: 'heart-outline' as const,
    color: Colors.hrv,
    source: 'Wearable (Oura, Apple Watch, Garmin)',
    optimalRange: '> 50 ms',
    description: 'Heart Rate Variability — key marker of nervous system resilience.',
  },
  {
    key: 'homocysteine',
    label: 'Homocysteine',
    unit: 'µmol/L',
    icon: 'flask-outline' as const,
    color: Colors.secondary,
    source: 'Function Health / Lab panel',
    optimalRange: '< 8 µmol/L',
    description: 'Elevated levels linked to methylation issues & cardiovascular risk.',
  },
  {
    key: 'b12',
    label: 'Vitamin B12',
    unit: 'pg/mL',
    icon: 'leaf-outline' as const,
    color: Colors.primary,
    source: 'Function Health / Lab panel',
    optimalRange: '400–1000 pg/mL',
    description: 'Essential for nerve function, DNA synthesis, and methylation.',
  },
  {
    key: 'folate',
    label: 'Folate (B9)',
    unit: 'ng/mL',
    icon: 'leaf-outline' as const,
    color: Colors.gut,
    source: 'Function Health / Lab panel',
    optimalRange: '> 10 ng/mL',
    description: 'Works with B12 in the methylation cycle.',
  },
  {
    key: 'vitaminD',
    label: 'Vitamin D3',
    unit: 'ng/mL',
    icon: 'sunny-outline' as const,
    color: Colors.energy,
    source: 'Function Health / Lab panel',
    optimalRange: '50–80 ng/mL',
    description: 'Immune function, mood regulation, calcium absorption.',
  },
  {
    key: 'omega3',
    label: 'Omega-3 Index',
    unit: '%',
    icon: 'fish-outline' as const,
    color: Colors.secondary,
    source: 'OmegaQuant / Lab panel',
    optimalRange: '> 8%',
    description: 'EPA + DHA % of red blood cell membranes. Anti-inflammatory.',
  },
  {
    key: 'glucose',
    label: 'Fasting Glucose',
    unit: 'mg/dL',
    icon: 'analytics-outline' as const,
    color: Colors.warning,
    source: 'CGM / Lab panel',
    optimalRange: '70–90 mg/dL',
    description: 'Metabolic health baseline. Optimal is sub-90 fasting.',
  },
];

interface BiomarkerEntry {
  key: string;
  value: string;
  date: string;
  notes: string;
  savedAt: string;
}

// Mock data to show the UI in action
const MOCK_ENTRIES: BiomarkerEntry[] = [
  { key: 'hrv', value: '65', date: '2026-02-20', notes: 'Post meditation, morning', savedAt: '' },
  { key: 'homocysteine', value: '9.2', date: '2026-02-15', notes: 'Function Health panel', savedAt: '' },
  { key: 'b12', value: '620', date: '2026-02-15', notes: '', savedAt: '' },
  { key: 'vitaminD', value: '48', date: '2026-02-15', notes: 'Slightly below optimal', savedAt: '' },
  { key: 'omega3', value: '6.4', date: '2026-02-15', notes: 'Need more EPA/DHA', savedAt: '' },
];

export default function BloodWorkScreen() {
  const [entries, setEntries] = useState<BiomarkerEntry[]>(MOCK_ENTRIES);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Form state
  const [selectedMarker, setSelectedMarker] = useState(BIOMARKERS[0].key);
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [entryNotes, setEntryNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Paste lab results modal
  const [pasteModalVisible, setPasteModalVisible] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const bridgeConfigured = isBridgeConfigured();

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved: BiomarkerEntry[] = JSON.parse(raw);
          // Merge mock + saved (dedupe by savedAt)
          setEntries([...saved, ...MOCK_ENTRIES]);
        }
      } catch {
        // Keep mock data
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveEntry = async () => {
    if (!value.trim()) {
      Alert.alert('Missing Value', 'Please enter a value for this biomarker.');
      return;
    }
    setSaving(true);
    try {
      const entry: BiomarkerEntry = {
        key: selectedMarker,
        value: value.trim(),
        date,
        notes: entryNotes,
        savedAt: new Date().toISOString(),
      };
      const updated = [entry, ...entries];
      setEntries(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated.filter((e) => e.savedAt)));
      setValue('');
      setEntryNotes('');
      setModalVisible(false);
      Alert.alert('Saved! 🔬', 'Biomarker entry added.');
    } catch {
      Alert.alert('Error', 'Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const importPastedLab = async () => {
    const text = pastedText.trim();
    if (!text || importing) return;
    if (!bridgeConfigured) {
      setImportError('Import uses the Health Coach. Set EXPO_PUBLIC_GROK_BRIDGE_URL in .env.');
      return;
    }
    setImportError(null);
    setImporting(true);
    try {
      const parsed: ParsedLabResult[] = await parseLabText(text);
      if (parsed.length === 0) {
        setImportError('No biomarker values found. Try: "glucose 92, vitamin D 45, B12 520"');
        return;
      }
      const date = parsed[0].date ?? new Date().toISOString().slice(0, 10);
      const newEntries: BiomarkerEntry[] = parsed.map((p) => ({
        key: p.key,
        value: String(p.value),
        date,
        notes: 'Imported from pasted text',
        savedAt: new Date().toISOString(),
      }));
      const updated = [...newEntries, ...entries];
      setEntries(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated.filter((e) => e.savedAt)));
      setPastedText('');
      setPasteModalVisible(false);
      Alert.alert('Imported 🔬', `${parsed.length} biomarker(s) added from your pasted text.`);
    } catch (e: unknown) {
      setImportError(e instanceof Error ? e.message : 'Import failed. Try again.');
    } finally {
      setImporting(false);
    }
  };

  // Get the most recent entry for a given biomarker key
  const latestEntry = (key: string) =>
    entries.filter((e) => e.key === key).sort((a, b) => b.date.localeCompare(a.date))[0];

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
        {/* ── Header ─────────────────────────────────────────── */}
        <Text style={styles.screenTitle}>Blood Work & Biomarkers</Text>
        <Text style={styles.screenSub}>
          Track key health markers from Function Health, lab panels, and wearables.
        </Text>

        {/* ── Coming Soon Banner ─────────────────────────────── */}
        <View style={styles.comingSoonBanner}>
          <Ionicons name="construct-outline" size={20} color={Colors.warning} />
          <View style={{ flex: 1 }}>
            <Text style={styles.comingSoonTitle}>Coming Soon: Auto-Import</Text>
            <Text style={styles.comingSoonBody}>
              Import Function Health or methylation panel results (homocysteine,
              B-vitamins, MTHFR). Connect Apple Health / Google Fit for wearable HRV.
            </Text>
          </View>
        </View>

        {/* ── Add Manual Entry + Paste lab results ────────────────────────── */}
        <View style={styles.addRow}>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle-outline" size={20} color={Colors.white} />
            <Text style={styles.addBtnText}>Add Manual Entry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pasteBtn}
            onPress={() => {
              setPasteModalVisible(true);
              setImportError(null);
            }}
          >
            <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
            <Text style={styles.pasteBtnText}>Paste lab results</Text>
          </TouchableOpacity>
        </View>

        {/* ── Biomarker Cards ────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Biomarker Overview</Text>
        {BIOMARKERS.map((marker) => {
          const latest = latestEntry(marker.key);
          return (
            <View key={marker.key} style={styles.markerCard}>
              <View style={styles.markerHeader}>
                <View style={[styles.markerIcon, { backgroundColor: `${marker.color}22` }]}>
                  <Ionicons name={marker.icon} size={20} color={marker.color} />
                </View>
                <View style={styles.markerTitles}>
                  <Text style={styles.markerLabel}>{marker.label}</Text>
                  <Text style={styles.markerSource}>{marker.source}</Text>
                </View>
                {latest ? (
                  <View style={styles.markerValue}>
                    <Text style={[styles.markerValueText, { color: marker.color }]}>
                      {latest.value}
                    </Text>
                    <Text style={styles.markerUnit}>{marker.unit}</Text>
                  </View>
                ) : (
                  <Text style={styles.noData}>No data</Text>
                )}
              </View>
              <Text style={styles.markerDesc}>{marker.description}</Text>
              <View style={styles.optimalRow}>
                <Ionicons name="checkmark-circle-outline" size={13} color={Colors.primary} />
                <Text style={styles.optimalText}>Optimal: {marker.optimalRange}</Text>
                {latest && (
                  <Text style={styles.lastDate}>  ·  {latest.date}</Text>
                )}
              </View>
            </View>
          );
        })}

        {/* ── Methylation info ────────────────────────────────── */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🧬 About Methylation Panels</Text>
          <Text style={styles.infoBody}>
            Methylation is a core cellular process affecting gene expression, detoxification,
            and neurotransmitter production. Key markers include:{'\n\n'}
            • <Text style={{ color: Colors.primary }}>Homocysteine</Text> — elevated = poor methylation{'\n'}
            • <Text style={{ color: Colors.primary }}>B12 / Folate</Text> — methyl-donor vitamins{'\n'}
            • <Text style={{ color: Colors.primary }}>MTHFR gene</Text> — C677T variant affects folate conversion{'\n'}
            • <Text style={{ color: Colors.primary }}>SAM/SAH ratio</Text> — direct methylation capacity marker{'\n\n'}
            Recommended lab: <Text style={{ color: Colors.secondary }}>functionhealth.com</Text>
          </Text>
        </View>
      </ScrollView>

      {/* ── Manual Entry Modal ─────────────────────────────────── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Biomarker Entry</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-outline" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Marker picker */}
            <Text style={styles.modalLabel}>Biomarker</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.markerPicker}>
              {BIOMARKERS.map((m) => (
                <TouchableOpacity
                  key={m.key}
                  style={[
                    styles.markerPickerChip,
                    selectedMarker === m.key && { backgroundColor: `${m.color}33`, borderColor: m.color },
                  ]}
                  onPress={() => setSelectedMarker(m.key)}
                >
                  <Text
                    style={[
                      styles.markerPickerText,
                      selectedMarker === m.key && { color: m.color, fontWeight: '700' },
                    ]}
                  >
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Value */}
            <Text style={styles.modalLabel}>
              Value ({BIOMARKERS.find((m) => m.key === selectedMarker)?.unit})
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 65"
              placeholderTextColor={Colors.textMuted}
              value={value}
              onChangeText={setValue}
              keyboardType="decimal-pad"
            />

            {/* Date */}
            <Text style={styles.modalLabel}>Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="2026-02-22"
              placeholderTextColor={Colors.textMuted}
              value={date}
              onChangeText={setDate}
            />

            {/* Notes */}
            <Text style={styles.modalLabel}>Notes (optional)</Text>
            <TextInput
              style={[styles.modalInput, { height: 60 }]}
              placeholder="Source, conditions…"
              placeholderTextColor={Colors.textMuted}
              value={entryNotes}
              onChangeText={setEntryNotes}
              multiline
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.saveBtn, saving && { opacity: 0.6 }]}
              onPress={saveEntry}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.saveBtnText}>Save Entry</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Paste lab results modal ─────────────────────────────────────── */}
      <Modal
        visible={pasteModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setPasteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Paste lab results</Text>
              <TouchableOpacity onPress={() => setPasteModalVisible(false)}>
                <Ionicons name="close-outline" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.pasteHint}>
              Paste or type your lab results (e.g. from an email or report). The Coach will extract values and fill the fields.
            </Text>
            <Text style={styles.modalLabel}>Lab text</Text>
            <TextInput
              style={[styles.modalInput, styles.pasteInput]}
              placeholder="e.g. Glucose 92, Vitamin D 45 ng/mL, B12 520, Homocysteine 7.2"
              placeholderTextColor={Colors.textMuted}
              value={pastedText}
              onChangeText={(t) => { setPastedText(t); setImportError(null); }}
              multiline
              textAlignVertical="top"
            />
            {importError ? (
              <View style={styles.importErrorBox}>
                <Ionicons name="alert-circle-outline" size={16} color={Colors.error} />
                <Text style={styles.importErrorText}>{importError}</Text>
              </View>
            ) : null}
            <TouchableOpacity
              style={[styles.saveBtn, importing && { opacity: 0.6 }]}
              onPress={importPastedLab}
              disabled={!pastedText.trim() || importing}
            >
              {importing ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.saveBtnText}>Import into Blood Work</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: 20, paddingBottom: 40 },

  screenTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  screenSub: { color: Colors.textSecondary, fontSize: 13, marginBottom: 16 },

  comingSoonBanner: {
    flexDirection: 'row',
    backgroundColor: `${Colors.warning}18`,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: `${Colors.warning}44`,
    alignItems: 'flex-start',
  },
  comingSoonTitle: { color: Colors.warning, fontWeight: '700', fontSize: 14, marginBottom: 4 },
  comingSoonBody: { color: Colors.textSecondary, fontSize: 12, lineHeight: 18 },

  addBtn: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addBtnText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  addRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  pasteBtn: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  pasteBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 14 },

  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 14,
  },

  markerCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  markerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
  markerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerTitles: { flex: 1 },
  markerLabel: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700' },
  markerSource: { color: Colors.textMuted, fontSize: 11, marginTop: 1 },
  markerValue: { alignItems: 'flex-end' },
  markerValueText: { fontSize: 22, fontWeight: '800' },
  markerUnit: { color: Colors.textMuted, fontSize: 11 },
  noData: { color: Colors.textMuted, fontSize: 13, fontStyle: 'italic' },

  markerDesc: { color: Colors.textSecondary, fontSize: 12, lineHeight: 17, marginBottom: 8 },
  optimalRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  optimalText: { color: Colors.primary, fontSize: 12 },
  lastDate: { color: Colors.textMuted, fontSize: 12 },

  infoCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 8,
  },
  infoTitle: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700', marginBottom: 10 },
  infoBody: { color: Colors.textSecondary, fontSize: 13, lineHeight: 20 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.bgCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { color: Colors.textPrimary, fontSize: 18, fontWeight: '800' },
  modalLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 14,
  },
  modalInput: {
    backgroundColor: Colors.bgCardLight,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  markerPicker: { marginBottom: 4 },
  markerPickerChip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: Colors.bgCardLight,
  },
  markerPickerText: { color: Colors.textSecondary, fontSize: 13 },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  saveBtnText: { color: Colors.white, fontWeight: '700', fontSize: 15 },

  pasteHint: { color: Colors.textSecondary, fontSize: 13, marginBottom: 12, lineHeight: 18 },
  pasteInput: { height: 120, paddingTop: 12 },
  importErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3D1515',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    gap: 6,
  },
  importErrorText: { color: Colors.error, fontSize: 13, flex: 1 },
});
