import { runMergeRoutineWithPtSelfTest } from '../lib/mergeRoutineWithPt';

const errors = runMergeRoutineWithPtSelfTest();
if (errors.length > 0) {
  console.error('mergeRoutineWithPt self-test failed:\n', errors.join('\n'));
  process.exit(1);
}
console.log('mergeRoutineWithPt self-test: OK');
