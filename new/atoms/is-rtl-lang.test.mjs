import { isRtlLang } from './is-rtl-lang.mjs';
const C = [
  ['he', true],
  ['yi', true],
  ['en', false],
  ['fr', true], // הכלל עיוור — כל מה שאינו 'en'
  ['', true],
];
let f = 0;
for (const [a, w] of C) {
  const g = isRtlLang(a);
  if (g !== w) { console.error(`✗ '${a}' ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ is-rtl-lang: 5 דוגמאות-חוזה — ירוק');
