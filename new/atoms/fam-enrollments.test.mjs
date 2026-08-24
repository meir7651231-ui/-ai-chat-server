import { famEnrollments } from './fam-enrollments.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const fam = { members: [{ id: 'm1' }, { id: 'm2' }] };
// 1) סינון לפי בני-המשפחה בלבד
const r1 = famEnrollments({ enrollments: [{ memberId: 'm1', courseId: 'c1' }, { memberId: 'm3', courseId: 'c1' }] }, fam);
ok(eq(r1, [{ memberId: 'm1', courseId: 'c1' }]), 'שיבוץ-זר נכנס או של-הבית נפל');
// 2) בלי סינון-סטטוס — ended+wait נכללים
const r2 = famEnrollments({ enrollments: [{ memberId: 'm1', status: 'ended' }, { memberId: 'm2', status: 'wait' }] }, fam);
ok(r2.length === 2, 'ended/wait סוננו — אסור (זו ההיסטוריה המלאה)');
// 3) משפחה בלי בנים
ok(eq(famEnrollments({ enrollments: [{ memberId: 'm1' }] }, { members: [] }), []), 'members:[] ⇒ חייב []');
// 4) enrollments ריק
ok(eq(famEnrollments({ enrollments: [] }, fam), []), 'enrollments:[] ⇒ חייב []');
// 5) סדר-המקור נשמר
const e5 = [{ memberId: 'm2', n: 1 }, { memberId: 'm1', n: 2 }, { memberId: 'm2', n: 3 }];
ok(eq(famEnrollments({ enrollments: e5 }, fam).map((x) => x.n), [1, 2, 3]), 'הסדר שובש');
// 6) זהות-הפניה
const one = { memberId: 'm1' };
ok(famEnrollments({ enrollments: [one] }, fam)[0] === one, 'הרשומה הועתקה במקום זהות-הפניה');
if (f) process.exit(1);
console.log('✓ fam-enrollments: 6 דוגמאות-חוזה — ירוק');
