import { approveMember } from './approve-member.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ` ⇒ ${JSON.stringify(a)}`);
const nrm = (e) => e.trim().toLowerCase();

// 1) הקיים נורמל, החדש צורף מנורמל
const org1 = { members: ['A@b.com '] };
eq(approveMember(org1, 'c@D.com', nrm), { members: ['a@b.com', 'c@d.com'] }, 'צירוף+נירמול שגוי');

// 2) כפילות לא נוספת פעמיים
eq(approveMember({ members: ['a@b.com'] }, '  A@B.com ', nrm), { members: ['a@b.com'] }, 'כפילות נוספה');

// 3) org בלי members
eq(approveMember({}, 'x@y.co.il', nrm), { members: ['x@y.co.il'] }, 'org ריק לא טופל');

// 4) כפילי-עבר מאוחדים בנירמול
eq(approveMember({ members: ['a@b.com', ' A@b.com '] }, 'c@d.com', nrm),
  { members: ['a@b.com', 'c@d.com'] }, 'כפיל-עבר לא אוחד');

// 5) immutability — הארגון הנכנס לא שוכתב
eq(org1.members, ['A@b.com '], 'org הנכנס שוכתב');

if (f) process.exit(1);
console.log('✓ approve-member: 5 דוגמאות-חוזה — ירוק');
