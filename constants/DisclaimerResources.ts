/**
 * Disclaimer & Resources — who this is for, rehab pathways, attributions.
 *
 * GroundChiFlow builds on foundational work by Dr. Ryan Peebles, Ben Patrick,
 * Nick Ball, and others. Injured users should start with their programs first.
 */

// Hero banner — no other app combines all of this
export const HERO_BANNER = {
  headline: 'No other app combines all of this in one place.',
  subline: 'Rehab · Routines · Gut · Nutrition · Longevity — mind, body & beyond.',
};

export const DISCLAIMER = {
  title: 'Before You Begin',
  body: `This system is for advanced-stage beginner rehab and beyond. It is not for complete beginners or those with acute injury.

If you have a back injury: Start with Core Balance (floor only) first. Complete that program before progressing here.

If you have a knee injury: Start with ATG (Knees Over Toes) first. Build that foundation before adding this system.

If you have a foot or ankle injury: Start with GOATA / foot-ankle rehab (e.g. Nick Ball) first. Master those positions before advancing.

You can also use this system while subtracting injured areas — do the other program for the injured part, and use this for the rest. Many find it helpful to complete the foundational programs first.`,
};

// Four front runners — primary sources for this system
export const FRONT_RUNNERS = [
  {
    id: 'peebles',
    name: 'Dr. Ryan Peebles',
    program: 'Core Balance Training',
    focus: 'Back pain, spine rehab. Floor-based core work.',
    url: 'https://www.corebalancetraining.com/',
    when: 'Start here if you have back injury or chronic back pain.',
  },
  {
    id: 'patrick',
    name: 'Ben Patrick',
    program: 'ATG / Knees Over Toes',
    focus: 'Knee rehab, bulletproof knees, tibialis, sled work.',
    url: 'https://www.atgonlinecoaching.com/',
    when: 'Start here if you have knee injury or knee pain.',
  },
  {
    id: 'ball',
    name: 'Nick Ball',
    program: 'GOATA / Nick Ball Training',
    focus: 'Foot & ankle rehab. Seiza, child pose, ground-based movement.',
    url: 'https://nickballtraining.com/',
    when: 'Start here if you have foot or ankle injury.',
  },
  {
    id: 'chiwalk',
    name: 'ChiLiving',
    program: 'ChiWalking / ChiRunning',
    focus: 'Core-engaged walking before brisk walk. Alignment, balance.',
    url: 'https://chiliving.com/chiwalking/',
    when: 'Build walking foundation before brisk walks — especially for older or joint-sensitive users.',
  },
];

// Lifestyle pillars often overlooked (Stanford longevity, Harvard)
export const LIFESTYLE_EXTRAS = [
  { id: 'gratitude', title: 'Gratitude & reflection', detail: 'Boosts wellbeing, sleep, immune function. Simple daily practice.' },
  { id: 'social', title: 'Social connection', detail: 'Family, friends, community. Extends longevity, prevents chronic disease.' },
  { id: 'cognitive', title: 'Cognitive engagement', detail: 'Learn, challenge the brain. Preserves function as we age.' },
];

// Related ecosystem — others integrating longevity, breathwork, neurofeedback
// GroundChiFlow is unique in combining rehab pathways (Core Balance, ATG, GOATA)
// with Tai Chi/Qigong/Bagua and a full daily routine structure in one app.
export const RELATED_ECOSYSTEM = [
  {
    id: 'schwa',
    name: 'SCHWA',
    tagline: 'Longevity & healthspan ecosystem',
    detail: 'Wearables, self-care tracking, breathwork, movement, purpose. Five pillars: Sleep, Cognition, Heart, Weight, Activities.',
    url: 'https://schwa.app/',
  },
  {
    id: 'longevitydeck',
    name: 'Longevity Deck',
    tagline: '120+ protocols, free, iOS',
    detail: 'Evidence-based protocols. Wearable integration. Auto-updates from Huberman, Rhonda Patrick, etc. Community-reviewed.',
    url: 'https://longevitydeck.com/',
  },
  {
    id: 'muse',
    name: 'Muse',
    tagline: 'Neurofeedback meditation',
    detail: 'EEG headband. Real-time brain feedback during meditation. Calm/active states. Research-grade.',
    url: 'https://choosemuse.com/',
  },
  {
    id: 'healium',
    name: 'Healium',
    tagline: 'Neurofeedback + VR/AR meditation',
    detail: 'EEG + heart rate. VR/AR meditation with biofeedback. Train focus, calm, sleep.',
    url: 'https://tryhealium.com/',
  },
  {
    id: 'wellnesscore',
    name: 'Wellness Core',
    tagline: 'All-in-one AI wellness',
    detail: '13 trackers: meditation, workouts, nutrition, sleep. AI timing for training, hydration, meditation.',
    url: 'https://wellnesscore.app/',
  },
];

// Attributions for content used in the app
export const ATTRIBUTIONS = [
  { section: 'Core Balance', source: 'Dr. Ryan Peebles', url: 'https://www.corebalancetraining.com/' },
  { section: 'ATG exercises (tibialis, slant board, sled, etc.)', source: 'Ben Patrick / ATG', url: 'https://www.atgonlinecoaching.com/' },
  { section: 'G-O-A-T-A Floor (child pose, seiza)', source: 'GOATA / Nick Ball', url: 'https://nickballtraining.com/' },
  { section: 'Tai Chi 8 Form', source: 'Don Fiore (YouTube)', url: 'https://www.youtube.com/watch?v=6L43P1MY2KA' },
  { section: '8 Brocades (Ba Duan Jin)', source: 'Various (YouTube)', url: 'https://www.youtube.com/watch?v=ylXD51w3geE' },
  { section: '24 Form sketches', source: 'draketo.de (CC BY-SA)', url: 'https://www.draketo.de/anderes/taijiquan-form.html' },
];
