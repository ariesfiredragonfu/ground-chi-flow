/**
 * Wearable Integration Roadmap
 *
 * Manual input is the primary path. This roadmap tracks planned integrations
 * for when devices are available. Users can add their own API keys and
 * connect devices when ready.
 *
 * Priority order (first three to integrate):
 *  1. Muse (headband) — meditation/coherence
 *  2. Hume band — HRV, stress, recovery
 *  3. Ring device (Oura / similar) — sleep, HRV, readiness
 */

export type WearableProviderId = 'manual' | 'muse' | 'hume' | 'oura' | 'whoop' | 'garmin' | 'apple_health' | 'google_fit';

export interface WearableIntegrationTodo {
  id: WearableProviderId;
  name: string;
  status: 'planned' | 'in_progress' | 'done';
  priority: number;
  dataTypes: string[];
  notes: string;
  docsUrl?: string;
}

export const WEARABLE_INTEGRATION_TODO: WearableIntegrationTodo[] = [
  {
    id: 'muse',
    name: 'Muse (headband)',
    status: 'planned',
    priority: 1,
    dataTypes: ['coherence', 'meditation_quality', 'brain_waves'],
    notes: 'Meditation/coherence focus. Muse SDK or API for real-time data.',
    docsUrl: 'https://choosemuse.com/developers',
  },
  {
    id: 'hume',
    name: 'Hume band',
    status: 'planned',
    priority: 2,
    dataTypes: ['hrv', 'stress', 'recovery', 'sleep'],
    notes: 'HRV, stress, recovery metrics. Check Hume API availability.',
  },
  {
    id: 'oura',
    name: 'Oura Ring',
    status: 'planned',
    priority: 3,
    dataTypes: ['sleep', 'hrv', 'readiness', 'activity'],
    notes: 'Sleep, HRV, readiness. Oura API requires OAuth + developer account.',
    docsUrl: 'https://cloud.ouraring.com/docs',
  },
  {
    id: 'whoop',
    name: 'Whoop',
    status: 'planned',
    priority: 4,
    dataTypes: ['hrv', 'sleep', 'strain', 'recovery'],
    notes: 'Whoop API for members.',
  },
  {
    id: 'garmin',
    name: 'Garmin Connect',
    status: 'planned',
    priority: 5,
    dataTypes: ['hrv', 'sleep', 'stress', 'body_battery'],
    notes: 'Garmin Health API.',
  },
  {
    id: 'apple_health',
    name: 'Apple Health (HealthKit)',
    status: 'planned',
    priority: 6,
    dataTypes: ['hrv', 'sleep', 'heart_rate', 'mindfulness'],
    notes: 'iOS only. expo-health or react-native-health.',
  },
  {
    id: 'google_fit',
    name: 'Google Fit',
    status: 'planned',
    priority: 7,
    dataTypes: ['hrv', 'sleep', 'heart_rate'],
    notes: 'Android. REST API + OAuth.',
  },
];

/** Human-readable label for provider */
export function getWearableLabel(id: WearableProviderId): string {
  const t = WEARABLE_INTEGRATION_TODO.find((x) => x.id === id);
  return t?.name ?? id;
}
