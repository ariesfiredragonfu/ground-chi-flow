/**
 * Wearable Provider Groundwork
 *
 * When you add Muse, Hume, Oura, etc., implement the WearableProvider
 * interface and register here. useVitals.saveVitals() accepts the same
 * shape — call it from your provider's sync/ingest logic.
 *
 * Example (when Muse SDK is added):
 *
 *   const museProvider: WearableProvider = {
 *     id: 'muse',
 *     name: 'Muse',
 *     isConnected: async () => !!museToken,
 *     fetchVitals: async (date) => {
 *       const data = await museApi.getSession(date);
 *       return { coherence: data.coherence, ... };
 *     },
 *   };
 *   registerProvider(museProvider);
 *
 * Then in your sync flow:
 *   const vitals = await museProvider.fetchVitals(today);
 *   saveVitals(today, { ...vitals, source: 'muse' });
 */

import type { WearableProviderId } from '../constants/WearableRoadmap';
import type { VitalsEntry } from '../hooks/useHealthData';

/** Partial vitals that a wearable can provide (subset of VitalsEntry) */
export interface WearableVitalsPayload {
  hrv?: number;
  sleepHrs?: number;
  sleepQuality?: number;
  energy?: number;
  stress?: number;
  coherence?: number;
}

/** Interface for a wearable data provider */
export interface WearableProvider {
  id: WearableProviderId;
  name: string;
  /** Check if user has connected this device (has token, etc.) */
  isConnected: () => Promise<boolean>;
  /** Fetch vitals for a date. Return partial data — will be merged with manual. */
  fetchVitals: (date: string) => Promise<WearableVitalsPayload>;
}

/** Registry of providers. Add implementations here when ready. */
const providers: WearableProvider[] = [];

export function registerProvider(p: WearableProvider): void {
  if (!providers.find((x) => x.id === p.id)) {
    providers.push(p);
  }
}

export function getProviders(): WearableProvider[] {
  return [...providers];
}

export function getProvider(id: WearableProviderId): WearableProvider | undefined {
  return providers.find((p) => p.id === id);
}

/**
 * Ingest wearable data into vitals.
 * Call this from your provider's sync logic, passing saveVitals from useVitals.
 */
export async function ingestFromWearable(
  providerId: WearableProviderId,
  date: string,
  payload: WearableVitalsPayload,
  saveVitals: (date: string, data: Partial<Omit<VitalsEntry, 'date' | 'savedAt'>>) => Promise<void>
): Promise<void> {
  await saveVitals(date, { ...payload, source: providerId });
}
