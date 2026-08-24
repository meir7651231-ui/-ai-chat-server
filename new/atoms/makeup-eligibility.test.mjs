import { makeupEligibility } from './makeup-eligibility.mjs';
const C = [
  [['noshow', true, 100], { eligible: false, dropsPunch: true }],
  [['cancel', true, 2], { eligible: true, dropsPunch: false }],
  [['cancel', false, 48], { eligible: true, dropsPunch: false }],
  [['cancel', false, 47.5], { eligible: false, dropsPunch: true }],
  [['cancel', false, null], { eligible: false, dropsPunch: true }],
  [['cancel', true, null], { eligible: true, dropsPunch: false }],
];
let f = 0;
for (const [args, w] of C) {
  const g = makeupEligibility(...args);
  if (g.eligible !== w.eligible || g.dropsPunch !== w.dropsPunch) {
    console.error(`✗ makeupEligibility(${JSON.stringify(args)}) = ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`);
    f = 1;
  }
}
if (f) process.exit(1);
console.log('✓ makeup-eligibility: 6 דוגמאות-חוזה — ירוק');
