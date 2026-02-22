---
description: GroundChiFlow coding standards — TypeScript health interfaces, animations, validation, Firebase sync
alwaysApply: true
---

# GroundChiFlow Special Instructions

## TypeScript — Health Metric Interfaces
Always define health data with explicit TypeScript interfaces. Never use `any`.

```typescript
// ✅ GOOD
interface HRVReading {
  value: number;       // milliseconds
  timestamp: string;   // ISO 8601
  source: 'heartmath' | 'hume' | 'manual' | 'mock';
}

interface GlucoseReading {
  value: number;       // mg/dL
  timestamp: string;
  fasting: boolean;
}

// ❌ BAD
const hrv: any = { value: 65 };
```

## Animations — Use react-native-reanimated
Prefer `react-native-reanimated` for all progress rings and metric transitions. Never use the JS-thread Animated API for health metric visuals.

```typescript
// ✅ GOOD — reanimated (UI thread, smooth 60fps)
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';

// ❌ BAD — JS thread, janky on low-end devices
import { Animated } from 'react-native';
```

## Biomarker Validation — All Inputs Must Be Validated
No biomarker value may be saved without range checks. Clamp or reject out-of-range values.

```typescript
// ✅ GOOD
const BIOMARKER_RANGES = {
  glucose:      { min: 40,  max: 600 },   // mg/dL
  hrv:          { min: 1,   max: 250 },   // ms
  homocysteine: { min: 0,   max: 50  },   // µmol/L
  vitaminD:     { min: 0,   max: 150 },   // ng/mL
};

function validateBiomarker(key: keyof typeof BIOMARKER_RANGES, value: number): boolean {
  const { min, max } = BIOMARKER_RANGES[key];
  return value >= min && value <= max;
}
```

## Firebase Sync — Always Use useHealthData Hook
Keep ALL Firestore read/write logic inside `hooks/useHealthData.ts`. No component may call Firestore directly.

```typescript
// ✅ GOOD — component stays clean
const { hrv, saveHRV, loading } = useHealthData();

// ❌ BAD — Firestore leaking into components
import { doc, setDoc } from 'firebase/firestore';
// called directly inside a screen component
```

`useHealthData.ts` must:
- Use `useEffect` with a cleanup function to unsubscribe Firestore listeners
- Guard against state updates after unmount
- Return `{ data, loading, error }` shape consistently
