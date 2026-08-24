import { verifyPin } from './verify-pin.mjs';
// שקע-דמה דטרמיניסטי כדוגמאות-החוזה (הבדיקה מייבאת רק את האטום שלה)
let calls = 0;
const hashPin = async (p) => { calls++; return 'h#' + p; };
const C = [
  ['1234', 'h#1234', true],
  ['1234', 'h#0000', false],
  ['1234', undefined, false],
  ['1234', '', false],
  ['', 'h#', true],
];
let f = 0;
for (const [pin, hash, w] of C) {
  const g = await verifyPin(pin, hash, hashPin);
  if (g !== w) { console.error(`✗ (${JSON.stringify(pin)},${JSON.stringify(hash)}) ⇒ ${g} ≠ ${w}`); f = 1; }
}
// דוגמה 6: hash חסר ⇒ אפס קריאות לשקע
calls = 0;
await verifyPin('9999', undefined, hashPin);
await verifyPin('9999', '', hashPin);
if (calls !== 0) { console.error(`✗ hash-חסר קרא לשקע ${calls} פעמים (צפוי 0)`); f = 1; }
if (f) process.exit(1);
console.log('✓ verify-pin: 6 דוגמאות-חוזה — ירוק');
