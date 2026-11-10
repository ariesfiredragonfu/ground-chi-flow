# GroundChiFlow — Release readiness (paid / closed testing)

**Purpose:** Ordered blockers between the current repo and revenue (subscription, closed Play test, or paid beta). Effort tags: **quick** (hours), **medium** (days), **large** (weeks+).

**Last verified in CI/agent:** `npm ci`, `npm run verify` (PT handoff self-tests + `tsc --noEmit`).

---

## P0 — Revenue / store gates (fix first)

| # | Blocker | Why it blocks money | Effort |
|---|---------|---------------------|--------|
| 1 | **No hosted privacy policy URL** | Google Play, Apple, and Stripe require a public privacy policy before listing or card charges. | **quick** — publish page on howell-forge.com (or repo `docs`) and add URL to Play Console + in-app link. |
| 2 | **No terms of use / EULA** | Needed for paid access, refunds, and liability limits alongside the wellness disclaimer. | **quick** — same site section as privacy; link from sign-up. |
| 3 | **Subscription / paywall not wired** | `docs/GO_LIVE.md` describes Stripe + entitlement check, but the app has no subscription gate. | **large** — backend webhooks, Firestore fields, app paywall (website-only Stripe is **medium** if app only verifies status). |
| 4 | **“Skip for now” guest mode on login** | Fine for personal beta; weak for paid product (no account, no entitlement). `docs/GO_LIVE.md` still lists removal as done — it is **not** removed. | **medium** — hide behind internal build flag or remove for production; keep for closed test if documented. |
| 5 | **Google Play closed-test / production checklist** | New personal Play accounts need ≥12 testers × ≥14 days; Data safety, content rating, demo account, target API 34+. | **medium** — Console work + one production AAB. |

---

## P1 — Build & deploy reliability

| # | Blocker | Notes | Effort |
|---|---------|-------|--------|
| 6 | **EAS production secrets & Firebase env** | `lib/firebase.ts` reads `EXPO_PUBLIC_FIREBASE_*`; builds must inject via EAS env / GitHub Actions (see `.env.example`). Missing vars → auth-only guest path. | **medium** |
| 7 | **`eas.json` submit `serviceAccountKeyPath`** | Points at a developer-local absolute path; breaks automated submit on other machines/CI. | **quick** — use EAS secret or env-relative path in docs only until rotated. |
| 8 | **No automated CI running `npm run verify`** | Regressions in PT merge / handoff schema are only caught manually. | **quick** — add GitHub Actions workflow (no spend). |
| 9 | **Store listing assets** | Only base `assets/icon.png` / splash exist — no phone screenshots, feature graphic, or localized descriptions. | **medium** |
| 10 | **Web static export / hosting** | `app.json` sets `web.output: static` and `homepage` in `package.json`; production Firebase + base path must match hosting (GitHub Pages / custom domain). | **medium** |

---

## P2 — Product / trust / crash risk

| # | Blocker | Notes | Effort |
|---|---------|-------|--------|
| 11 | **Medical / health-claim wording** | Dashboard HRV copy and some resource bullets implied clinical outcomes. **Mitigation in this branch:** `MEDICAL_DISCLAIMER` on login + Resources; softer HRV insights. Still audit `blood-work.tsx`, `MentalHealthDetox.ts`, Coach text. | **medium** (audit) / **quick** (critical strings) |
| 12 | **Mock vs live health data** | Dashboard still shows mock defaults when vitals are empty; wearables not integrated (`docs/WEARABLE_INTEGRATION.md`). | **large** for full wearable story; **medium** to label “sample data” clearly. |
| 13 | **Firestore security rules for PT handoff** | Documented in `docs/FIRESTORE_SECURITY_PT_HANDOFF.md` — must be deployed and tested before multi-user paid launch. | **medium** |
| 14 | **Coach voice / TTS credits** | Agent tab uses Grok bridge + TTS; credits not topped up — **do not enable billing** until product gate is ready. (Intentionally untouched in release PRs.) | **large** when re-enabled |
| 15 | **Error boundary only at root** | `app/_layout.tsx` catches render errors; native crashes from native modules still need Sentry/Crashlytics for paid scale. | **medium** |

---

## P3 — Nice-to-have before marketing hard

| # | Item | Effort |
|---|------|--------|
| 16 | App Store (iOS) — $99/yr + StoreKit if selling in-app | **large** |
| 17 | Push reminders (`expo-notifications`) | **medium** |
| 18 | npm audit backlog (transitive deps via Expo/EAS) | **medium** — triage; avoid `audit fix --force` without QA |
| 19 | Content rating for supplement / detox copy on Resources | **quick** review |

---

## What already helps release

- Rehab / injury **DISCLAIMER** + attributions on Resources tab.
- **Fail-open Firebase** — app runs with local `AsyncStorage` when env missing (dev-friendly; not a substitute for production auth).
- **EAS profiles** pin Grok bridge URL (no localhost in production).
- **PT handoff self-tests:** `npm run verify:pt-handoff`.
- **Typecheck:** `npm run typecheck` (fixed web modal `position: fixed` typing in `LogVitalsModal.tsx`).

---

## Suggested order to first dollar (website-led)

1. Publish **privacy + terms** URLs (P0 #1–2).  
2. Stripe Checkout on website + manual entitlement or simple API check (P0 #3, website path).  
3. Production Firebase + signed release AAB + closed test (P0 #5, P1 #6).  
4. Store assets + Data safety (P1 #9).  
5. Gate or remove guest skip for paying users (P0 #4).  

---

## Commands (local / agent)

```bash
npm ci
npm run verify          # self-tests + TypeScript
npm run verify:pt-handoff  # PT scripts only
npm run typecheck
```

Do **not** run `eas build` or store submit from a cloud agent unless credentials are explicitly provisioned — that can incur cost.
