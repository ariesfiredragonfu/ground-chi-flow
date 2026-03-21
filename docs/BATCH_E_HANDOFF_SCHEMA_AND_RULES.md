# Batch E — Handoff schema 1.2.0, validation, Firestore rules, save UX

**Last updated:** 2026-03-21

## What shipped

### 1. ReForge export (`Hardware_Factory/reforge-agent-mvp/app.py`)

- **`pt_handoff_request.schema_version`:** `1.2.0`
- **`programSnapshot`:** `{ protocolKey, phaseKeys, planSummaryExcerpt }` — excerpt is first 400 chars of plan summary.
- **`activePhase`:** `{ key, label, orderIndex }` — first selected phase key + humanized label.

Older GCF builds ignore unknown fields; **1.2.0** clients show snapshot + active phase in **Routines** context lines.

### 2. Ground Chi Flow types & UI

- **`PtProgramPayload`:** `programSnapshot`, `activePhase`, optional `handoffSchemaVersion` (from `schema_version` on handoff doc).
- **`buildPtRehabContextLines`:** Adds “Active phase” and “Plan snapshot” when present.
- **`shouldShowPtRehabSection`:** True if snapshot excerpt or active phase exists (even without custom exercises).

### 3. Validation (`lib/validatePtHandoffShape.ts`)

- **`validatePtHandoffRequest(raw)`** — structural checks for Firestore `ptHandoffRequests/{email}` docs.
- **`npm run verify:pt-batch-e`** — self-test.

### 4. Save reliability (merge panel)

- **`updateRoutineMerge`** awaits Firestore, then updates state; **throws** on failure.
- **`PtRoutineMergePanel`:** loading spinner on header while saving, **Alert** on error, disables toggles while saving.

### 5. Firestore security (template)

See **[FIRESTORE_SECURITY_PT_HANDOFF.md](FIRESTORE_SECURITY_PT_HANDOFF.md)** — paste/adapt into Firebase Console → Firestore → Rules.

## Verify

```bash
cd GroundChiFlow
npm run verify:pt-handoff
npx tsc --noEmit
```

ReForge: export JSON and confirm `schema_version` is `1.2.0` and new keys exist after **Generate / Update Plan**.

## Git checkpoint

```bash
git tag -a checkpoint-pt-merge-batch-e -m "GCF Batch E: handoff 1.2.0, validate, rules doc, merge save UX"
git push origin checkpoint-pt-merge-batch-e
```

## Next (optional)

- Server-side rule tests (Firebase emulator).
- PT-only write to `ptHandoffRequests` (custom claims).
- Re-import handoff when `ptHandoffRequests` is newer than user `exerciseSettings` (timestamp compare).
