import { providerClearer as __pure_providerClearer } from './provider-clearer.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_providerClearer_PROVIDER_CLEARER_T = {
  k1: "סולה",
  k2: "נדרים",
};
const providerClearer = (...a) => __pure_providerClearer(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_providerClearer_PROVIDER_CLEARER_T);
const C = [['sola', 'סולה'], ['SolaPay', 'סולה'], ['nedarim', 'נדרים'], [undefined, 'נדרים'], ['', 'נדרים'], ['שטויות', 'נדרים']];
let f = 0;
for (const [a, w] of C) {
  const g = providerClearer(a);
  if (g !== w) { console.error(`✗ ${JSON.stringify(a)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ provider-clearer: 6 דוגמאות-חוזה — ירוק (באג-הסולה 23.8 שמור)');
