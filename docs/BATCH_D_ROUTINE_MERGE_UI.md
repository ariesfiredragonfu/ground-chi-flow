# Batch D — PT routine merge UI (Routines screen)

**Last updated:** 2026-03-21

## What shipped

- **`components/PtRoutineMergePanel.tsx`** — Collapsible **Routine visibility (PT)** on **Routines** when `source === 'pt'` and `ptProgram` exists.
- **Conflict tags:** Neck, Knee, Lower-body load — same semantics as Batch B (`mergeRoutineWithPt` / ReForge).
- **Per-section hides:** All stable section ids from `ROUTINE_SECTION_IDS` (including `mudras_and_feet` alias).
- **Persistence:** Each toggle calls `updateRoutineMerge` → `users/{uid}/exerciseSettings` (Batch C).

## Verify

```bash
cd GroundChiFlow
npm run verify:pt-handoff
npx tsc --noEmit
```

Manual: sign in as a PT handoff user → Routines → expand **Routine visibility (PT)** → toggle items → reload app / second device and confirm hides stick.

## Git checkpoint

```bash
git tag -a checkpoint-pt-merge-batch-d -m "GCF Batch D: PT routine merge UI on Routines"
git push origin checkpoint-pt-merge-batch-d
```

## Next (Batch E — ideas)

- Handoff schema: `programSnapshot`, `activePhase` (ReForge + validation).
- Firestore rules audit for `exerciseSettings`.
- Loading / error toast on `updateRoutineMerge` failure.
