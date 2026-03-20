/**
 * Stable IDs for Routines screen blocks (Batch B — PT merge / hide rules).
 * Keep in sync with Reforge `GCF_SECTION_CHOICES` in app.py.
 */
export const ROUTINE_SECTION_IDS = [
  'meditation',
  'breathwork',
  'pt_rehab',
  'mewing_face',
  'neck',
  'hand_mudras',
  'foot_exercises',
  'mudras_and_feet', // alias: expands to hand_mudras + foot_exercises
  'core_balance',
  'goata_floor',
  'qigong_tai_chi',
  'main_strength',
  'longevity_cardio',
] as const;

export type RoutineSectionId = (typeof ROUTINE_SECTION_IDS)[number];

export const ROUTINE_SECTION_ID_SET = new Set<string>(ROUTINE_SECTION_IDS);
