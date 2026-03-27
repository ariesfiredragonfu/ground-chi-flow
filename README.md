# GroundChiFlow 🌿

**Health & Wellness Tracking — Nervous System · Breathwork · Gut & Cellular Health**

A React Native (Expo) app for tracking HRV, breathwork routines, gut health logs, and biomarkers.

---

## Quick Start

```bash
cd GroundChiFlow
npm start          # Opens Expo Go QR code
npm run android    # Android emulator
npm run ios        # iOS simulator (macOS only)
npm run web        # Web browser
```

### Coach bridge URL by environment

- Local development (`npm start` / `npm run web`): set `EXPO_PUBLIC_GROK_BRIDGE_URL=http://127.0.0.1:5000` in `.env`.
- Production (Google Play + hosted web): use `https://grok.howell-forge.com`.
- EAS build profiles are pinned in `eas.json` so production builds do not ship with localhost.

---

## Firebase Setup (Required for Auth)

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a project.
2. Enable **Authentication → Email/Password**.
3. (Optional) Enable **Firestore Database** for cloud persistence.
4. In **Project Settings → Your apps → Web app**, copy the `firebaseConfig`.
5. Paste your config into `lib/firebase.ts` (replace the placeholder values).

---

## Folder Structure

```
GroundChiFlow/
├── app/
│   ├── _layout.tsx          # Root layout — auth routing logic
│   ├── (auth)/
│   │   ├── _layout.tsx      # Auth stack layout
│   │   └── login.tsx        # Login + Signup screen
│   └── (tabs)/
│       ├── _layout.tsx      # Tab bar config
│       ├── index.tsx        # Dashboard (mock metrics, HRV, coherence)
│       ├── routines.tsx     # 7-Day Breathwork Basics + timer
│       ├── gut-health.tsx   # Daily gut health log (AsyncStorage)
│       └── blood-work.tsx   # Biomarker tracker + manual entry
├── components/
│   ├── MetricCard.tsx       # Numeric metric card with icon + trend
│   └── ProgressCircle.tsx   # SVG ring chart (react-native-svg)
├── constants/
│   └── Colors.ts            # Brand palette (greens + blues)
├── context/
│   └── AuthContext.tsx      # Firebase Auth state + hooks
├── lib/
│   └── firebase.ts          # Firebase app init
└── README.md
```

---

## Key Dependencies

| Package | Purpose |
|---|---|
| `expo-router` | File-based navigation (tabs + stack) |
| `firebase` | Auth + Firestore (cloud persistence) |
| `@react-native-async-storage/async-storage` | Local data persistence |
| `react-native-svg` | SVG progress circles on dashboard |
| `@expo/vector-icons` | Ionicons throughout the app |
| `react-native-safe-area-context` | Safe area padding |

---

## Upgrade Path

### 1. Live HRV Data
Connect to Apple Health (`expo-health`) or Oura Ring / Garmin API.
Replace mock values in `app/(tabs)/index.tsx`.

### 2. Firebase Firestore Sync
In `routines.tsx` and `gut-health.tsx`, replace `AsyncStorage` calls with:
```ts
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
// Key docs by user.uid for per-user data
```

### 3. Charts & Trends
Add `victory-native` or use `react-native-svg` for sparklines on the dashboard.

### 4. Function Health Import
Add CSV/JSON file picker (`expo-document-picker`) to parse and import blood panel results.

### 5. Push Notifications
Use `expo-notifications` for daily breathwork reminders.
