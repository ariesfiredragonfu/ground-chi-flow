# GroundChiFlow — access (no secrets here)

## GCF admin (subscription bypass)

- **Email:** `admin@groundchiflow.com` (see `ADMIN_EMAIL` in `context/AuthContext.tsx`).
- **Password:** not stored in this repo. Keep it only in your **password manager**.
- **Change / rotate password:** [Firebase Console](https://console.firebase.google.com/) → your project → **Authentication** → **Users** → select `admin@groundchiflow.com` → **Reset password** (email link) or remove user and sign up again with a new password in the app.

## Firebase / Firestore

- **Console:** `https://console.firebase.google.com/project/<projectId>`
- **Firestore handoff collection:** `ptHandoffRequests` — document ID = client **email** (lowercase).

## Related (Fortress / tunnel / media)

See **Hardware_Factory** repo: `docs/ARCHITECTURE_AND_STARTUP.md` and your Desktop **admin-howell-forge** folder (access URLs only).
