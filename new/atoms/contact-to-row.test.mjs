import { contactToRow } from './contact-to-row.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// 1) כרטיס מלא
const r1 = contactToRow({
  fullName: ' יוסי כהן ',
  phones: [{ value: '050-1234567' }, { value: '02-6543210' }, { value: '03-999' }],
  emails: ['yossi@a.com', 'b@b.com'],
  address: 'ירושלים', org: 'עמותת אור', title: 'גזבר', note: 'ידיד',
});
ok(r1.name === 'יוסי כהן', '1: השם לא עבר trim');
ok(r1.phone === '050-1234567' && r1.phone2 === '02-6543210', '1: טלפונים שגויים');
ok(r1.email === 'yossi@a.com' && r1.address === 'ירושלים', '1: מייל/כתובת שגויים');
ok(r1.notes === '🏢 עמותת אור · גזבר · ידיד', '1: notes ≠ "🏢 עמותת אור · גזבר · ידיד" (קיבלנו "' + r1.notes + '")');
// 2) מינימלי
const r2 = contactToRow({ fullName: 'דנה', phones: [], emails: [], address: '' });
ok(r2.phone === '' && r2.phone2 === '' && r2.email === '' && r2.notes === '', '2: שדות-חסרים ≠ ריק');
// 3) תפקיד בלבד
const r3 = contactToRow({ fullName: 'א', phones: [], emails: [], address: '', org: '', title: 'יועצת', note: '' });
ok(r3.notes === 'יועצת', '3: notes ≠ "יועצת" (קיבלנו "' + r3.notes + '")');
// 4) ארגון+הערה בלי תפקיד
const r4 = contactToRow({ fullName: 'ב', phones: [], emails: [], address: '', org: 'אחווה', note: 'מרץ 2026' });
ok(r4.notes === '🏢 אחווה · מרץ 2026', '4: notes ≠ "🏢 אחווה · מרץ 2026" (קיבלנו "' + r4.notes + '")');
if (f) process.exit(1);
console.log('✓ contact-to-row: 4 דוגמאות-חוזה — ירוק');
