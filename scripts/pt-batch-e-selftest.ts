import { runValidatePtHandoffSelfTest } from '../lib/validatePtHandoffShape';

const errors = runValidatePtHandoffSelfTest();
if (errors.length > 0) {
  console.error('validatePtHandoffRequest self-test failed:\n', errors.join('\n'));
  process.exit(1);
}
console.log('validatePtHandoffRequest self-test: OK');
