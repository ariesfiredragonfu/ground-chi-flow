/**
 * MetricCard — compact card for a single health metric.
 *
 * Shows an icon, metric name, value, and optional trend arrow.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

type TrendDirection = 'up' | 'down' | 'neutral';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  label: string;
  value: string;
  unit?: string;
  trend?: TrendDirection;
  trendLabel?: string;
}

export default function MetricCard({
  icon,
  iconColor = Colors.primary,
  label,
  value,
  unit,
  trend,
  trendLabel,
}: Props) {
  const trendColor =
    trend === 'up' ? Colors.success : trend === 'down' ? Colors.error : Colors.textMuted;
  const trendIcon =
    trend === 'up' ? 'arrow-up' : trend === 'down' ? 'arrow-down' : 'remove';

  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: `${iconColor}22` }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {unit ? <Text style={styles.unit}> {unit}</Text> : null}
      </View>
      {trend ? (
        <View style={styles.trendRow}>
          <Ionicons name={trendIcon} size={12} color={trendColor} />
          {trendLabel ? (
            <Text style={[styles.trendLabel, { color: trendColor }]}>{trendLabel}</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    flex: 1,
    minWidth: 140,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  valueRow: { flexDirection: 'row', alignItems: 'baseline' },
  value: { color: Colors.textPrimary, fontSize: 24, fontWeight: '800' },
  unit: { color: Colors.textSecondary, fontSize: 13, fontWeight: '500' },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 3,
  },
  trendLabel: { fontSize: 12 },
});
