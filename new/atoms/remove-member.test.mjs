import { removeMember } from './remove-member.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ` ⇒ ${JSON.stringify(a)}`);
const nrm = (e) => e.trim().toLowerCase();

// 1) הסרה מ-members ומ-memberConfigs אחרי נירמול המייל
const org1 = { members: ['a@b.com', 'c@d.com'], memberConfigs: { 'a@b.com': { limited: true } } };
eq(removeMember(org1, '  A@B.com ', nrm), { members: ['c@d.com'], memberConfigs: {} }, 'הסרה+נירמול שגויה');

// 2) רשומת-עבר לא-מנורמלת מוסרת גם היא
eq(removeMember({ members: [' A@b.com ', 'c@d.com'] }, 'a@b.com', nrm).members,
  ['c@d.com'], 'צורה גולמית לא הוסרה');

// 3) מייל שאינו חבר — אין-שינוי-תוכן
eq(removeMember({ members: ['x@y.com'], memberConfigs: { 'x@y.com': { limited: false } } }, 'z@w.com', nrm),
  { members: ['x@y.com'], memberConfigs: { 'x@y.com': { limited: false } } }, 'לא-חבר שינה תוכן');

// 4) org ריק
eq(removeMember({}, 'a@b.com', nrm), { members: [], memberConfigs: {} }, 'org ריק לא טופל');

// 5) immutability — הארגון הנכנס לא שוכתב
eq(org1.members, ['a@b.com', 'c@d.com'], 'org.members שוכתב');
ok('a@b.com' in org1.memberConfigs, 'org.memberConfigs שוכתב');

if (f) process.exit(1);
console.log('✓ remove-member: 5 דוגמאות-חוזה — ירוק');
