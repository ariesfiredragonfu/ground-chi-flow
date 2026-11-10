# GroundChiFlow 🌿

**Wellness tracking — nervous system · breathwork · gut · routines**

React Native (Expo) app for logging HRV and vitals, daily breathwork/routine checklists, gut logs, and biomarker notes. Coach/voice features call an external Grok bridge (optional).

---

## Quick start

```bash
cd GroundChiFlow   # or clone root if this repo is the app root
cp .env.example .env   # add EXPO_PUBLIC_FIREBASE_* and optionally EXPO_PUBLIC_GROK_BRIDGE_URL
npm ci
npm start            # Expo dev server (QR / web)
npm run android
npm run ios          # macOS only
npm run web          # or ./run-web.sh
```

### Coach bridge URL

| Environment | `EXPO_PUBLIC_GROK_BRIDGE_URL` |
|-------------|-------------------------------|
| Local dev | `http://127.0.0.1:5000` |
| EAS preview/production | `https://bridge.howell-forge.com` (see `eas.json`) |

Voice/TTS on the Agent tab uses this bridge — leave unset or local if you are not running the bridge.

---

## Verify (no device required)

```bash
npm run verify              # PT handoff self-tests + TypeScript
npm run verify:pt-handoff   # lib/ PT merge & rehab scripts only
npm run typecheck
```

---

## Firebase (auth + optional cloud sync)

1. [Firebase Console](https://console.firebase.google.com) — create project, enable **Email/Password** auth.
2. (Optional) **Firestore** for cloud persistence.
3. Copy web app config into `.env` as `EXPO_PUBLIC_FIREBASE_*` (see `.env.example`).

Without Firebase env vars, the app still runs: **Skip for now** uses local storage only (`context/AuthContext.tsx`, `hooks/useHealthData.ts`).

For production domains (e.g. GitHub Pages), add the host under Firebase **Authentication → Authorized domains**.

---

## Project layout

```
app/
  _layout.tsx           # Auth routing + error boundary
  (auth)/login.tsx      # Sign-in + medical disclaimer
  (tabs)/               # Dashboard, Routines, Gut, Meals, Blood work, Agent, Resources
components/             # MetricCard, ProgressCircle, LogVitalsModal, …
constants/              # Routines content, DisclaimerResources, Colors
hooks/useHealthData.ts  # Vitals & health data (Firestore + AsyncStorage)
lib/                    # firebase, grokBridge, PT merge helpers
scripts/                # verify:* self-tests
docs/                   # GO_LIVE, RELEASE-READINESS, wearables, PT batches
```

---

## Release readiness

See **`docs/RELEASE-READINESS.md`** for blockers to paid or Play closed testing (privacy policy, paywall, store assets, health-claim wording).

**Not medical advice:** full text in `constants/DisclaimerResources.ts` (`MEDICAL_DISCLAIMER`), shown on login and Resources.

---

## Key dependencies

| Package | Purpose |
|---------|---------|
| `expo-router` | File-based navigation |
| `firebase` | Auth + Firestore |
| `@react-native-async-storage/async-storage` | Local persistence |
| `react-native-reanimated` | Animations (prefer for metric UI) |
| `react-native-svg` | Progress rings |

---

## Builds (manual — uses EAS credits)

```bash
npx eas-cli login
npm run build:android          # production AAB
npm run build:android:preview  # internal APK
```

Do not run production builds from shared agents unless credentials and billing are intended.
