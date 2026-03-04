# Wearable Integration Guide

Manual input is the primary path. This doc describes how to add wearable integrations when you have devices and API access.

## To-Do List (Priority Order)

1. **Muse** (headband) — coherence, meditation quality
2. **Hume band** — HRV, stress, recovery, sleep
3. **Oura Ring** (or similar) — sleep, HRV, readiness

See `constants/WearableRoadmap.ts` for the full list and status.

## Groundwork

- **`lib/wearableProviders.ts`** — `WearableProvider` interface and `ingestFromWearable()` helper
- **`hooks/useHealthData.ts`** — `VitalsEntry` has optional `source` field (`manual` | `muse` | `hume` | `oura` | …)
- **`useVitals().saveVitals(date, data)`** — accepts partial data; wearable data merges with manual

## Adding a Provider

1. Create a provider file, e.g. `lib/providers/museProvider.ts`
2. Implement `WearableProvider`:
   - `isConnected()` — check if user has connected (token, OAuth, etc.)
   - `fetchVitals(date)` — fetch data for that date from the device API
3. Register: `registerProvider(museProvider)` (e.g. in `_layout.tsx` or a sync service)
4. In your sync flow, call:
   ```ts
   const payload = await museProvider.fetchVitals(today);
   await ingestFromWearable('muse', today, payload, saveVitals);
   ```

## Data Shape

`WearableVitalsPayload` matches `VitalsEntry` fields:

- `hrv`, `sleepHrs`, `sleepQuality`, `energy`, `stress`, `coherence`

Return only the fields your device provides. They will be merged with manual entries.

## API Keys / OAuth

Store secrets in `.env` (never commit). Use `expo-secure-store` or similar for OAuth tokens. Add a Settings screen for users to connect devices when ready.
