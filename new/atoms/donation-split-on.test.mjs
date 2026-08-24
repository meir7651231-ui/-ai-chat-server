import { donationSplitOn } from './donation-split-on.mjs';
const C = [
  [{ donationSplit: true }, true],
  [{}, false],
  [{ donationSplit: false }, false],
  [{ donationSplit: 'true' }, false],
  [{ donationSplit: 1 }, false],
];
let f = 0;
for (const [cfg, w] of C) {
  const g = donationSplitOn(cfg);
  if (g !== w) { console.error(`✗ donationSplitOn(${JSON.stringify(cfg)}) = ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ donation-split-on: 5 דוגמאות-חוזה — ירוק');
