# GroundChiFlow — Going Live

## 1. Stripe Subscriptions (App + Website)

### Recommended approach

**Website:** Use **Stripe Checkout** or **Payment Links** for subscription sign-up. Users pay on your site, then sign in to the app.

**App:** For digital subscriptions, Apple and Google require in-app purchase for apps distributed through their stores. Two options:

| Option | Best for | How it works |
|--------|----------|--------------|
| **A. Website-only signup** | Simplest | Users subscribe on your website via Stripe Checkout/Payment Link. App checks subscription status (Stripe API or your backend) and gates access. No in-app purchase in the app. |
| **B. Stripe + store billing** | Full compliance | Website: Stripe. App: Use Google Play Billing (Android) and optionally StoreKit (iOS) for in-app subscriptions. More complex; requires store-specific code. |

### Option A (recommended for first launch)

1. **Website:** Add a “Subscribe” page with Stripe Checkout or a Payment Link.
2. **Backend:** Create a small API (e.g. Next.js API routes, Firebase Functions) that:
   - Creates Stripe Checkout Sessions for subscriptions
   - Handles `checkout.session.completed` and `customer.subscription.*` webhooks
   - Stores `customer_id` and `subscription_status` in Firestore (or your DB) keyed by user ID
3. **App:** After Firebase sign-in, call your API to check subscription status. If active, allow access; otherwise show paywall or redirect to website to subscribe.
4. **Customer portal:** Use Stripe’s [Customer Portal](https://docs.stripe.com/customer-management) so users can manage/cancel subscriptions. Link to it from your website (and optionally from the app via `Linking.openURL`).

### Stripe setup steps

1. Create a [Stripe account](https://dashboard.stripe.com/register)
2. Create a Product + recurring Price (e.g. monthly/yearly)
3. Use [Stripe Checkout](https://docs.stripe.com/payments/checkout) or [Payment Links](https://docs.stripe.com/payment-links) for subscription checkout
4. Configure [webhooks](https://docs.stripe.com/webhooks) to your backend
5. Set up [Customer Portal](https://dashboard.stripe.com/settings/billing/portal) for self-service management

### Important: Google Play and digital goods

For **digital goods** (app access, subscriptions) sold **inside** an Android app from the Play Store, Google requires [Google Play Billing](https://developer.android.com/google/play/billing). If you only sell subscriptions on your **website** and the app just checks status, you can avoid Play Billing. If you add “Subscribe” inside the app and charge via Stripe, you may violate Play policy. Best practice: subscription signup on website; app only verifies status.

---

## 2. Google Play Store (Android)

### Requirements (2024–2025)

- **Developer account:** [Play Console](https://play.google.com/console) — $25 one-time
- **Account type:** Personal or Organization (Organization needs D-U-N-S)
- **New personal accounts (after Nov 2023):** Must run a closed test with ≥12 testers for ≥14 days before production
- **Target API:** Android 14 (API 34) or higher (from Aug 31, 2024)
- **Privacy policy:** Required; host on your website
- **Data safety:** Complete the Data safety form in Play Console
- **Demo account:** Provide test credentials for review

### Publishing steps

1. Create [Google Play Developer account](https://play.google.com/console/signup)
2. Create app in Play Console
3. Build release: `eas build --platform android --profile production` (Expo EAS)
4. Upload AAB to Play Console
5. Fill store listing (screenshots, description, etc.)
6. Complete Data safety and content rating
7. Run closed testing (if new account), then submit for review

### Expo EAS

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile production
```

---

## 3. Apple App Store (optional, later)

- **Developer account:** [Apple Developer Program](https://developer.apple.com/programs/) — $99/year
- **Digital subscriptions:** Must use StoreKit or external link to web payment (US/EEA)
- **Review:** Typically 24–48 hours

You can skip Apple for now and focus on web + Android.

---

## 4. Pre-launch checklist

- [ ] Remove “Skip for now” (done)
- [ ] Firebase production config (`.env` with live keys)
- [ ] Stripe product + price created
- [ ] Backend: checkout + webhook + subscription check
- [ ] Website: subscribe page + customer portal link
- [ ] App: subscription gate / paywall
- [ ] Privacy policy URL
- [ ] Terms of service (if required)

---

## 5. Adding app to existing website

1. **Web:** Add a “Get the app” or “Download” section linking to:
   - Google Play (when published)
   - Direct APK (if distributing outside Play)
2. **Deep links:** Configure `https://yourdomain.com/app` to open the app or redirect to the store
3. **Subscription flow:** “Subscribe” on website → Stripe Checkout → account created → user signs in to app with same email
