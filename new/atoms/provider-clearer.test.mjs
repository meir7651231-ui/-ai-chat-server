import { providerClearer } from './provider-clearer.mjs';
const C = [['sola', 'סולה'], ['SolaPay', 'סולה'], ['nedarim', 'נדרים'], [undefined, 'נדרים'], ['', 'נדרים'], ['שטויות', 'נדרים']];
let f = 0;
for (const [a, w] of C) {
  const g = providerClearer(a);
  if (g !== w) { console.error(`✗ ${JSON.stringify(a)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ provider-clearer: 6 דוגמאות-חוזה — ירוק (באג-הסולה 23.8 שמור)');
