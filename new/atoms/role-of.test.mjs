import { roleOf as __pure_roleOf } from './role-of.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_roleOf_ROLE_OF_T = {
  k1: "staff",
  k2: "admin",
  k3: "teacher",
};
const roleOf = (...a) => __pure_roleOf(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_roleOf_ROLE_OF_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

const C = { adminEmails: [' Admin@X.com '], roles: { teachers: { ' Tea@X.com ': 't1', 'b@y.com': 't2' } } };

// 1 — admin: ניקוי רישיות+רווחים בצד-הקונפיג
ok(roleOf(C, 'admin@x.com') === 'admin', 'דוגמה 1');
// 2 — teacher: ניקוי גם בצד-הקלט
ok(roleOf(C, '  TEA@x.COM ') === 'teacher', 'דוגמה 2');
// 3 — teacher רגיל
ok(roleOf(C, 'b@y.com') === 'teacher', 'דוגמה 3');
// 4 — לא מוכר ⇒ staff
ok(roleOf(C, 'zar@z.com') === 'staff', 'דוגמה 4');
// 5 — מייל ריק/חסר ⇒ staff לפני הכול
ok(roleOf(C, '') === 'staff', 'דוגמה 5a');
ok(roleOf(C, undefined) === 'staff', 'דוגמה 5b');
// 6 — admin מנצח teacher
const C2 = { adminEmails: ['x@x.com'], roles: { teachers: { 'x@x.com': 't9' } } };
ok(roleOf(C2, 'x@x.com') === 'admin', 'דוגמה 6');
// 7 — קונפיג ריק ⇒ staff, בלי נפילה
ok(roleOf({}, 'a@b.com') === 'staff', 'דוגמה 7');

if (f) process.exit(1);
console.log('✓ role-of: 8 בדיקות-חוזה — ירוק');
