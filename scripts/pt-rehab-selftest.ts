import { runPtRehabSectionSelfTest } from '../lib/buildPtRehabSection';

const errors = runPtRehabSectionSelfTest();
if (errors.length > 0) {
  console.error('buildPtRehabSection self-test failed:\n', errors.join('\n'));
  process.exit(1);
}
console.log('buildPtRehabSection self-test: OK');
