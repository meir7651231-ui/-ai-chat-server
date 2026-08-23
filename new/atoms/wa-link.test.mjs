import { waLink } from './wa-link.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// שקע-דמה לפי החוזה: '050-123-4567' ⇒ '972501234567', כל השאר ⇒ null
const dig = (p) => (p === '050-123-4567' ? '972501234567' : null);
const C = [
  ['050-123-4567', '', 'https://wa.me/972501234567'],
  ['לא-טלפון', 'היי', null],
  ['050-123-4567', 'שלום', 'https://wa.me/972501234567?text=%D7%A9%D7%9C%D7%95%D7%9D'],
  ['050-123-4567', '  היי  ', 'https://wa.me/972501234567?text=%D7%94%D7%99%D7%99'],
  ['050-123-4567', '   ', 'https://wa.me/972501234567'],
  ['050-123-4567', 'hi there', 'https://wa.me/972501234567?text=hi%20there'],
];
for (const [phone, text, want] of C) {
  const got = waLink(phone, text, dig);
  ok(got === want, `waLink(${JSON.stringify(phone)}, ${JSON.stringify(text)}) ⇒ ${got} ≠ ${want}`);
}
// השקע מקבל את phone כלשונו
{
  let seen = null;
  waLink('050-123-4567', '', (p) => { seen = p; return null; });
  ok(seen === '050-123-4567', 'השקע לא קיבל את phone כלשונו: ' + seen);
}
if (f) process.exit(1);
console.log('✓ wa-link: 6 דוגמאות-חוזה + אימות-שקע — ירוק (waDigits מוזרק, אפס import פנימי)');
