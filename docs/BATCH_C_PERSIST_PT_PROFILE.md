# Batch C — Persist PT program on user profile

**Last updated:** 2026-03-21

## What shipped

1. **Handoff → user doc**  
   When a signed-in user matches `ptHandoffRequests/{email}`, the app now **writes** `level`, `source: 'pt'`, and full `ptProgram` (including `routineMerge`) to `users/{uid}/exerciseSettings` with `merge: true`.

2. **Existing user doc without `ptProgram`**  
   If `users/{uid}/exerciseSettings` exists (e.g. level was set earlier) but **`ptProgram` is missing**, the loader **pulls** from `ptHandoffRequests/{email}` and **persists** the same snapshot. Batch A/B UI then works without relying on the handoff doc alone.

3. **`updateRoutineMerge(patch)`**  
   On `useExerciseSettings()` for Firestore users: merges `patch` into `ptProgram.routineMerge` and saves. Use from a future Settings / PT UI (not wired on Routines in this batch).

## Behavior notes

- **Source of truth** after first sync: prefer **`users/.../exerciseSettings`**; handoff is bootstrap.
- If the PT **updates** only `ptHandoffRequests` after the user already has `ptProgram`, the app does **not** auto-overwrite (avoids clobbering client `updateRoutineMerge` edits). Revisit with `updatedAt` / version later if needed.

## Verify

```bash
cd GroundChiFlow
npm run verify:pt-handoff
npx tsc --noEmit
```

## Git checkpoint

```bash
git tag -a checkpoint-pt-merge-batch-c -m "GCF Batch C: persist PT program + updateRoutineMerge"
git push origin checkpoint-pt-merge-batch-c
```

## Next

- **Batch D (shipped):** [BATCH_D_ROUTINE_MERGE_UI.md](BATCH_D_ROUTINE_MERGE_UI.md) — Routines screen UI + `updateRoutineMerge`.
- **Batch E (ideas):** Handoff schema (`programSnapshot`, `activePhase`), `validate_handoff_shape`, Firestore rules review.
