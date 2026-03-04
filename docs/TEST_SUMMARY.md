# GroundChiFlow — Test Summary

**Date:** Feb 26, 2026  
**Platform tested:** Web (Expo web at localhost:8081)

---

## ✅ Tested & Working

| Flow | Status | Notes |
|------|--------|-------|
| **Login** | ✅ | Skip for now (guest) works |
| **Tab navigation** | ✅ | Dashboard, Routines, Gut Health, Meals, Blood Work, Resources all load |
| **Routines** | ✅ | Day controls, sections (Meditation, Breathwork, Core Balance, GOATA, Tai Chi, Nervous System), Optional Zone 2 |
| **Gut Health** | ✅ | Form with food chips, mood/energy sliders, notes, Save button |
| **Resources** | ✅ | All sections load; ecosystem links, front runners, attributions |
| **Quick Log: Breathwork** | ✅ | Navigates to Routines tab |
| **Quick Log: Gut Log** | ✅ | Navigates to Gut Health tab |

---

## ⚠️ Needs Verification (restart dev server)

The dev server may be serving a cached build. After restarting (`npm run web` or `./run-web.sh`), verify:

| Flow | What to check |
|------|---------------|
| **Log Vitals modal** | Tap "Log HRV" or "Sleep" → modal should open with HRV, Sleep, Energy, Stress fields. A web-specific fix was added (conditional render instead of React Native Modal). |
| **Mark routine complete** | On Routines tab, scroll to bottom → "Mark routine complete" checkbox should appear before Sources link. |
| **Wearable to-do section** | Resources tab → "Wearable integrations (to-do)" section with Muse, Hume, Oura, etc. and priority numbers. |
| **Dashboard vitals** | After saving vitals, dashboard should show your logged values instead of mock data. |

---

## ❌ Cannot Test (without device/setup)

| Item | Reason |
|------|--------|
| **Firebase auth** | Requires real credentials; guest mode used for testing |
| **Firestore sync** | Requires authenticated user; guest uses AsyncStorage |
| **iOS/Android** | Web only; native Modal, push notifications, HealthKit not testable |
| **Wearable import** | Muse, Hume, Oura not yet integrated |
| **Alert dialogs** | `Alert.alert()` may behave differently on web (browser may block) |

---

## Recommended Manual Test (after restart)

1. Restart dev server: `npm run web`
2. Skip login → Dashboard
3. Tap **Log HRV** → modal should open
4. Enter HRV: 70, Sleep: 7.5, Energy: 8, Stress: 3 → Save
5. Dashboard should show 70 ms HRV, 7.5 hrs Sleep
6. Go to Routines → scroll down → tap "Mark routine complete"
7. Go to Gut Health → select Kefir, set Mood 7, Energy 8 → Save
8. Check Resources → "Wearable integrations (to-do)" section

---

## Next: Taking the App Live

When ready, we can work on:

- Deployment (Vercel, Expo EAS, etc.)
- Environment variables for production Firebase
- App store / web hosting setup
- Privacy policy, terms of use
- Analytics (optional)
