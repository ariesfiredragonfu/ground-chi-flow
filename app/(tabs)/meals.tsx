/**
 * Meals & Shopping — 7-Day Anti-Aging Meal Plan.
 *
 * From Age reversal meals. Day 4 = 16:8 fasting.
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import {
  AGE_REVERSAL_MEAL_PLAN,
  AGE_REVERSAL_SHOPPING,
} from '../../constants/MealsShopping';

function MealRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <View style={styles.mealRow}>
      <Text style={styles.mealLabel}>{label}</Text>
      <Text style={styles.mealValue}>{value}</Text>
    </View>
  );
}

export default function MealsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>7-Day Anti-Aging Meal Plan</Text>
        <Text style={styles.screenSub}>
          Elderberries, chia, turmeric, sauerkraut, green bananas, lentils. Day 4 = 16:8 fasting.
        </Text>

        {/* ── 7-Day meal plan ───────────────────────────────────── */}
        {AGE_REVERSAL_MEAL_PLAN.map((day) => (
          <View key={day.day} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <Ionicons name="calendar-outline" size={18} color={Colors.gut} />
              <Text style={styles.dayTitle}>{day.label}</Text>
            </View>
            {day.day === 4 ? (
              <>
                <MealRow label="Morning" value={day.morning ?? null} />
                <MealRow label="Break fast (4 PM)" value={day.breakFast ?? null} />
                <MealRow label="Dinner" value={day.dinnerAlt ?? null} />
                <MealRow label="Snack" value={day.snackAlt ?? null} />
              </>
            ) : (
              <>
                <MealRow label="Breakfast" value={day.breakfast ?? null} />
                <MealRow label="Lunch" value={day.lunch ?? null} />
                <MealRow label="Dinner" value={day.dinner ?? null} />
                <MealRow label="Snack" value={day.snack ?? null} />
              </>
            )}
          </View>
        ))}

        {/* ── Shopping list ─────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Shopping list</Text>
        {AGE_REVERSAL_SHOPPING.map((s) => (
          <View key={s.category} style={styles.shopCard}>
            <Text style={styles.shopCategory}>{s.category}</Text>
            {s.items.map((item, i) => (
              <Text key={i} style={styles.shopItem}>• {item}</Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { padding: 20, paddingBottom: 40 },

  screenTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  screenSub: { color: Colors.textSecondary, fontSize: 13, marginBottom: 20 },

  dayCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  dayTitle: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  mealRow: { marginBottom: 8 },
  mealLabel: { fontSize: 12, fontWeight: '600', color: Colors.gut, marginBottom: 2 },
  mealValue: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },

  sectionTitle: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 16,
  },
  shopCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  shopCategory: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  shopItem: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4, lineHeight: 20 },
});
