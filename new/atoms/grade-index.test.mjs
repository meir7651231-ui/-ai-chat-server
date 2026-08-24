import { gradeIndex } from './grade-index.mjs';
const ORDER = ['גן', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב'];
const C = [
  ['גן', 0, 'גן'],
  ['א', 1, 'א'],
  ['י"ב', 12, 'גרשיים מוסרים'],
  ['כיתה ב׳', 2, 'קידומת "כיתה" + גרש'],
  ['', -1, 'ריק'],
  [undefined, -1, 'undefined'],
  ['יג', -1, 'לא-מזוהה'],
  [' ה ', 5, 'רווחים נגזמים'],
];
let f = 0;
for (const [g, want, msg] of C) {
  const got = gradeIndex(g, ORDER);
  if (got !== want) { console.error(`✗ ${msg}: ${JSON.stringify(g)} ⇒ ${got} ≠ ${want}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ grade-index: 8 דוגמאות-חוזה — ירוק');
