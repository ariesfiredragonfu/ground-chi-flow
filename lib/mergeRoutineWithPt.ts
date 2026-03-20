/**
 * Batch B: which Routines sections to hide when source is PT and routineMerge is set.
 */
import type { ExerciseSource } from './buildPtRehabSection';
import type { PtProgramPayload } from './buildPtRehabSection';
import { ROUTINE_SECTION_ID_SET } from './routineSectionIds';

/** PT / conflict tag → sections to hide (deterministic, documented). */
export const CONFLICT_TAG_TO_SECTIONS: Readonly<Record<string, readonly string[]>> = {
  // Cervical / upper-quarter rehab: reduce extra neck & jaw loading in GCF.
  neck: ['mewing_face', 'neck'],
  // Knee / lower-body loading: reduce jump/landing prep and heavy main strength until cleared.
  knee: ['goata_floor', 'main_strength'],
  lower_body_load: ['goata_floor', 'main_strength'],
};

function normalizeSectionToken(raw: string): string {
  return String(raw).trim().toLowerCase().replace(/\s+/g, '_');
}

/** Expand aliases (e.g. mudras_and_feet) into concrete section ids. */
export function expandSectionAliases(ids: Iterable<string>): string[] {
  const out = new Set<string>();
  for (const raw of ids) {
    const id = normalizeSectionToken(raw);
    if (id === 'mudras_and_feet') {
      out.add('hand_mudras');
      out.add('foot_exercises');
      continue;
    }
    if (ROUTINE_SECTION_ID_SET.has(id)) out.add(id);
  }
  return [...out];
}

/**
 * Section IDs to omit from the Routines screen.
 * - Non-PT clients: always empty.
 * - PT without `routineMerge`: empty (Batch A behavior).
 */
export function getHiddenRoutineSectionIds(
  source: ExerciseSource,
  ptProgram: PtProgramPayload | null | undefined
): Set<string> {
  const hidden = new Set<string>();
  if (source !== 'pt' || ptProgram == null) return hidden;

  const rm = ptProgram.routineMerge;
  if (rm == null) return hidden;

  const fromExplicit = expandSectionAliases(rm.disabledSections ?? []);
  fromExplicit.forEach((id) => hidden.add(id));

  const tags = rm.conflictTagsActive ?? [];
  for (const raw of tags) {
    const tag = normalizeSectionToken(raw);
    const mapped = CONFLICT_TAG_TO_SECTIONS[tag];
    if (mapped) mapped.forEach((id) => hidden.add(id));
  }

  return hidden;
}

export function isRoutineSectionVisible(hidden: Set<string>, sectionId: string): boolean {
  return !hidden.has(sectionId);
}

export function runMergeRoutineWithPtSelfTest(): string[] {
  const errors: string[] = [];
  const assert = (cond: boolean, msg: string) => {
    if (!cond) errors.push(msg);
  };

  assert(
    getHiddenRoutineSectionIds('signup', { routineMerge: { disabledSections: ['neck'] } }).size === 0,
    'non-pt ignores routineMerge'
  );

  assert(
    getHiddenRoutineSectionIds('pt', null).size === 0,
    'pt null program hides nothing'
  );

  assert(
    getHiddenRoutineSectionIds('pt', { customExercises: [{ name: 'x' }] }).size === 0,
    'pt without routineMerge hides nothing'
  );

  const h1 = getHiddenRoutineSectionIds('pt', {
    routineMerge: { disabledSections: ['meditation', 'mudras_and_feet'] },
  });
  assert(h1.has('meditation'), 'explicit meditation');
  assert(h1.has('hand_mudras'), 'mudras alias hand');
  assert(h1.has('foot_exercises'), 'mudras alias foot');

  const h2 = getHiddenRoutineSectionIds('pt', {
    routineMerge: { conflictTagsActive: ['neck'] },
  });
  assert(h2.has('neck') && h2.has('mewing_face'), 'neck tag');

  const h3 = getHiddenRoutineSectionIds('pt', {
    routineMerge: { conflictTagsActive: ['knee'] },
  });
  assert(h3.has('goata_floor') && h3.has('main_strength'), 'knee tag');

  const h4 = getHiddenRoutineSectionIds('pt', {
    routineMerge: { conflictTagsActive: ['lower_body_load'], disabledSections: ['breathwork'] },
  });
  assert(h4.has('breathwork') && h4.has('main_strength'), 'combined merge');

  assert(
    expandSectionAliases(['  MUDRAS_AND_FEET ', 'invalid_section']).length === 2,
    'expand drops unknown except alias pair'
  );

  return errors;
}
