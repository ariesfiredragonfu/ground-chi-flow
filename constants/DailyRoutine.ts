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
// learnMoreUrl = YouTube search with exercise name pre-filled; user can hit Enter or edit.
// Optional videoUrl: add a direct MP4/Web URL or Firebase Storage link when you have a placeholder clip (manual workflow).
export const CORE_BALANCE = [
  { name: 'Lay on back — activate core triangle', detail: 'Activate core, glutes, pelvic floor. Sink lumbar to floor. Breathe through bottom of lumbar into the floor.', reps: null, learnMoreUrl: 'https://www.youtube.com/results?search_query=core+triangle+activation+floor' },
  { name: 'Leg extensions (on back)', detail: 'Core balance leg extensions. Activate glute.', reps: null, learnMoreUrl: 'https://www.youtube.com/results?search_query=leg+extensions+on+back+core' },
  { name: 'Bridge', detail: null, reps: null, learnMoreUrl: 'https://www.youtube.com/results?search_query=glute+bridge+exercise' },
  { name: 'Bridge butterflies', detail: null, reps: null, learnMoreUrl: 'https://www.youtube.com/results?search_query=bridge+butterfly+exercise' },
  { name: 'Bridge leg extensions', detail: null, reps: null, learnMoreUrl: 'https://www.youtube.com/results?search_query=bridge+leg+extension+exercise' },
  { name: 'Core triangle (on stomach)', detail: 'Laying on stomach, activate core triangle.', reps: null, learnMoreUrl: 'https://www.youtube.com/results?search_query=core+triangle+prone+exercise' },
  { name: 'Superman', detail: null, reps: null, learnMoreUrl: 'https://www.youtube.com/results?search_query=superman+exercise+back' },
  { name: 'Cat/Cow (all fours)', detail: 'Flow spine with breath. 5–10 rounds. Fascia + vagal.', reps: null, learnMoreUrl: 'https://www.youtube.com/results?search_query=cat+cow+stretch+yoga' },
  { name: 'Core activation (all fours)', detail: null, reps: null, learnMoreUrl: 'https://www.youtube.com/results?search_query=core+activation+all+fours' },
  { name: 'Bird dog', detail: 'Arm up, opposite leg up. Then other side.', reps: null, learnMoreUrl: 'https://www.youtube.com/results?search_query=bird+dog+exercise' },
  { name: 'Single-leg balance', detail: '30 sec eyes open, 15 sec eyes closed per side. Fall prevention, stability.', reps: '1x per side', learnMoreUrl: 'https://www.youtube.com/results?search_query=single+leg+balance+exercise' },
];

// ── Nervous System & Fascia (off-days: Tue, Thu, Sat, Sun) ────────────────────
// learnMoreUrl = YouTube search with exercise name pre-filled.
export const NERVOUS_SYSTEM_FASCIA = [
  { name: 'Rosenberg Basic Exercise (vagal)', detail: 'Hands behind head, look to one elbow 1 min. Sigh/yawn = done. Other side. Signals safety to brain.', reps: '1x per side', learnMoreUrl: 'https://www.youtube.com/results?search_query=Rosenberg+basic+exercise+vagal' },
  { name: '4-6 Polyvagal breath', detail: 'Inhale 4s, exhale 6s. 3–5 min. Longer exhale = parasympathetic.', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=polyvagal+breathing+4+6' },
  { name: 'Humming or OM chant', detail: '2–5 min. Vibrations stimulate vagus nerve.', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=humming+vagus+nerve+exercise' },
  { name: 'Supported butterfly (Supta Baddha Konasana)', detail: 'Reclining hip opener. 5–10 min. Inner thigh fascia.', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=supta+baddha+konasana+reclining+butterfly' },
  { name: 'Foam roll or tennis ball', detail: 'Upper back, glutes, calves. Sustained pressure, never sharp pain. 2–3 min per area.', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=foam+rolling+technique' },
  { name: 'Twisting + breath', detail: 'Seated twist. Breathe into stretch. 1 min per side.', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=seated+twist+stretch+yoga' },
  { name: 'Cold face splash (optional)', detail: '10–30 sec. Activates vagal calming response.', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=cold+face+splash+vagus+nerve' },
];

// Tue/Thu/Sat finisher block (day 2/4/6): add reactive and quick-twitch work
// inspired by Marinovich and Schroeder training themes.
export const NERVOUS_SYSTEM_QUICK_TWITCH_BY_DAY: Record<number, LadderExercise[]> = {
  2: [
    { name: 'Ball drop reaction catch (Marinovich-inspired)', detail: 'Partner/wall drop; react from split stance', reps: '20–30 sec x3', learnMoreUrl: 'https://www.youtube.com/results?search_query=ball+drop+reaction+catch+drill' },
    { name: 'Snap-down to athletic stance (Schroeder-inspired)', detail: 'Fast drop and stick with quiet landing', reps: '3–5 reps x3', learnMoreUrl: 'https://www.youtube.com/results?search_query=snap+down+athletic+stance+drill' },
    { name: 'Quick pogo hops', detail: 'Low amplitude, short ground contact', reps: '10–15 sec x3', learnMoreUrl: 'https://www.youtube.com/results?search_query=quick+pogo+hops+drill' },
  ],
  4: [
    { name: 'Tennis-ball wall reaction (Marinovich-inspired)', detail: 'Random bounce read and catch, alternating hands', reps: '20–30 sec x3', learnMoreUrl: 'https://www.youtube.com/results?search_query=tennis+ball+wall+reaction+drill' },
    { name: 'Fast-switch split stance (Schroeder-inspired)', detail: 'Switch feet quickly, then freeze on balance', reps: '5 reps/side x3', learnMoreUrl: 'https://www.youtube.com/results?search_query=split+stance+switch+drill+speed' },
    { name: 'Low line-hop quick switches', detail: 'Side-to-side line hops with crisp contacts', reps: '10–15 sec x3', learnMoreUrl: 'https://www.youtube.com/results?search_query=line+hops+quick+feet+drill' },
  ],
  6: [
    { name: 'Visual callout reaction step (Marinovich-inspired)', detail: 'React to random left/right/front cues', reps: '20–30 sec x3', learnMoreUrl: 'https://www.youtube.com/results?search_query=visual+reaction+step+drill' },
    { name: 'Iso switch punch-step (Schroeder-inspired)', detail: 'Brief iso hold, then explosive first step', reps: '3–4 reps/side x3', learnMoreUrl: 'https://www.youtube.com/results?search_query=isometric+to+explosive+first+step+drill' },
    { name: 'Split-jump snap (quick twitch)', detail: 'Small range, fast intent, controlled landing', reps: '5 reps/side x2', learnMoreUrl: 'https://www.youtube.com/results?search_query=split+jump+quick+twitch+drill' },
  ],
};

// ── G-O-A-T-A Floor (between Core Balance and Tai Chi) ───────────────────────
export const GOATA_FLOOR = [
  { name: 'Child pose', detail: 'Alternating foot positions. Duration by energy.', reps: null, learnMoreUrl: 'https://www.youtube.com/results?search_query=child+pose+yoga' },
  { name: 'Japanese seated squat', detail: 'Seiza or similar. Time by energy.', reps: null, learnMoreUrl: 'https://www.youtube.com/results?search_query=seiza+japanese+seated+squat' },
];

// ── Tai Chi / Qigong / Bagua (7-day rotation with video links) ────────────────
// Free, shareable tutorials. Tap to open in browser.
// Qigong = foundation (single movements that build chi). Tai Chi = flowing form that combines them.
export const QIGONG_TAICHI_INTRO =
  'Qigong is the first step and foundation — simple, single movements that build and cultivate chi. Tai Chi is when you put those movements together into a flowing form. Start with Qigong days to build the basics; Tai Chi forms flow from there.';

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
    title: 'Qigong — 8 Brocades (Ba Duan Jin)',
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
    title: 'Qigong — Standing Meditation & Flow',
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
    description: 'Pick your favourite from the week. Or flow through a short sequence of Tai Chi + Qigong + Bagua circle.',
    videoUrl: 'https://www.youtube.com/watch?v=6L43P1MY2KA',
    videoTitle: 'Tai Chi 8 Form — Quick flow',
    imageUrl: null,
    imageCredit: null,
  },
];

// ── Warm-up (every day before main exercises) ────────────────────────────────
export const WARMUP = [
  { name: 'Sled or resisted treadmill backwards', detail: '100 yards or 1 min', reps: '2x', learnMoreUrl: 'https://www.youtube.com/results?search_query=sled+walk+backwards' },
  { name: 'Sled or resisted treadmill forward', detail: '50 yards or 30 sec', reps: '2x', learnMoreUrl: 'https://www.youtube.com/results?search_query=sled+push+exercise' },
  { name: 'Calf stretch', detail: '1 min per side on slant board', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=calf+stretch+slant+board' },
  { name: 'Tibialis raise', detail: '12–15 reps', reps: '2x', learnMoreUrl: 'https://www.youtube.com/results?search_query=tibialis+raise+exercise' },
  { name: 'Seated calf raise', detail: 'Or alternate with straight leg', reps: '2x', learnMoreUrl: 'https://www.youtube.com/results?search_query=seated+calf+raise' },
];

// ── Mewing / Face / Neck (level-based) ──────────────────────────────────────
// These are intentionally non-clinical placeholders with YouTube search links
// so the client can pick a video and we avoid licensing issues.
export type ExerciseLevel = 'beginner' | 'intermediate' | 'advanced';
export type LadderExercise = {
  name: string;
  detail: string | null;
  reps: string | null;
  learnMoreUrl?: string | null;
  regression?: {
    name: string;
    detail: string | null;
    reps: string | null;
    learnMoreUrl?: string | null;
  };
};

export const MEWING_FACE_EXERCISES_BY_LEVEL: Record<ExerciseLevel, LadderExercise[]> = {
  beginner: [
    {
      name: 'Gentle tongue suction (mew)',
      detail: 'Nasal breathing · relax jaw · stop if painful',
      reps: '1–2 min total',
      learnMoreUrl: 'https://www.youtube.com/results?search_query=gentle+mewing+tongue+suction+nasal+breathing',
    },
    {
      name: 'Tongue posture reset (micro-holds)',
      detail: 'Light suction + swallow if needed; keep it comfortable',
      reps: '30–45 sec holds x3',
      learnMoreUrl: 'https://www.youtube.com/results?search_query=tongue+posture+reset+exercise+mewing',
    },
    {
      name: 'Masseter/cheek light engagement',
      detail: 'Controlled effort (no clenching); breathe steadily',
      reps: '8–10 reps',
      learnMoreUrl: 'https://www.youtube.com/results?search_query=masseter+cheek+engagement+exercise+no+clench',
    },
  ],
  intermediate: [
    {
      name: 'Mewing hold progression',
      detail: 'Nasal breathing · jaw relaxed · steady posture',
      reps: '2 min x2',
      learnMoreUrl: 'https://www.youtube.com/results?search_query=mewing+hold+progression+2+minutes+nasal+breathing',
    },
    {
      name: 'Tongue sweep + reset',
      detail: 'Slow tongue movement for posture control; pain-free',
      reps: '10–12 slow reps',
      learnMoreUrl: 'https://www.youtube.com/results?search_query=tongue+sweep+reset+mewing+exercise',
    },
    {
      name: 'Chin/neck relaxed alignment reset',
      detail: 'Reduce forward head; re-find tongue-on-palate position',
      reps: '2–3 rounds',
      learnMoreUrl: 'https://www.youtube.com/results?search_query=tongue+palate+alignment+reset+chin+neck+posture',
    },
  ],
  advanced: [
    {
      name: 'Extended mewing sets (timed suction)',
      detail: '2 sets · keep it comfortable; never push through pain',
      reps: '2 x 2–3 min',
      learnMoreUrl: 'https://www.youtube.com/results?search_query=extended+mewing+sets+timed+suction',
      regression: {
        name: 'Mewing hold progression',
        detail: 'Nasal breathing · jaw relaxed · steady posture',
        reps: '2 min x2',
        learnMoreUrl: 'https://www.youtube.com/results?search_query=mewing+hold+progression+2+minutes+nasal+breathing',
      },
    },
    {
      name: 'Tongue lateral micro-control',
      detail: 'Gentle side-to-side control; no strain',
      reps: '5 reps/side',
      learnMoreUrl: 'https://www.youtube.com/results?search_query=tongue+lateral+micro+control+mewing+exercise',
      regression: {
        name: 'Tongue posture reset (micro-holds)',
        detail: 'Light suction + swallow if needed; keep it comfortable',
        reps: '30–45 sec holds x3',
        learnMoreUrl: 'https://www.youtube.com/results?search_query=tongue+posture+reset+exercise+mewing',
      },
    },
    {
      name: 'Supported resistance mewing (very light)',
      detail: 'Support only (optional); stop immediately if irritated',
      reps: '3 x 30–45 sec',
      learnMoreUrl: 'https://www.youtube.com/results?search_query=supported+resistance+mewing+very+light',
      regression: {
        name: 'Gentle tongue suction (mew)',
        detail: 'Nasal breathing · relax jaw · stop if painful',
        reps: '1–2 min total',
        learnMoreUrl: 'https://www.youtube.com/results?search_query=gentle+mewing+tongue+suction+nasal+breathing',
      },
    },
  ],
};

export const NECK_EXERCISES_BY_LEVEL: Record<ExerciseLevel, LadderExercise[]> = {
  beginner: [
    {
      name: 'Chin tuck (deep neck flexor) isometric',
      detail: 'Small range · feel back of neck lengthen',
      reps: '5 sec holds x6',
      learnMoreUrl: 'https://www.youtube.com/results?search_query=chin+tuck+deep+neck+flexor+isometric+exercise',
    },
    {
      name: 'Neck nods (small-range)',
      detail: 'Controlled tempo; stop if any sharp pain',
      reps: '10 reps',
      learnMoreUrl: 'https://www.youtube.com/results?search_query=neck+nods+small+range+exercise',
    },
    {
      name: 'Upper trap / levator scap stretch',
      detail: 'Gentle stretch only',
      reps: '45–60 sec/side',
      learnMoreUrl: 'https://www.youtube.com/results?search_query=upper+trap+levator+scap+stretch+exercise',
    },
  ],
  intermediate: [
    {
      name: 'Chin tuck + slight rotation',
      detail: 'Half range; breathe steadily',
      reps: '5–8 reps/side',
      learnMoreUrl: 'https://www.youtube.com/results?search_query=chin+tuck+slight+rotation+exercise',
    },
    {
      name: 'Side-neck isometrics',
      detail: 'Use gentle force; keep head aligned',
      reps: '10 sec holds x3/side',
      learnMoreUrl: 'https://www.youtube.com/results?search_query=neck+side+isometric+exercise+10+sec',
    },
    {
      name: 'Scapular retraction (light band if available)',
      detail: 'Shoulders back/down; avoid shrugging',
      reps: '12 reps x2',
      learnMoreUrl: 'https://www.youtube.com/results?search_query=scapular+retraction+light+band+exercise',
    },
  ],
  advanced: [
    {
      name: 'Deep neck flexor endurance',
      detail: 'Long, controlled chin-tuck holds',
      reps: '30–45 sec total x2',
      learnMoreUrl: 'https://www.youtube.com/results?search_query=deep+neck+flexor+endurance+chin+tuck+exercise',
      regression: {
        name: 'Chin tuck isometric (beginner)',
        detail: 'Small range · feel back of neck lengthen',
        reps: '5 sec holds x6',
        learnMoreUrl: 'https://www.youtube.com/results?search_query=chin+tuck+deep+neck+flexor+isometric+exercise',
      },
    },
    {
      name: 'Tempo nods (with pause)',
      detail: 'Add 2 sec pause at neutral · slow',
      reps: '10 slow reps',
      learnMoreUrl: 'https://www.youtube.com/results?search_query=tempo+neck+nods+2+sec+pause+exercise',
      regression: {
        name: 'Neck nods (small-range)',
        detail: 'Controlled tempo; stop if any sharp pain',
        reps: '10 reps',
        learnMoreUrl: 'https://www.youtube.com/results?search_query=neck+nods+small+range+exercise',
      },
    },
    {
      name: 'Supported neck extension isometric',
      detail: 'Supported/controlled; no pinching pain',
      reps: '8–10 sec holds x4',
      learnMoreUrl: 'https://www.youtube.com/results?search_query=supported+neck+extension+isometric+exercise',
      regression: {
        name: 'Upper trap / levator scap stretch',
        detail: 'Gentle stretch only',
        reps: '45–60 sec/side',
        learnMoreUrl: 'https://www.youtube.com/results?search_query=upper+trap+levator+scap+stretch+exercise',
      },
    },
  ],
};

export const HAND_MUDRAS_DAY_1: LadderExercise[] = [
  {
    name: 'Gyan Mudra',
    detail: 'Thumb + index finger touching; relax jaw; calm breathing',
    reps: '5–10 min',
    learnMoreUrl: 'https://www.youtube.com/results?search_query=gyan+mudra+how+to',
  },
  {
    name: 'Prana Mudra',
    detail: 'Focus on energising + breath support',
    reps: '5–10 min',
    learnMoreUrl: 'https://www.youtube.com/results?search_query=prana+mudra+how+to',
  },
];

export const HAND_MUDRAS_DAY_3: LadderExercise[] = [
  {
    name: 'Shunya Mudra',
    detail: 'Balance focus; gentle and steady',
    reps: '5–10 min',
    learnMoreUrl: 'https://www.youtube.com/results?search_query=shunya+mudra+how+to',
  },
  {
    name: 'Prithvi Mudra',
    detail: 'Grounding focus',
    reps: '5–10 min',
    learnMoreUrl: 'https://www.youtube.com/results?search_query=prithvi+mudra+how+to',
  },
];

export const HAND_MUDRAS_DAY_5: LadderExercise[] = [
  {
    name: 'Vayu Mudra',
    detail: 'Gentle circulation + balance (comfort only)',
    reps: '5–10 min',
    learnMoreUrl: 'https://www.youtube.com/results?search_query=vayu+mudra+how+to',
  },
  {
    name: 'Apana Mudra',
    detail: 'Slow calming attention downward',
    reps: '5–10 min',
    learnMoreUrl: 'https://www.youtube.com/results?search_query=apana+mudra+how+to',
  },
];

export const FOOT_EXERCISES_DAY_1: LadderExercise[] = [
  {
    name: 'Toe yoga (toe doming)',
    detail: 'Keep big toe controlled; avoid cramping',
    reps: '10–15 reps',
    learnMoreUrl: 'https://www.youtube.com/results?search_query=toe+yoga+toe+doming+exercise',
  },
  {
    name: 'Ankle circles + range',
    detail: 'Slow circles each direction',
    reps: '30–45 sec/side',
    learnMoreUrl: 'https://www.youtube.com/results?search_query=ankle+circles+range+of+motion+exercise',
  },
];

export const FOOT_EXERCISES_DAY_3: LadderExercise[] = [
  {
    name: 'Short-foot exercise (arch lift)',
    detail: 'Lift arch without curling toes',
    reps: '10 reps x2',
    learnMoreUrl: 'https://www.youtube.com/results?search_query=short+foot+exercise+arch+lift',
  },
  {
    name: 'Towel scrunches',
    detail: 'Slow pulls; stop if sharp pain',
    reps: '30–60 sec x2',
    learnMoreUrl: 'https://www.youtube.com/results?search_query=towel+scrunch+foot+exercise',
  },
];

export const FOOT_EXERCISES_DAY_5: LadderExercise[] = [
  {
    name: 'Big toe extension stretch',
    detail: 'Gentle stretch; keep ankle neutral',
    reps: '45–60 sec/side',
    learnMoreUrl: 'https://www.youtube.com/results?search_query=big+toe+extension+stretch+exercise',
  },
  {
    name: 'Heel-to-toe walk (control)',
    detail: 'Slow, controlled steps',
    reps: '30–60 sec',
    learnMoreUrl: 'https://www.youtube.com/results?search_query=heel+to+toe+walk+balance+exercise',
  },
];

// ── Day A (Monday) ───────────────────────────────────────────────────────────
export const DAY_A_EXERCISES = [
  { name: 'GOATA Lunge', detail: '10–12 reps per side', reps: '3x', learnMoreUrl: 'https://www.youtube.com/results?search_query=GOATA+lunge+exercise' },
  { name: 'Stretch strength deadlift', detail: '15–20 reps', reps: '2x', learnMoreUrl: 'https://www.youtube.com/results?search_query=stretch+strength+deadlift' },
  { name: 'L-sit', detail: '20 sec', reps: '2x', learnMoreUrl: 'https://www.youtube.com/results?search_query=L-sit+exercise' },
  { name: 'Active couch stretch', detail: '1 min per side', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=active+couch+stretch' },
  { name: 'Elephant walk', detail: '15 reps per side', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=elephant+walk+exercise' },
  { name: 'Piriformis push-ups', detail: '20 reps per side', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=piriformis+push+up+exercise' },
  { name: 'Pancake standing pulse', detail: '20 reps', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=pancake+stretch+standing+pulse' },
  { name: 'External rotation', detail: '5 reps eccentric per side', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=external+rotation+shoulder+exercise' },
  { name: 'Pull over', detail: '10–12 reps', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=pull+over+exercise' },
  { name: 'Trap 3 raise', detail: '5 reps eccentric', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=trap+3+raise+exercise' },
  { name: 'Wrist pronation/supination', detail: '12 reps', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=wrist+pronation+supination+exercise' },
  { name: 'Dead hang or farmer\'s carry', detail: 'Grip strength: 20–40 sec hang, or 30 sec carry per hand. Longevity marker.', reps: '2x', learnMoreUrl: 'https://www.youtube.com/results?search_query=dead+hang+farmer+carry+exercise' },
];

// ── Day B (Wednesday) ────────────────────────────────────────────────────────
export const DAY_B_EXERCISES = [
  { name: 'Slant or Hackenschmidt squat', detail: '15–20 reps', reps: '3x', learnMoreUrl: 'https://www.youtube.com/results?search_query=Hackenschmidt+squat' },
  { name: 'Nordic hamstring lowers', detail: '5 reps', reps: '2x', learnMoreUrl: 'https://www.youtube.com/results?search_query=nordic+hamstring+exercise' },
  { name: 'L-sit', detail: '5 reps', reps: '2x', learnMoreUrl: 'https://www.youtube.com/results?search_query=L-sit+exercise' },
  { name: 'Hip flexor lift', detail: '15–20 reps', reps: '2x', learnMoreUrl: 'https://www.youtube.com/results?search_query=hip+flexor+lift+exercise' },
  { name: 'Active couch stretch', detail: '1 min per side', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=active+couch+stretch' },
  { name: 'Elephant walk', detail: '15 reps per side', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=elephant+walk+exercise' },
  { name: 'Piriformis push-ups', detail: '20 reps per side', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=piriformis+push+up+exercise' },
  { name: 'Pancake standing pulse', detail: '20 reps', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=pancake+stretch+standing+pulse' },
  { name: 'Power raises', detail: '10–12 reps per side', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=power+raises+shoulder+exercise' },
  { name: 'Incline press', detail: '10–12 reps', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=incline+press+exercise' },
  { name: 'Pull up', detail: 'To failure', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=pull+up+exercise' },
  { name: 'Wrist ulnar/radial flexion', detail: '10–12 reps', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=wrist+ulnar+radial+flexion+exercise' },
  { name: 'Dead hang or farmer\'s carry', detail: 'Grip strength: 20–40 sec hang, or 30 sec carry per hand. Longevity marker.', reps: '2x', learnMoreUrl: 'https://www.youtube.com/results?search_query=dead+hang+farmer+carry+exercise' },
];

// ── Day C (Friday) ───────────────────────────────────────────────────────────
export const DAY_C_EXERCISES = [
  { name: 'GOATA Lunge', detail: '12 reps per side', reps: '3x', learnMoreUrl: 'https://www.youtube.com/results?search_query=GOATA+lunge+exercise' },
  { name: 'Hamstring curl', detail: '10–12 reps', reps: '2x', learnMoreUrl: 'https://www.youtube.com/results?search_query=hamstring+curl+exercise' },
  { name: 'Back extension single leg with band', detail: '10–12 reps', reps: '2x', learnMoreUrl: 'https://www.youtube.com/results?search_query=back+extension+single+leg+with+band+exercise' },
  { name: 'Active couch stretch', detail: '1 min per side', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=active+couch+stretch' },
  { name: 'Elephant walk', detail: '15 reps per side', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=elephant+walk+exercise' },
  { name: 'Piriformis push-ups', detail: '20 reps per side', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=piriformis+push+up+exercise' },
  { name: 'Pancake standing pulse', detail: '20 reps', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=pancake+stretch+standing+pulse' },
  { name: 'QL extensions', detail: '10–12 reps per side', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=quadratus+lumborum+QL+extension' },
  { name: 'Row', detail: '10–12 reps per side', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=row+exercise+single+arm' },
  { name: 'Neck strengthening', detail: '3 reps', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=neck+strengthening+exercise' },
  { name: 'Reverse curls', detail: '10–12 reps', reps: '1x', learnMoreUrl: 'https://www.youtube.com/results?search_query=reverse+curl+exercise' },
  { name: 'Dead hang or farmer\'s carry', detail: 'Grip strength: 20–40 sec hang, or 30 sec carry per hand. Longevity marker.', reps: '2x', learnMoreUrl: 'https://www.youtube.com/results?search_query=dead+hang+farmer+carry+exercise' },
];

// ── Regressions for main exercises (client can step down if needed) ─────────
export type MainExerciseRegression = {
  name: string;
  detail: string | null;
  reps: string | null;
  learnMoreUrl?: string | null;
  videoUrl?: string | null;
  /** Optional step between easiest regression and full exercise (e.g. L-sit ladder). */
  intermediateStep?: {
    name: string;
    detail: string | null;
    reps: string | null;
    learnMoreUrl?: string | null;
    videoUrl?: string | null;
  };
};

export const MAIN_EXERCISE_REGRESSIONS: Record<string, MainExerciseRegression> = {
  'GOATA Lunge': {
    name: 'Split squat hold (supported)',
    detail: 'Use support/chair as needed',
    reps: '20–30 sec/side x2',
    learnMoreUrl: 'https://www.youtube.com/results?search_query=supported+split+squat+hold+regression',
  },
  'Stretch strength deadlift': {
    name: 'Hip hinge to wall',
    detail: 'Bodyweight hinge pattern first',
    reps: '8–12 reps x2',
    learnMoreUrl: 'https://www.youtube.com/results?search_query=hip+hinge+to+wall+exercise',
  },
  'L-sit': {
    name: 'Seated knee-tuck hold',
    detail: 'Hands by hips, lift one or both feet slightly',
    reps: '10–20 sec x2',
    learnMoreUrl: 'https://www.youtube.com/results?search_query=l+sit+regression+seated+knee+tuck+hold',
    intermediateStep: {
      name: 'Assisted L-sit (blocks or dip bars)',
      detail: 'Shorten the lever; press through hands; build hold time before full L-sit',
      reps: '10–15 sec x2',
      learnMoreUrl: 'https://www.youtube.com/results?search_query=assisted+L+sit+progression+blocks',
    },
  },
  'Slant or Hackenschmidt squat': {
    name: 'Box squat (bodyweight)',
    detail: 'Controlled range to comfortable depth',
    reps: '8–12 reps x2',
    learnMoreUrl: 'https://www.youtube.com/results?search_query=box+squat+bodyweight+regression',
  },
  'Nordic hamstring lowers': {
    name: 'Assisted Nordic (band or push-up assist)',
    detail: 'Use strong assistance and short range',
    reps: '3–5 reps x2',
    learnMoreUrl: 'https://www.youtube.com/results?search_query=assisted+nordic+hamstring+regression',
  },
  'Pull up': {
    name: 'Band-assisted pull-up or ring row',
    detail: 'Choose pain-free shoulder path',
    reps: '6–10 reps',
    learnMoreUrl: 'https://www.youtube.com/results?search_query=band+assisted+pull+up+or+ring+row+regression',
  },
  'Back extension single leg with band': {
    name: 'Back extension (bilateral, no band)',
    detail: 'Short range to start',
    reps: '8–10 reps x2',
    learnMoreUrl: 'https://www.youtube.com/results?search_query=back+extension+beginner+regression',
  },
  'Incline press': {
    name: 'Incline push-up',
    detail: 'Hands elevated on bench/table',
    reps: '8–12 reps',
    learnMoreUrl: 'https://www.youtube.com/results?search_query=incline+push+up+regression',
  },
  'Row': {
    name: 'Supported single-arm row',
    detail: 'Bench/chair support for torso',
    reps: '8–12 reps/side',
    learnMoreUrl: 'https://www.youtube.com/results?search_query=supported+single+arm+row+regression',
  },
};

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

// Advanced progression after jump rope for vertical leap development.
export const ADVANCED_VERTICAL_LEAP_PROGRESSION = [
  {
    stage: '4. Countermovement jump',
    detail: 'Stick each landing. 3–5 reps x3. Full recovery between sets.',
    learnMoreUrl: 'https://www.youtube.com/results?search_query=countermovement+jump+landing+mechanics',
  },
  {
    stage: '5. Box jump (low to moderate height)',
    detail: 'Step down, do not jump down. 3–5 reps x3.',
    learnMoreUrl: 'https://www.youtube.com/results?search_query=box+jump+proper+form+step+down',
  },
  {
    stage: '6. Depth drop to stick',
    detail: 'Drop from low box, absorb and hold. 3 reps x3.',
    learnMoreUrl: 'https://www.youtube.com/results?search_query=depth+drop+landing+drill',
  },
  {
    stage: '7. Approach jump / broad jump',
    detail: 'Explosive intent with controlled landing. 3–4 reps x3.',
    learnMoreUrl: 'https://www.youtube.com/results?search_query=approach+jump+training+broad+jump+drill',
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
