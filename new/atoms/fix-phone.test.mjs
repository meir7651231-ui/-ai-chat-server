import { fixPhone } from './fix-phone.mjs';
// שקע-ייחוס: formatIsraeliPhone כלשונו מ-maor/src/lib/validate.ts (מקומי לבדיקה)
const formatIsraeliPhone = (raw) => {
  const s = String(raw || '').trim();
  let d = s.replace(/\D/g, '');
  if (d.startsWith('00972')) d = '0' + d.slice(5);
  else if (d.startsWith('972')) d = '0' + d.slice(3);
  if (!d) return s;
  if (d[0] === '0') {
    if (d.length === 10) return d.slice(0, 3) + '-' + d.slice(3);
    if (d.length === 9) return d.slice(0, 2) + '-' + d.slice(2);
    return d;
  }
  if (d.length === 9) return '0' + d.slice(0, 2) + '-' + d.slice(2);
  if (d.length === 8) return '0' + d[0] + '-' + d.slice(1);
  return s;
};
const C = [
  ['0501234567', '050-1234567'],
  ['+972-50-1234567', '050-1234567'],
  ['025551234', '02-5551234'],
  ['81234567', '08-1234567'],
  ['', ''],
  ['abc', 'abc'],
];
let f = 0;
for (const [a, w] of C) {
  const g = fixPhone(a, formatIsraeliPhone);
  if (g !== w) { console.error(`✗ ${JSON.stringify(a)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ fix-phone: 6 דוגמאות-חוזה — ירוק (איחוד-הכפילות של maor נשמר)');
