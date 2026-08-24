import { offerNewFamily } from './offer-new-family.mjs';
// מימוש-שקע לבדיקה: lowercase + הסרת כל הרווחים (רוח normNameLocal במקור).
const normName = (s) => String(s).toLowerCase().replace(/\s/g, '');
const fams = [{ name: 'כהן לוי' }];
const C = [
  [fams, 'כהןלוי', false],
  [fams, 'כהן לוי ', false],
  [fams, 'מזרחי', true],
  [fams, 'ל', false],
  [fams, '  ל ', false],
  [[], 'אב', true],
];
let f = 0;
for (const [families, q, w] of C) {
  const g = offerNewFamily(families, q, normName);
  if (g !== w) { console.error(`✗ offerNewFamily(${JSON.stringify(q)}) = ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ offer-new-family: 6 דוגמאות-חוזה (שקע normName) — ירוק');
