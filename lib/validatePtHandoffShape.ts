/**
 * Batch E — Validate `ptHandoffRequests/{email}` document shape (ReForge export / manual upload).
 * Pure; safe to run in CI.
 */

const LEVELS = new Set(['beginner', 'intermediate', 'advanced']);

export type PtHandoffValidation = { ok: boolean; errors: string[] };

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return v != null && typeof v === 'object' && !Array.isArray(v);
}

/** Validate top-level Firestore handoff doc (same shape as `pt_handoff_request` in ReForge JSON). */
export function validatePtHandoffRequest(raw: unknown): PtHandoffValidation {
  const errors: string[] = [];
  if (!isPlainObject(raw)) {
    return { ok: false, errors: ['Root must be a non-null object'] };
  }
  const o = raw;

  const email = o.email;
  if (typeof email !== 'string' || !email.trim().includes('@')) {
    errors.push('email must be a non-empty string containing @');
  }

  if (o.schema_version != null && typeof o.schema_version !== 'string') {
    errors.push('schema_version must be a string if present');
  }

  if (o.level != null && !LEVELS.has(String(o.level))) {
    errors.push('level must be beginner, intermediate, or advanced if present');
  }

  if (o.source != null && typeof o.source !== 'string') {
    errors.push('source must be a string if present');
  }

  if (o.phaseKeys != null && !Array.isArray(o.phaseKeys)) {
    errors.push('phaseKeys must be an array if present');
  }

  if (o.customExercises != null && !Array.isArray(o.customExercises)) {
    errors.push('customExercises must be an array if present');
  }

  if (o.routineMerge != null && !isPlainObject(o.routineMerge)) {
    errors.push('routineMerge must be an object if present');
  } else if (isPlainObject(o.routineMerge)) {
    const rm = o.routineMerge;
    if (rm.disabledSections != null && !Array.isArray(rm.disabledSections)) {
      errors.push('routineMerge.disabledSections must be an array if present');
    }
    if (rm.conflictTagsActive != null && !Array.isArray(rm.conflictTagsActive)) {
      errors.push('routineMerge.conflictTagsActive must be an array if present');
    }
  }

  if (o.programSnapshot != null && !isPlainObject(o.programSnapshot)) {
    errors.push('programSnapshot must be an object if present');
  }

  if (o.activePhase != null && !isPlainObject(o.activePhase)) {
    errors.push('activePhase must be an object if present');
  } else if (isPlainObject(o.activePhase)) {
    const ap = o.activePhase;
    if (ap.orderIndex != null && typeof ap.orderIndex !== 'number') {
      errors.push('activePhase.orderIndex must be a number if present');
    }
  }

  return { ok: errors.length === 0, errors };
}

export function runValidatePtHandoffSelfTest(): string[] {
  const errors: string[] = [];
  const assert = (cond: boolean, msg: string) => {
    if (!cond) errors.push(msg);
  };

  const good = validatePtHandoffRequest({
    schema_version: '1.2.0',
    email: 'patient@example.com',
    level: 'beginner',
    source: 'pt',
    routineMerge: { disabledSections: [], conflictTagsActive: ['neck'] },
    programSnapshot: { planSummaryExcerpt: 'Test' },
    activePhase: { key: 'acute', label: 'Acute', orderIndex: 0 },
  });
  assert(good.ok, `valid handoff should pass: ${good.errors.join('; ')}`);

  const bad = validatePtHandoffRequest({ email: 'not-an-email' });
  assert(!bad.ok, 'invalid email should fail');

  const bad2 = validatePtHandoffRequest({ email: 'a@b.com', level: 'expert' });
  assert(!bad2.ok, 'bad level should fail');

  return errors;
}
