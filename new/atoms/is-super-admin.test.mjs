import { isSuperAdmin } from './is-super-admin.mjs';
// רשימת-דוגמה בלבד (חוק-6 — הרשימה האמיתית היא חיווט-הצבה, לא נשמרת בבדיקה)
const LIST = ['admin@example.org'];
const C = [
  ['admin@example.org', true],
  ['  Admin@Example.ORG  ', true], // trim+lowercase
  ['other@example.org', false],
  ['', false],
  [null, false],
  [undefined, false],
];
let f = 0;
for (const [a, w] of C) {
  const g = isSuperAdmin(a, LIST);
  if (g !== w) { console.error(`✗ ${JSON.stringify(a)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
// רשימה ריקה ⇒ תמיד false
if (isSuperAdmin('admin@example.org', []) !== false) {
  console.error('✗ רשימה ריקה — ציפינו false'); f = 1;
}
if (f) process.exit(1);
console.log('✓ is-super-admin: 7 דוגמאות-חוזה — ירוק');
