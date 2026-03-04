/**
 * Advanced longevity modalities — upper-advanced tier.
 *
 * Cold/heat exposure, senolytics, spermidine, autophagy boosters, red light.
 * Add your own protocols and schedules.
 */

export const ADVANCED_MODALITIES = [
  {
    id: 'cold',
    title: 'Cold exposure',
    detail: 'Cold plunge, cold shower, ice bath. Activates brown fat, resilience, potential longevity benefits.',
    icon: 'snow-outline' as const,
  },
  {
    id: 'heat',
    title: 'Heat exposure',
    detail: 'Sauna, steam. Heat shock proteins, cardiovascular support, relaxation.',
    icon: 'flame-outline' as const,
  },
  {
    id: 'senolytics',
    title: 'Senolytics',
    detail: 'Compounds that clear senescent (aging) cells. Quercetin + fisetin, or other protocols. Research dosing.',
    icon: 'medical-outline' as const,
  },
  {
    id: 'spermidine',
    title: 'Spermidine',
    detail: 'Activates autophagy. Food sources: wheat germ, aged cheese, soybeans, mushrooms, legumes. Or supplement.',
    icon: 'leaf-outline' as const,
  },
  {
    id: 'autophagy',
    title: 'Autophagy booster',
    detail: 'Cellular cleanup. Fasting, exercise, spermidine-rich foods, cold exposure. Time-restricted eating supports it.',
    icon: 'refresh-outline' as const,
  },
  {
    id: 'redlight',
    title: 'Red light therapy',
    detail: 'LED panels. Mitochondrial support, skin, recovery. Typically 10–20 min sessions.',
    icon: 'sunny-outline' as const,
  },
];

// Neurofeedback & brain state fluidity — future integration
// Muse, Healium use EEG for real-time feedback during meditation.
export const NEUROFEEDBACK_FUTURE = [
  { name: 'Muse', detail: 'EEG headband. Real-time calm/active brain states during meditation.', url: 'https://choosemuse.com/' },
  { name: 'Healium', detail: 'VR/AR + EEG. Biofeedback transforms meditation experience.', url: 'https://tryhealium.com/' },
];
