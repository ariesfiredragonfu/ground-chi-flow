/**
 * Personal-baseline HRV copy for the dashboard (wellness education only — not medical advice).
 */

export interface HrvBaseline {
  mean: number;
  sampleCount: number;
  /** Half-width of the "near your usual range" band (ms). */
  bandMs: number;
}

const MIN_BASELINE_SAMPLES = 3;

export function computeHrvBaseline(
  vitalsByDate: Record<string, { hrv?: number }>,
  excludeDate: string
): HrvBaseline | null {
  const values: number[] = [];
  for (const [date, entry] of Object.entries(vitalsByDate)) {
    if (date === excludeDate) continue;
    if (entry.hrv != null && Number.isFinite(entry.hrv)) {
      values.push(entry.hrv);
    }
  }
  if (values.length < MIN_BASELINE_SAMPLES) return null;

  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance =
    values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  const sd = Math.sqrt(variance);
  const bandMs = Math.max(3, sd > 0 ? sd : mean * 0.08);

  return { mean, sampleCount: values.length, bandMs };
}

export type HrvRelativeBand = 'above' | 'near' | 'below';

export function classifyHrvVsBaseline(todayHrv: number, baseline: HrvBaseline): HrvRelativeBand {
  if (todayHrv > baseline.mean + baseline.bandMs) return 'above';
  if (todayHrv < baseline.mean - baseline.bandMs) return 'below';
  return 'near';
}

export function getHrvInsightMessage(options: {
  todayLoggedHrv?: number;
  baseline: HrvBaseline | null;
}): string {
  const { todayLoggedHrv, baseline } = options;

  if (todayLoggedHrv == null) {
    return 'Log today’s HRV to see how it compares with your personal baseline.';
  }
  if (!baseline) {
    return 'Building your personal baseline — keep logging on different days to see your usual range.';
  }

  const band = classifyHrvVsBaseline(todayLoggedHrv, baseline);
  switch (band) {
    case 'above':
      return 'Today’s HRV is above your usual range.';
    case 'near':
      return 'Today’s HRV is near your usual range.';
    case 'below':
      return 'Today’s HRV is below your usual range.';
    default: {
      const _exhaustive: never = band;
      return _exhaustive;
    }
  }
}

/** User-facing label for the optional breathing-rhythm score ring (not a standard HRV metric). */
export function getBreathingRhythmRingLabel(scorePct: number): string {
  if (scorePct >= 70) return 'Steadier';
  if (scorePct >= 40) return 'Moderate';
  return 'Variable';
}
