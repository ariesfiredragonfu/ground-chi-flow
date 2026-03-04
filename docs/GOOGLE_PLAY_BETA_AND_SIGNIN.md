# Google Play beta & sign-in — when to prioritize

**Current:** Use **Skip for now** on the login screen for testing and personal use. User sign-in is on the back burner.

**When you’re ready to sell / go to Google Play:**

## Do you need sign-in before going live?

- **Google Play’s requirement** (for new personal developer accounts): You need **closed testing** with **12 testers for 14 consecutive days** before production. Testers are **invited by email** in Play Console; they install the app from the Play Store. Google does **not** require your app to have its own login to track those testers — they track “opted-in testers” in the Play Console.
- **Your app’s sign-in** is for **your** product: e.g. to sync data (Firestore), to gate paid features, or to know who’s using the app. So:
  - **Beta testers:** Can use “Skip for now” if you want; you don’t need in-app accounts to satisfy Play’s 12-testers rule.
  - **Before selling / subscriptions:** You’ll want sign-in (and probably backend checks) so only paying users get full access. That’s when to prioritize “set up user sign-in” and tie it to Stripe or your payment system.

**To-do (back burner):** Set up user sign-in properly before going live with paid subscriptions. Until then, Skip for now is fine for you and testers.

---

*Ref: Play Console “App testing requirements for new personal developer accounts” — 12 testers, 14 days, no requirement that the app itself has login.*
