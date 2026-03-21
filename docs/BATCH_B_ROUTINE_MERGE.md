# Batch B — PT routine merge (hide sections)

## Behavior

- When `source === 'pt'` and `ptProgram.routineMerge` is present, **Routines** hides whole sections by **stable id**.
- **`routineMerge.disabledSections`**: explicit list (see below).
- **`routineMerge.conflictTagsActive`**: tags that map to sections:
  - `neck` → `mewing_face`, `neck`
  - `knee` or `lower_body_load` → `goata_floor`, `main_strength`
- Alias: `mudras_and_feet` expands to `hand_mudras` + `foot_exercises`.
- Non-PT users and PT handoffs **without** `routineMerge` see the **full** routine (Batch A unchanged).

## Section IDs

Aligned with ReForge export expander **Ground Chi Flow — hide conflicting routine sections**:

`meditation`, `breathwork`, `pt_rehab`, `mewing_face`, `neck`, `hand_mudras`, `foot_exercises`, `mudras_and_feet`, `core_balance`, `goata_floor`, `qigong_tai_chi`, `main_strength`, `longevity_cardio`.

## ReForge

`Hardware_Factory/reforge-agent-mvp/app.py` adds sidebar expander + exports `routineMerge` on `pt_handoff_request` (`schema_version` **1.1.0**).

## Verify

```bash
cd GroundChiFlow
npm run verify:pt-handoff
npx tsc --noEmit
```

## Git checkpoint

```bash
git tag -a checkpoint-pt-merge-batch-b -m "GCF Batch B: routine merge + routineMerge handoff"
git push origin checkpoint-pt-merge-batch-b
```

## Next

- **Batch C:** [BATCH_C_PERSIST_PT_PROFILE.md](BATCH_C_PERSIST_PT_PROFILE.md) — persist PT program + `updateRoutineMerge`.
- **Batch D:** [BATCH_D_ROUTINE_MERGE_UI.md](BATCH_D_ROUTINE_MERGE_UI.md) — Routines UI for merge rules.
