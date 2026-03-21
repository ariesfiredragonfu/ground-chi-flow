/**
 * Batch A: derive display rows for "PT rehab" from handoff-loaded ptProgram.
 * Pure helpers — no React / Firestore imports.
 */
export type ExerciseSource = 'pt' | 'signup' | 'user' | 'guest';

/** Batch B: PT-chosen hides + tag-driven conflicts (Firestore `routineMerge`). */
export type PtRoutineMerge = {
  disabledSections?: string[];
  conflictTagsActive?: string[];
};

/** Batch E: frozen excerpt from ReForge export (schema ≥ 1.2.0). */
export type PtProgramSnapshot = {
  protocolKey?: string;
  phaseKeys?: string[];
  planSummaryExcerpt?: string;
};

/** Batch E: which phase the patient is in (ReForge → GCF). */
export type PtActivePhase = {
  key?: string;
  label?: string;
  orderIndex?: number;
};

/** Subset of handoff / user settings shape used for the PT rehab section. */
export type PtProgramPayload = {
  protocolKey?: string;
  protocolSeverity?: string;
  phaseKeys?: string[];
  customExercises?: Array<{ name: string; dosage?: string; rom_limit?: string }>;
  customNutritionNotes?: string;
  redFlagWatchlist?: string[];
  ptAuthor?: string;
  routineMerge?: PtRoutineMerge;
  /** ReForge `pt_handoff_request.schema_version` echoed for debugging (optional). */
  handoffSchemaVersion?: string;
  programSnapshot?: PtProgramSnapshot;
  activePhase?: PtActivePhase;
};

export type PtRehabRow = {
  name: string;
  detail: string | null;
  reps: string | null;
};

/** Batch C: apply a partial patch to `routineMerge` (immutable). */
export function mergeRoutineMergePatch(
  ptProgram: PtProgramPayload,
  patch: Partial<PtRoutineMerge>
): PtProgramPayload {
  return {
    ...ptProgram,
    routineMerge: {
      ...(ptProgram.routineMerge ?? {}),
      ...patch,
    },
  };
}

function nonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

/** Show the section when client came from PT handoff and there is something to show. */
export function shouldShowPtRehabSection(
  source: ExerciseSource,
  ptProgram: PtProgramPayload | null | undefined
): boolean {
  if (source !== 'pt' || ptProgram == null) return false;
  const ex = ptProgram.customExercises;
  if (Array.isArray(ex) && ex.length > 0) return true;
  if (nonEmptyString(ptProgram.protocolKey)) return true;
  if (Array.isArray(ptProgram.phaseKeys) && ptProgram.phaseKeys.length > 0) return true;
  if (nonEmptyString(ptProgram.customNutritionNotes)) return true;
  if (Array.isArray(ptProgram.redFlagWatchlist) && ptProgram.redFlagWatchlist.length > 0) return true;
  if (nonEmptyString(ptProgram.ptAuthor)) return true;
  if (nonEmptyString(ptProgram.programSnapshot?.planSummaryExcerpt)) return true;
  if (nonEmptyString(ptProgram.activePhase?.key) || nonEmptyString(ptProgram.activePhase?.label)) return true;
  return false;
}

/** One-line context under the section title (protocol / phases / PT name). */
export function buildPtRehabContextLines(ptProgram: PtProgramPayload): string[] {
  const lines: string[] = [];
  if (nonEmptyString(ptProgram.protocolKey)) {
    const sev = nonEmptyString(ptProgram.protocolSeverity) ? ` (${ptProgram.protocolSeverity})` : '';
    lines.push(`Protocol: ${ptProgram.protocolKey}${sev}`);
  }
  if (Array.isArray(ptProgram.phaseKeys) && ptProgram.phaseKeys.length > 0) {
    lines.push(`Phases: ${ptProgram.phaseKeys.join(', ')}`);
  }
  if (nonEmptyString(ptProgram.activePhase?.label)) {
    lines.push(`Active phase: ${ptProgram.activePhase!.label}`);
  } else if (nonEmptyString(ptProgram.activePhase?.key)) {
    lines.push(`Active phase: ${ptProgram.activePhase!.key}`);
  }
  if (nonEmptyString(ptProgram.programSnapshot?.planSummaryExcerpt)) {
    const ex = ptProgram.programSnapshot!.planSummaryExcerpt!.trim();
    lines.push(`Plan snapshot: ${ex.length > 220 ? `${ex.slice(0, 217)}…` : ex}`);
  }
  if (nonEmptyString(ptProgram.ptAuthor)) {
    lines.push(`Prescribed by: ${ptProgram.ptAuthor}`);
  }
  return lines;
}

/** Exercise rows for ExerciseItem (detail = dosage + ROM; reps often null). */
export function buildPtRehabExerciseRows(ptProgram: PtProgramPayload): PtRehabRow[] {
  const raw = ptProgram.customExercises;
  if (!Array.isArray(raw) || raw.length === 0) return [];

  return raw.map((row) => {
    const name = nonEmptyString(row.name) ? row.name.trim() : 'Exercise';
    const parts: string[] = [];
    if (nonEmptyString(row.dosage)) parts.push(`Dosage: ${row.dosage!.trim()}`);
    if (nonEmptyString(row.rom_limit)) parts.push(`ROM: ${row.rom_limit!.trim()}`);
    const detail = parts.length > 0 ? parts.join(' · ') : null;
    return { name, detail, reps: null };
  });
}

/** Nutrition / red-flag lines as non-timer text blocks (simple bullets). */
export function buildPtRehabExtraNotes(ptProgram: PtProgramPayload): string[] {
  const out: string[] = [];
  if (nonEmptyString(ptProgram.customNutritionNotes)) {
    out.push(`Nutrition: ${ptProgram.customNutritionNotes!.trim()}`);
  }
  if (Array.isArray(ptProgram.redFlagWatchlist) && ptProgram.redFlagWatchlist.length > 0) {
    out.push('Watch for / contact your PT or clinician if:');
    ptProgram.redFlagWatchlist.forEach((r) => {
      if (nonEmptyString(r)) out.push(`• ${r.trim()}`);
    });
  }
  return out;
}

/** Self-test for CI / checkpoint (Node: node lib/buildPtRehabSection.selftest.mjs). */
export function runPtRehabSectionSelfTest(): string[] {
  const errors: string[] = [];
  const assert = (cond: boolean, msg: string) => {
    if (!cond) errors.push(msg);
  };

  assert(!shouldShowPtRehabSection('signup', { protocolKey: 'knee' }), 'signup should not show PT section');
  assert(shouldShowPtRehabSection('pt', { protocolKey: 'acl' }), 'pt + protocolKey should show');
  assert(!shouldShowPtRehabSection('pt', {}), 'pt + empty payload should not show');
  assert(
    shouldShowPtRehabSection('pt', { customExercises: [{ name: 'heel slide' }] }),
    'pt + custom exercises should show'
  );

  const rows = buildPtRehabExerciseRows({
    customExercises: [{ name: 'Quad set', dosage: '5x10', rom_limit: 'pain-free' }],
  });
  assert(rows.length === 1, 'one row');
  assert(rows[0]?.name === 'Quad set', 'name');
  assert(rows[0]?.detail != null && rows[0].detail.includes('5x10'), 'dosage in detail');

  const ctx = buildPtRehabContextLines({
    protocolKey: 'acl_reconstruction',
    protocolSeverity: 'post_op',
    phaseKeys: ['acute'],
    ptAuthor: 'Dr. Smith',
  });
  assert(ctx.length === 3, 'three context lines');
  assert(ctx.some((l) => l.includes('acl')), 'protocol in context');

  const base: PtProgramPayload = { protocolKey: 'knee', routineMerge: { conflictTagsActive: ['neck'] } };
  const m1 = mergeRoutineMergePatch(base, { disabledSections: ['meditation'] });
  assert(!!m1.routineMerge?.conflictTagsActive?.includes('neck'), 'patch keeps tags');
  assert(!!m1.routineMerge?.disabledSections?.includes('meditation'), 'patch adds sections');
  const m2 = mergeRoutineMergePatch({ protocolKey: 'x' }, { conflictTagsActive: ['knee'] });
  assert(m2.routineMerge?.conflictTagsActive?.[0] === 'knee', 'patch on empty merge');

  const snapLines = buildPtRehabContextLines({
    protocolKey: 'acl',
    activePhase: { key: 'acute', label: 'Acute' },
    programSnapshot: { planSummaryExcerpt: 'Short summary for home program.' },
  });
  assert(snapLines.some((l) => l.startsWith('Active phase:')), 'active phase line');
  assert(snapLines.some((l) => l.startsWith('Plan snapshot:')), 'snapshot line');

  return errors;
}
