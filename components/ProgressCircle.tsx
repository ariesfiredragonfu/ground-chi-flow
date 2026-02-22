/**
 * ProgressCircle — SVG ring showing a percentage value.
 *
 * Props:
 *   percentage  0–100
 *   size        diameter in px (default 80)
 *   color       stroke color (default Colors.primary)
 *   label       text shown in the center
 *   sublabel    smaller text below label
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../constants/Colors';

interface Props {
  percentage: number;
  size?: number;
  color?: string;
  label: string;
  sublabel?: string;
}

export default function ProgressCircle({
  percentage,
  size = 80,
  color = Colors.primary,
  label,
  sublabel,
}: Props) {
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(percentage, 0), 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={styles.wrapper}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc — rotated so it starts at the top */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {/* Centered text overlay */}
      <View style={[styles.centerText, { width: size, height: size }]}>
        <Text style={[styles.label, { color }]}>{label}</Text>
        {sublabel ? (
          <Text style={styles.sublabel}>{sublabel}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center' },
  svg: {},
  centerText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
  },
  sublabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },
});
