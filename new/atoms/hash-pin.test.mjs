import { hashPin } from './hash-pin.mjs';
// המלח שמחווט maor (מקומי לבדיקה — הבדיקה מייבאת רק את האטום שלה)
const SALT = 'maor.lock.v1::';
const C = [
  ['1234', 'c4891e76dc712dd3dd24f7409c935524c99ea8a4fc677e76a260f33ed6d78c20'],
  ['0000', 'bdedd3bab37144fe1536d5c7481c18624ed1c0de572a5978049b2553aa16a47d'],
  ['87654321', 'ea82e3faa05f2bf3cb024f49bc0c27d885213f6323cb32f8b8d746309672f6f5'],
];
let f = 0;
for (const [pin, want] of C) {
  const got = await hashPin(pin, SALT);
  if (got !== want) { console.error(`✗ ${pin} ⇒ ${got} ≠ ${want}`); f = 1; }
  if (got.length !== 64) { console.error(`✗ ${pin}: אורך ${got.length} ≠ 64`); f = 1; }
}
// דטרמיניזם: אותו קלט פעמיים ⇒ אותו פלט
if ((await hashPin('1234', SALT)) !== (await hashPin('1234', SALT))) { console.error('✗ דטרמיניזם'); f = 1; }
// המלח משנה את הגיבוב
if ((await hashPin('1234', 'x::')) === C[0][1]) { console.error('✗ מלח-שונה ⇒ פלט-זהה'); f = 1; }
if (f) process.exit(1);
console.log('✓ hash-pin: 3 גיבובי-חוזה + דטרמיניזם + רגישות-מלח — ירוק');
