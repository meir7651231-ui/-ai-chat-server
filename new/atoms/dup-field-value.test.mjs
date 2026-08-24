import { dupFieldValue } from './dup-field-value.mjs';
const DEF = { key: 'phone', get: (f) => f.phone || '' };
const FAMS = [{ phone: '' }, { phone: '050' }, { phone: '052' }];
const C = [
  [FAMS, { phone: 2 }, { phone: '999' }, '999'],
  [FAMS, {}, { phone: '' }, ''],
  [FAMS, { phone: 2 }, {}, '052'],
  [FAMS, {}, {}, '050'],
  [[{}, {}], {}, {}, ''],
  [FAMS, { phone: 0 }, {}, ''],
];
let f = 0;
for (const [fams, pick, edit, w] of C) {
  const g = dupFieldValue(fams, DEF, pick, edit);
  if (g !== w) { console.error(`✗ dupFieldValue(pick=${JSON.stringify(pick)}, edit=${JSON.stringify(edit)}) = ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ dup-field-value: 6 דוגמאות-חוזה (דין-הלגאסי edit⇒pick⇒ראשונה) — ירוק');
