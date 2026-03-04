/**
 * Daily Morning Routine — full structure
 *
 * Order: Meditation → Breathwork → Core Balance → G-O-A-T-A Floor →
 *        Tai Chi/Qigong/Bagua → Main Exercises (Mon/Wed/Fri)
 *
 * Day of week: 1=Mon, 2=Tue, ..., 7=Sun
 * Main exercises rotate: Day A (Mon), Day B (Wed), Day C (Fri)
 */

import { Colors } from './Colors';

// ── Meditation (7 types, one per breathwork day) ─────────────────────────────
export const MEDITATIONS = [
  { id: 1, name: 'Mindfulness', duration: 5, description: 'Present-moment awareness. Observe thoughts without judgment. Anchor to breath.', icon: 'leaf-outline' as const, color: Colors.primary },
  { id: 2, name: 'Transcendental (Mantra)', duration: 5, description: 'Silently repeat a word or sound. 20 min ideal; 5 min minimum. Eyes closed, seated.', icon: 'mic-outline' as const, color: Colors.secondary },
  { id: 3, name: 'Loving-Kindness (Metta)', duration: 6, description: '"May I be happy. May I be safe." Extend to loved ones, neutrals, all beings.', icon: 'heart-outline' as const, color: Colors.hrv },
  { id: 4, name: 'Body Scan', duration: 7, description: 'Systematically move attention through body parts. Head to toes or toes to head.', icon: 'body-outline' as const, color: Colors.gut },
  { id: 5, name: 'Concentration (Samatha)', duration: 6, description: 'Focus on single object: breath, candle flame, or point. Return when mind wanders.', icon: 'eye-outline' as const, color: Colors.energy },
  { id: 6, name: 'Vipassana', duration: 8, description: 'See things as they are. Observe physical sensations. Mind-body connection.', icon: 'analytics-outline' as const, color: Colors.warning },
  { id: 7, name: 'Guided / Visualization', duration: 7, description: 'Mental imagery of relaxing place. Engage senses. Or use app/audio guide.', icon: 'compass-outline' as const, color: Colors.primary },
];

// ── Breathwork (existing 7-day) ─────────────────────────────────────────────
export const BREATHWORK = [
  { day: 1, title: 'Box Breathing', duration: 5, description: 'Inhale 4s · Hold 4s · Exhale 4s · Hold 4s. Parasympathetic activation.', icon: 'square-outline' as const, color: Colors.primary },
  { day: 2, title: '4-7-8 Breathing', duration: 6, description: 'Inhale 4s · Hold 7s · Exhale 8s. Nervous system reset.', icon: 'timer-outline' as const, color: Colors.secondary },
  { day: 3, title: 'Resonant Breathing', duration: 8, description: '5–6 breaths/min (5s in, 5s out). Maximises HRV.', icon: 'heart-outline' as const, color: Colors.hrv },
  { day: 4, title: 'Diaphragmatic Breathing', duration: 7, description: 'Belly rises on inhale, falls on exhale. Foundation.', icon: 'body-outline' as const, color: Colors.gut },
  { day: 5, title: 'Alternate Nostril', duration: 8, description: 'Nadi Shodhana — balances left/right brain.', icon: 'git-branch-outline' as const, color: Colors.energy },
  { day: 6, title: 'Wim Hof Method', duration: 10, description: '30 deep breaths, retain on exhale. Energising.', icon: 'flame-outline' as const, color: Colors.warning },
  { day: 7, title: 'Integration & Flow', duration: 12, description: 'Choose your favourite from the week.', icon: 'leaf-outline' as const, color: Colors.primary },
];

// ── Core Balance (every day) ─────────────────────────────────────────────────
// Cat/Cow added for fascia + nervous system (spine, breath)
export const CORE_BALANCE = [
  { name: 'Lay on back — activate core triangle', detail: 'Activate core, glutes, pelvic floor. Sink lumbar to floor. Breathe through bottom of lumbar into the floor.', reps: null },
  { name: 'Leg extensions (on back)', detail: 'Core balance leg extensions. Activate glute.', reps: null },
  { name: 'Bridge', detail: null, reps: null },
  { name: 'Bridge butterflies', detail: null, reps: null },
  { name: 'Bridge leg extensions', detail: null, reps: null },
  { name: 'Core triangle (on stomach)', detail: 'Laying on stomach, activate core triangle.', reps: null },
  { name: 'Superman', detail: null, reps: null },
  { name: 'Cat/Cow (all fours)', detail: 'Flow spine with breath. 5–10 rounds. Fascia + vagal.', reps: null },
  { name: 'Core activation (all fours)', detail: null, reps: null },
  { name: 'Bird dog', detail: 'Arm up, opposite leg up. Then other side.', reps: null },
  { name: 'Single-leg balance', detail: '30 sec eyes open, 15 sec eyes closed per side. Fall prevention, stability.', reps: '1x per side' },
];

// ── Nervous System & Fascia (off-days: Tue, Thu, Sat, Sun) ────────────────────
// Lighter block when main exercises are not done. ~15–25 min.
// Child pose & Cat/Cow already in Core Balance + G-O-A-T-A Floor.
export const NERVOUS_SYSTEM_FASCIA = [
  { name: 'Rosenberg Basic Exercise (vagal)', detail: 'Hands behind head, look to one elbow 1 min. Sigh/yawn = done. Other side. Signals safety to brain.', reps: '1x per side' },
  { name: '4-6 Polyvagal breath', detail: 'Inhale 4s, exhale 6s. 3–5 min. Longer exhale = parasympathetic.', reps: '1x' },
  { name: 'Humming or OM chant', detail: '2–5 min. Vibrations stimulate vagus nerve.', reps: '1x' },
  { name: 'Supported butterfly (Supta Baddha Konasana)', detail: 'Reclining hip opener. 5–10 min. Inner thigh fascia.', reps: '1x' },
  { name: 'Foam roll or tennis ball', detail: 'Upper back, glutes, calves. Sustained pressure, never sharp pain. 2–3 min per area.', reps: '1x' },
  { name: 'Twisting + breath', detail: 'Seated twist. Breathe into stretch. 1 min per side.', reps: '1x' },
  { name: 'Cold face splash (optional)', detail: '10–30 sec. Activates vagal calming response.', reps: '1x' },
];

// ── G-O-A-T-A Floor (between Core Balance and Tai Chi) ───────────────────────
export const GOATA_FLOOR = [
  { name: 'Child pose', detail: 'Alternating foot positions. Duration by energy.', reps: null },
  { name: 'Japanese seated squat', detail: 'Seiza or similar. Time by energy.', reps: null },
];

// ── Tai Chi / Qigong / Bagua (7-day rotation with video links) ────────────────
// Free, shareable tutorials. Tap to open in browser.
export const TAI_CHI_QI_GONG_BAGUA = [
  {
    day: 1,
    title: 'Tai Chi 8 Form',
    description: 'Beginner short form. Repulse Monkey, Brush Knee, Part Horse\'s Mane, Clouds, Golden Cock, Grasp Bird\'s Tail.',
    videoUrl: 'https://www.youtube.com/watch?v=6L43P1MY2KA',
    videoTitle: 'Best Tai Chi for Beginners — 8 min (Don Fiore)',
    imageUrl: 'https://www.draketo.de/anderes/taijiquan-form.html',
    imageCredit: 'CC BY-SA sketches: draketo.de',
  },
  {
    day: 2,
    title: 'Qi Gong — 8 Brocades (Ba Duan Jin)',
    description: 'Ancient 8-movement sequence. Supporting Heaven, Drawing Bow, Separate Heaven & Earth, Wise Owl, Sway Head & Tail.',
    videoUrl: 'https://www.youtube.com/watch?v=ylXD51w3geE',
    videoTitle: 'Eight Brocades — 12 min with English (Ba Duan Jin)',
    imageUrl: null,
    imageCredit: null,
  },
  {
    day: 3,
    title: 'Bagua — Circle Walking & Single Palm',
    description: 'Walk the circle. Single palm change. Foundation of baguazhang.',
    videoUrl: 'https://www.youtube.com/watch?v=MjlQcapaoyw',
    videoTitle: 'Bagua Single Palm Circle Walking — Intro',
    imageUrl: 'https://www.youtube.com/watch?v=CXZvRmWu7I0',
    imageCredit: '8 Bagua Switches — Baguazhang for Beginners',
  },
  {
    day: 4,
    title: 'Tai Chi 24 Form (Peking)',
    description: 'Simplified 24-posture form. Part Horse\'s Mane, White Crane, Brush Knee, Grasp Sparrow\'s Tail.',
    videoUrl: 'https://www.youtube.com/watch?v=--5C_5uMBsU',
    videoTitle: '24 Form — Two people mirror (knee-friendly)',
    imageUrl: 'https://www.draketo.de/anderes/taijiquan-form.pdf',
    imageCredit: 'CC BY-SA 24 Form sketches — draketo.de',
  },
  {
    day: 5,
    title: 'Qi Gong — Standing Meditation & Flow',
    description: 'Zhan Zhuang (standing post). Sink qi to dantian. Gentle flowing movements.',
    videoUrl: 'https://www.youtube.com/watch?v=Xn70sib9bu4',
    videoTitle: 'Ba Duan Jin — How to do Qigong (Michael Gilman)',
    imageUrl: null,
    imageCredit: null,
  },
  {
    day: 6,
    title: 'Bagua — 8 Palms',
    description: 'Eight mother palms: Single Change, Double Change, Following Through, Reversing Body, Turning Body, Double Embrace, Grinding, Rotating.',
    videoUrl: 'https://www.youtube.com/watch?v=7NyeAhSg1Vo',
    videoTitle: 'Ba Gua Zhang — 8 Palms & Tutorial',
    imageUrl: null,
    imageCredit: null,
  },
  {
    day: 7,
    title: 'Integration — Your Choice',
    description: 'Pick your favourite from the week. Or flow through a short sequence of Tai Chi + Qi Gong + Bagua circle.',
    videoUrl: 'https://www.youtube.com/watch?v=6L43P1MY2KA',
    videoTitle: 'Tai Chi 8 Form — Quick flow',
    imageUrl: null,
    imageCredit: null,
  },
];

// ── Warm-up (every day before main exercises) ────────────────────────────────
export const WARMUP = [
  { name: 'Sled or resisted treadmill backwards', detail: '100 yards or 1 min', reps: '2x' },
  { name: 'Sled or resisted treadmill forward', detail: '50 yards or 30 sec', reps: '2x' },
  { name: 'Calf stretch', detail: '1 min per side on slant board', reps: '1x' },
  { name: 'Tibialis raise', detail: '12–15 reps', reps: '2x' },
  { name: 'Seated calf raise', detail: 'Or alternate with straight leg', reps: '2x' },
];

// ── Day A (Monday) ───────────────────────────────────────────────────────────
export const DAY_A_EXERCISES = [
  { name: 'G-O-A-T-A Lunge', detail: '10–12 reps per side', reps: '3x' },
  { name: 'Stretch strength deadlift', detail: '15–20 reps', reps: '2x' },
  { name: 'L-sit', detail: '20 sec', reps: '2x' },
  { name: 'Active couch stretch', detail: '1 min per side', reps: '1x' },
  { name: 'Elephant walk', detail: '15 reps per side', reps: '1x' },
  { name: 'Piriformis push-ups', detail: '20 reps per side', reps: '1x' },
  { name: 'Pancake standing pulse', detail: '20 reps', reps: '1x' },
  { name: 'External rotation', detail: '5 reps eccentric per side', reps: '1x' },
  { name: 'Pull over', detail: '10–12 reps', reps: '1x' },
  { name: 'Trap 3 raise', detail: '5 reps eccentric', reps: '1x' },
  { name: 'Wrist pronation/supination', detail: '12 reps', reps: '1x' },
  { name: 'Dead hang or farmer\'s carry', detail: 'Grip strength: 20–40 sec hang, or 30 sec carry per hand. Longevity marker.', reps: '2x' },
];

// ── Day B (Wednesday) ────────────────────────────────────────────────────────
export const DAY_B_EXERCISES = [
  { name: 'Seated calf raise', detail: '12–15 reps, 20–25 lb', reps: '2x' },
  { name: 'Slant or Hackenschmidt squat', detail: '15–20 reps', reps: '3x' },
  { name: 'L-sit', detail: '5 reps', reps: '2x' },
  { name: 'Hip flexor lift', detail: '15–20 reps', reps: '2x' },
  { name: 'Active couch stretch', detail: '1 min per side', reps: '1x' },
  { name: 'Elephant walk', detail: '15 reps per side', reps: '1x' },
  { name: 'Piriformis push-ups', detail: '20 reps per side', reps: '1x' },
  { name: 'Pancake standing pulse', detail: '20 reps', reps: '1x' },
  { name: 'Power raises', detail: '10–12 reps per side', reps: '1x' },
  { name: 'ATG incline press', detail: '10–12 reps', reps: '1x' },
  { name: 'Pull up', detail: 'To failure', reps: '1x' },
  { name: 'Wrist ulnar/radial flexion', detail: '10–12 reps', reps: '1x' },
];

// ── Day C (Friday) ───────────────────────────────────────────────────────────
export const DAY_C_EXERCISES = [
  { name: 'Seated calf raise', detail: '12–15 reps', reps: '2x' },
  { name: 'G-O-A-T-A Lunge', detail: '12 reps per side', reps: '3x' },
  { name: 'Hamstring curl', detail: '10–12 reps', reps: '2x' },
  { name: 'Back extension', detail: '10–12 reps', reps: '1x' },
  { name: 'Single leg with band', detail: null, reps: '2x' },
  { name: 'Active couch stretch', detail: '1 min per side', reps: '1x' },
  { name: 'Elephant walk', detail: '15 reps per side', reps: '1x' },
  { name: 'Piriformis push-ups', detail: '20 reps per side', reps: '1x' },
  { name: 'Pancake standing pulse', detail: '20 reps', reps: '1x' },
  { name: 'QL extensions', detail: '10–12 reps per side', reps: '1x' },
  { name: 'ATG row', detail: '10–12 reps per side', reps: '1x' },
  { name: 'Neck strengthening', detail: '3 reps', reps: '1x' },
  { name: 'Reverse curls', detail: '10–12 reps', reps: '1x' },
];

// ── Longevity extras (optional, outside morning routine) ─────────────────────
// Zone 2 = aerobic base (mitochondrial health). Zone 5 = VO2 max (HIIT).
// No-impact options: Gazelle, bike. Trampoline = lymph drainage + vertical load.
// ChiWalk first before brisk walk (joint-friendly progression).
export const LONGEVITY_CARDIO = {
  zone2: {
    title: 'Zone 2',
    target: '3–4 hrs/week',
    detail: 'Sustained aerobic. No-impact: Gazelle, bike. Low-impact: ChiWalk (core-engaged walk) before brisk walk — important for older or joint-sensitive users. Trampoline for lymph drainage + vertical load. Can talk but not sing.',
  },
  zone5: { title: 'Zone 5', target: '1x/week', detail: '4×4 min HIIT or similar. High intensity, short bursts.' },
  chiwalk: {
    title: 'ChiWalk first',
    detail: 'Before brisk walking: build core engagement, alignment, balance. See ChiLiving. Reduces joint wear.',
  },
};

// Vertical load progression (lymph drainage, bone density). Start gentlest, progress.
export const VERTICAL_LOAD_PROGRESSION = [
  {
    stage: '1. Toe loading/unloading',
    detail: 'Feet grounded. Heel lift, press into floor. Gentle loading-unloading. For injury recovery or starting from zero.',
  },
  {
    stage: '2. Trampoline (rebounder)',
    detail: 'Health bounce: feet stay on mat, 1–2" lift max. Safer than jump rope when starting. Lymph drainage.',
  },
  {
    stage: '3. Jump rope',
    detail: 'Progress to jump rope once trampoline is comfortable. Higher impact.',
  },
];

// Fun balance sports for advanced/medium users — mix fun with balance training
export const BALANCE_FUN_SPORTS = [
  'Skateboarding',
  'Electric unicycle',
  'Balance board',
  'Rollerblading / inline skating',
  'Surfing / paddleboarding',
  'Slacklining',
  'Unicycle',
  'Snowboarding',
];

// Day names for display (1=Mon, 7=Sun)
export const ROUTINE_DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

// Main block (heavy exercises) = Mon, Wed, Fri only. Other days = Nervous System & Fascia.
export function isMainBlockDay(routineDay: number): boolean {
  return routineDay === 1 || routineDay === 3 || routineDay === 5;
}

// Routine day (1-7) → main exercise program. Days 1-2=A, 3-4=B, 5-7=C.
export function getMainExerciseDay(routineDay: number): 'A' | 'B' | 'C' {
  if (routineDay <= 2) return 'A';
  if (routineDay <= 4) return 'B';
  return 'C';
}

export function getMainExercises(day: 'A' | 'B' | 'C') {
  if (day === 'A') return DAY_A_EXERCISES;
  if (day === 'B') return DAY_B_EXERCISES;
  return DAY_C_EXERCISES;
}
