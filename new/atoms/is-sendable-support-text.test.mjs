import { isSendableSupportText } from './is-sendable-support-text.mjs';
// שקע-ניקוי אמיתי כמוסכמת-maor (מקומי לבדיקה — הבדיקה מייבאת רק את האטום שלה)
const SUPPORT_MSG_MAX = 2000;
const sanitize = (raw) => (raw ?? '').replace(/\s+$/u, '').replace(/^\s+/u, '').slice(0, SUPPORT_MSG_MAX);
const C = [
  ['שלום', true],
  ['  היי  ', true], // רווחי-קצה לא פוסלים
  ['', false],
  ['   ', false], // רק-רווחים ⇒ ריק אחרי ניקוי
  ['\n\t', false],
];
let f = 0;
for (const [a, w] of C) {
  const g = isSendableSupportText(a, sanitize);
  if (g !== w) { console.error(`✗ ${JSON.stringify(a)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
// שקע-זקיף: האטום סומך על השקע בלבד (חוק-5)
if (isSendableSupportText('שלום', () => '') !== false) {
  console.error('✗ שקע-זקיף ()⇒\'\' — ציפינו false'); f = 1;
}
if (f) process.exit(1);
console.log('✓ is-sendable-support-text: 6 דוגמאות-חוזה — ירוק');
