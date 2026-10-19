/**
 * Self-test for personal-baseline HRV insight copy (no test runner required).
 */
import {
  classifyHrvVsBaseline,
  computeHrvBaseline,
  getHrvInsightMessage,
} from '../lib/hrvInsights';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

const today = '2026-10-19';
const vitals = {
  '2026-10-15': { hrv: 60 },
  '2026-10-16': { hrv: 62 },
  '2026-10-17': { hrv: 58 },
  '2026-10-18': { hrv: 61 },
};

const baseline = computeHrvBaseline(vitals, today);
assert(baseline != null, 'expected baseline with 4 samples');
assert(classifyHrvVsBaseline(70, baseline!) === 'above', '70 should be above mean ~60');
assert(classifyHrvVsBaseline(60, baseline!) === 'near', '60 should be near mean');

const noBaselineMsg = getHrvInsightMessage({ todayLoggedHrv: 65, baseline: null });
assert(noBaselineMsg.includes('Building'), noBaselineMsg);

const belowMsg = getHrvInsightMessage({ todayLoggedHrv: 45, baseline: baseline! });
assert(belowMsg.includes('below'), belowMsg);

const unlogged = getHrvInsightMessage({ todayLoggedHrv: undefined, baseline: baseline! });
assert(unlogged.includes('Log'), unlogged);

console.log('hrv-insights-selftest: OK');
