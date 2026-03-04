/**
 * Mental health & evidence-based detox.
 *
 * Lifestyle psychiatry: sleep, exercise, diet, social connection.
 * Detox: evidence-based only (sauna + hydration, fiber, liver support).
 * Parasite cleanses: not evidence-based — get tested, use prescription if needed.
 */

// Lifestyle factors for mental health (evidence-based)
export const MENTAL_HEALTH_LIFESTYLE = [
  { id: 'sleep', title: 'Sleep', detail: 'Quality & quantity. Poor sleep worsens anxiety, depression. 7–9 hrs.', icon: 'moon-outline' as const },
  { id: 'exercise', title: 'Exercise', detail: 'Reduces depression, anxiety. Sedentary behavior increases risk.', icon: 'fitness-outline' as const },
  { id: 'diet', title: 'Diet', detail: 'Whole foods, omega-3, gut health. Diet affects mood and brain chemistry.', icon: 'nutrition-outline' as const },
  { id: 'social', title: 'Social connection', detail: 'Family, friends, community. Isolation worsens mental health.', icon: 'people-outline' as const },
  { id: 'mindfulness', title: 'Mindfulness / CBT', detail: 'Mindfulness-based cognitive therapy. Neurofeedback. Evidence-based.', icon: 'leaf-outline' as const },
];

// Evidence-based detox — safe practices only
export const DETOX_EVIDENCE_BASED = [
  {
    id: 'hydration',
    title: 'Hydration',
    detail: 'Water supports kidney and liver function. Essential for elimination.',
    icon: 'water-outline' as const,
  },
  {
    id: 'fiber',
    title: 'Fiber',
    detail: 'Supports regular elimination. Whole grains, legumes, vegetables.',
    icon: 'leaf-outline' as const,
  },
  {
    id: 'sauna',
    title: 'Sauna (with hydration)',
    detail: 'Sweating may support heavy metal excretion. Hydrate before, during, after. 20 min ≈ 1 pint fluid loss.',
    icon: 'flame-outline' as const,
  },
  {
    id: 'liver',
    title: 'Liver support',
    detail: 'Limit alcohol. Cruciferous vegetables, adequate protein. Avoid excess processed foods.',
    icon: 'medical-outline' as const,
  },
];

// Parasites — evidence-based approach (not OTC cleanses)
export const PARASITE_NOTE = {
  title: 'Parasites & infections',
  detail: 'OTC parasite cleanses lack evidence. If you suspect infection: get tested (stool, DNA). Use prescription antiparasitics when confirmed. Consult a healthcare provider.',
};

// Integration roadmap — future wearables
export const INTEGRATION_ROADMAP = [
  { name: 'Muse', detail: 'EEG headband. Brain states during meditation. SDK for iOS/Android.', url: 'https://choosemuse.com/pages/developers' },
  { name: 'Wellness Core', detail: '13 trackers. AI timing.', url: 'https://wellnesscore.app/' },
  { name: 'Oura, Whoop, Garmin', detail: 'HRV, sleep, recovery. HealthKit integration.', url: null },
];
