import { isJunkContact } from './is-junk-contact.mjs';
const dig = (s) => (s || '').replace(/\D/g, '');
const C = [
  [{ fullName: '', phones: [{ value: '03-6123456' }], emails: [] }, true],
  [{ fullName: '   ', phones: [], emails: [] }, true],
  [{ fullName: 'מוקד חירום', phones: [{ value: '100' }], emails: [] }, true],
  [{ fullName: 'ישראל כהן', phones: [{ value: '050-1234567' }], emails: [] }, false],
  [{ fullName: 'דנה לוי', phones: [], emails: ['dana@x.co.il'] }, false],
  [{ fullName: 'קו קצר', phones: [{ value: '1-23-45' }], emails: [] }, false],
];
let f = 0;
for (const [a, w] of C) {
  const g = isJunkContact(a, dig);
  if (g !== w) { console.error(`✗ ${JSON.stringify(a)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ is-junk-contact: 6 דוגמאות-חוזה — ירוק');
