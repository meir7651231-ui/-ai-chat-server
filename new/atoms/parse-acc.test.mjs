import { deepStrictEqual } from 'node:assert';
import { parseAcc } from './parse-acc.mjs';

const off = { contrast: false, noanim: false, links: false, spacing: false };
const C = [
  [null, off],
  ['', off],
  ['{"contrast":true,"links":true}', { contrast: true, noanim: false, links: true, spacing: false }],
  ['{"noanim":1,"spacing":"כן"}', { contrast: false, noanim: true, links: false, spacing: true }],
  ['{שבור', off],
  ['null', off],
];
for (const [raw, want] of C) deepStrictEqual(parseAcc(raw), want, `parseAcc(${JSON.stringify(raw)})`);
console.log('✓ parse-acc: 6 דוגמאות-חוזה — ירוק');
