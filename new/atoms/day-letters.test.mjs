import { DAY_LETTERS } from './day-letters.mjs';
let f = 0;
const want = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳'];
if (DAY_LETTERS.length !== 6) { console.error(`✗ length ⇒ ${DAY_LETTERS.length} ≠ 6`); f = 1; }
const idx = [[0, 'א׳'], [1, 'ב׳'], [5, 'ו׳']];
for (const [i, w] of idx) if (DAY_LETTERS[i] !== w) { console.error(`✗ [${i}] ⇒ ${DAY_LETTERS[i]} ≠ ${w}`); f = 1; }
if (JSON.stringify(DAY_LETTERS) !== JSON.stringify(want)) { console.error('✗ המערך המלא שונה מהחוזה'); f = 1; }
for (const s of DAY_LETTERS) {
  if (s.length !== 2 || s[1] !== '׳') { console.error(`✗ ${JSON.stringify(s)} — לא אות+גרש-עברי U+05F3`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ day-letters: 6 אותיות ימים (0=ראשון…5=שישי, גרש-עברי) — ירוק');
