# Batch A — PT rehab section (checkpoint)

## What shipped

- **Routines** shows **Your PT rehab program** when `useExerciseSettings` has `source === 'pt'` and `ptProgram` includes at least one of: `customExercises`, `protocolKey`, `phaseKeys`, `customNutritionNotes`, `redFlagWatchlist`, or `ptAuthor`.
- Exercises render from `customExercises` (`name`, `dosage`, `rom_limit`).
- Context lines show protocol, phases, and PT author when present.
- Nutrition note and red-flag list render as plain text below exercises.

## Verify

```bash
cd GroundChiFlow
npm run verify:pt-rehab
npx tsc --noEmit
```

Manual: sign in with an account whose email has a `ptHandoffRequests/{email}` doc (or user `exerciseSettings` with `source: pt` and `ptProgram`), open **Routines**.

## Git checkpoint

After this batch is merged to your mainline:

```bash
git tag -a checkpoint-pt-merge-batch-a -m "GCF Batch A: PT rehab section from handoff"
git push origin checkpoint-pt-merge-batch-a
```

Revert example: `git checkout checkpoint-pt-merge-batch-a`.

## Next (Batch B)

Merge engine: hide or tag conflicting GCF blocks when PT rehab is active (`mergeRehabRoutine` + routine metadata).
