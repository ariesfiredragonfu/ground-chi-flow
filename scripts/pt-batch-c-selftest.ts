import { mergeRoutineMergePatch } from '../lib/buildPtRehabSection';

const errors: string[] = [];
const assert = (cond: boolean, msg: string) => {
  if (!cond) errors.push(msg);
};

const p = mergeRoutineMergePatch(
  { customExercises: [{ name: 'a' }], routineMerge: { disabledSections: ['neck'] } },
  { conflictTagsActive: ['knee'] }
);
assert(!!p.routineMerge?.disabledSections?.includes('neck'), 'keep disabledSections');
assert(!!p.routineMerge?.conflictTagsActive?.includes('knee'), 'add conflictTags');

if (errors.length > 0) {
  console.error('Batch C merge self-test failed:\n', errors.join('\n'));
  process.exit(1);
}
console.log('Batch C mergeRoutineMergePatch self-test: OK');
