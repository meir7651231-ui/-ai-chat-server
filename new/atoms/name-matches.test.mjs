import { nameMatches } from './name-matches.mjs';
// שקע: normName אמיתי כמוסכמת-maor/plannedMatch (מקומי — הבדיקה מייבאת רק את האטום שלה)
const normName = (s) => String(s || '')
  .replace(/[֑-ׇ]/g, '')          // ניקוד עברי
  .replace(/["'.,\-()]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase();
const C = [
  ['ישראל כהן', 'ישראל כהן', true],
  ['ישראל כהן', 'כהן ישראל', true],
  ['ישראל כהן', 'משה כהן', false],
  ['דָּוִד כֹּהֵן', 'דוד כהן', true],
  ['דוד', 'דוד', true],
  ['דוד', 'לוי', false],
  ['דוד', 'דוד לוי', false],
  ['', 'כהן', false],
];
let f = 0;
for (const [a, b, w] of C) {
  const g = nameMatches(a, b, normName);
  if (g !== w) { console.error(`✗ ("${a}","${b}") ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ name-matches: 8 דוגמאות-חוזה — ירוק');
