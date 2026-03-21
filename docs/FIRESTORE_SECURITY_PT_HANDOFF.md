# Firestore rules — PT handoff & exercise settings (template)

**Last updated:** 2026-03-21

**Not applied automatically.** Copy into **Firebase Console → Firestore Database → Rules** and adjust collection paths / auth to match your project.

## Goals

1. **Patients** can read/write their own **`users/{uid}/exerciseSettings`** (including `ptProgram` + `routineMerge` from Batch C–E).
2. **`ptHandoffRequests/{email}`** — typically **written by clinic staff / admin** (or server); patients **read** their own doc when email matches signed-in user.
3. Avoid world-readable PII.

## Example rules (starting point)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function signedIn() {
      return request.auth != null;
    }

    function isOwner(uid) {
      return signedIn() && request.auth.uid == uid;
    }

    // Patient exercise + PT program mirror (Batch C)
    match /users/{userId}/exerciseSettings/{docId} {
      allow read, write: if isOwner(userId);
    }

    // Optional: other user subcollections
    match /users/{userId}/{document=**} {
      allow read, write: if isOwner(userId);
    }

    // PT handoff: doc id = patient email (use lowercase in both Auth and doc id — see useExerciseSettings normalizeEmail)
    match /ptHandoffRequests/{emailDoc} {
      allow read: if signedIn()
        && request.auth.token.email != null
        && emailDoc == request.auth.token.email;

      // Writes: restrict to admins / Cloud Function / service account in production.
      // For prototyping only you might use:
      // allow write: if false;
      // and upload via Console or admin SDK.
      allow write: if false;
    }
  }
}
```

## Hardening (production)

- **PT writes:** use **Admin SDK** or **Cloud Function** with validation; keep `allow write: if false` for clients on `ptHandoffRequests`.
- **Custom claims:** e.g. `request.auth.token.ptClinic == true` for clinician write paths.
- **Email vs doc id:** App uses lowercase for `ptHandoffRequests` lookups; store handoff documents with **lowercase** email as the document ID so `emailDoc == request.auth.token.email` works when Auth email is normalized.

## Related code

- Loader: `hooks/useExerciseSettings.ts`
- Validation: `lib/validatePtHandoffShape.ts`
- Batch docs: `docs/BATCH_C_PERSIST_PT_PROFILE.md`, `BATCH_E_HANDOFF_SCHEMA_AND_RULES.md`
