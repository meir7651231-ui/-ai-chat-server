import { gradeFits } from './grade-fits.mjs';
const ORDER = ['גן', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב'];
const gi = (g) => {
  const clean = (g || '').replace(/["'׳״]/g, '').replace(/^כיתה\s*/, '').trim();
  return clean ? ORDER.indexOf(clean) : -1;
};
const C = [
  [{}, 'ג', true, 'אין טווח ⇒ מתאים'],
  [{ gradeMin: 'א', gradeMax: 'ג' }, 'חיילים', true, 'כיתת-ילד לא-מזוהה ⇒ מתאים'],
  [{ gradeMin: 'א', gradeMax: 'ג' }, 'ב', true, 'בתוך הטווח'],
  [{ gradeMin: 'ב', gradeMax: 'ד' }, 'א', false, 'מתחת לטווח'],
  [{ gradeMin: 'א', gradeMax: 'ג' }, 'ד', false, 'מעל הטווח'],
  [{ gradeMin: 'ג' }, 'יב', true, 'רק gradeMin — אין תקרה'],
  [{ gradeMin: 'ג' }, 'א', false, 'רק gradeMin — מתחת לרצפה'],
  [{ gradeMin: '???', gradeMax: 'ג' }, 'גן', true, 'קצה לא-מזוהה לא נאכף'],
];
let f = 0;
for (const [c, grade, want, msg] of C) {
  const got = gradeFits(c, grade, gi);
  if (got !== want) { console.error(`✗ ${msg} ⇒ ${got} ≠ ${want}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ grade-fits: 8 דוגמאות-חוזה — ירוק');
