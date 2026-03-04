/**
 * LogVitalsModal — Manual entry for HRV, Sleep, Energy, Stress
 *
 * Opens from Quick Log (Log HRV, Sleep). Saves to useVitals.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useVitals } from '../hooks/useHealthData';

const todayKey = () => new Date().toISOString().slice(0, 10);

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
    <View>
      <Text style={styles.ratingLabel}>{value}/10</Text>
      <View style={styles.ratingRow}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <TouchableOpacity
            key={n}
            style={[styles.ratingDot, n <= value && { backgroundColor: color }]}
            onPress={() => onChange(n)}
          />
        ))}
      </View>
    </View>
  );
}

export default function LogVitalsModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { vitalsByDate, saveVitals, loadVitalsForDate } = useVitals();
  const date = todayKey();
  const existing = vitalsByDate[date];

  const [hrv, setHrv] = useState('');
  const [sleepHrs, setSleepHrs] = useState('');
  const [sleepQuality, setSleepQuality] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [stress, setStress] = useState(5);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      loadVitalsForDate(date);
    }
  }, [visible, date]);

  useEffect(() => {
    if (existing) {
      if (existing.hrv != null) setHrv(String(existing.hrv));
      if (existing.sleepHrs != null) setSleepHrs(String(existing.sleepHrs));
      if (existing.sleepQuality != null) setSleepQuality(existing.sleepQuality);
      if (existing.energy != null) setEnergy(existing.energy);
      if (existing.stress != null) setStress(existing.stress);
    } else {
      setHrv('');
      setSleepHrs('');
      setSleepQuality(5);
      setEnergy(5);
      setStress(5);
    }
  }, [existing]);

  const handleSave = async () => {
    const data: Partial<Omit<import('../hooks/useHealthData').VitalsEntry, 'date' | 'savedAt'>> = { source: 'manual' };
    const hrvNum = hrv ? parseFloat(hrv) : undefined;
    const sleepNum = sleepHrs ? parseFloat(sleepHrs) : undefined;
    if (hrvNum != null && !isNaN(hrvNum)) data.hrv = hrvNum;
    if (sleepNum != null && !isNaN(sleepNum)) data.sleepHrs = sleepNum;
    data.sleepQuality = sleepQuality;
    data.energy = energy;
    data.stress = stress;

    if (Object.keys(data).length === 0) {
      Alert.alert('No data', 'Enter at least one value to save.');
      return;
    }

    setSaving(true);
    try {
      await saveVitals(date, data);
      Alert.alert('Saved', 'Vitals logged for today.');
      onClose();
    } catch {
      Alert.alert('Error', 'Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const content = (
    <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboard}
        >
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.title}>Log Vitals</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.dateLabel}>Today — {date}</Text>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionLabel}>HRV (ms)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 65"
                placeholderTextColor={Colors.textMuted}
                value={hrv}
                onChangeText={setHrv}
                keyboardType="numeric"
              />

              <Text style={styles.sectionLabel}>Sleep (hours)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 7.5"
                placeholderTextColor={Colors.textMuted}
                value={sleepHrs}
                onChangeText={setSleepHrs}
                keyboardType="decimal-pad"
              />

              <Text style={styles.sectionLabel}>Sleep quality (1–10)</Text>
              <RatingRow value={sleepQuality} onChange={setSleepQuality} color={Colors.secondary} />

              <Text style={styles.sectionLabel}>Energy (1–10)</Text>
              <RatingRow value={energy} onChange={setEnergy} color={Colors.energy} />

              <Text style={styles.sectionLabel}>Stress (1–10)</Text>
              <RatingRow value={stress} onChange={setStress} color={Colors.gut} />
            </ScrollView>

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
                  <Text style={styles.saveBtnText}>Save</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
  );

  // React Native Modal has limited web support — use conditional render with fixed overlay
  if (Platform.OS === 'web') {
    if (!visible) return null;
    return (
      <View style={[styles.overlay, styles.overlayWeb]}>
        {content}
      </View>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      {content}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  overlayWeb: Platform.OS === 'web' ? {
    position: 'fixed' as const,
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 9999,
  } : {},
  keyboard: { maxHeight: '90%' },
  modal: {
    backgroundColor: Colors.bgCard,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  closeBtn: { padding: 4 },
  dateLabel: { fontSize: 13, color: Colors.textSecondary, marginBottom: 16 },
  scroll: { maxHeight: 400 },
  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 14,
  },
  ratingLabel: { color: Colors.textSecondary, fontSize: 12, marginBottom: 6 },
  input: {
    backgroundColor: Colors.bgCardLight,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: Colors.textPrimary,
    fontSize: 16,
  },
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
});
