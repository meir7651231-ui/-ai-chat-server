import { freshenDemoDb as __pure_freshenDemoDb } from './freshen-demo-db.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_freshen_demo_db_T = {
  k1: 86400000,
  k2: 10,
};
const freshenDemoDb = (...a) => __pure_freshenDemoDb(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_freshen_demo_db_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// שקע isoLocal — פורמט מקומי בלי הזחת-אזור-זמן (כמו date-util של maor)
const p2 = (n) => String(n).padStart(2, '0');
const isoLocal = (d) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
const db = {
  families: [{ id: 'f1', birth: '1990-01-01' }],
  courses: [{ id: 'c1', start: '2026-08-01', end: '2026-12-30' }],
  events: [{ id: 'ev1', date: '2026-08-30' }],
  distributionDays: [{ id: 'd1', date: '2026-08-03', createdAt: '2026-08-02' }],
  enrollments: [{ id: 'e1', dueDate: '', enrolledAt: '2026-08-01' }],
};
const out = freshenDemoDb(db, '2026-08-05', '2026-08-02', isoLocal);
// 1) חוג — הזזה 3 ימים + גלגול-שנה
ok(out.courses[0].start === '2026-08-04', `start ⇒ ${out.courses[0].start}`);
ok(out.courses[0].end === '2027-01-02', `end (גלגול-שנה) ⇒ ${out.courses[0].end}`);
// 2) אירוע — גלגול-חודש
ok(out.events[0].date === '2026-09-02', `event date ⇒ ${out.events[0].date}`);
// 3) יום-חלוקה — date+createdAt
ok(out.distributionDays[0].date === '2026-08-06', `dist date ⇒ ${out.distributionDays[0].date}`);
ok(out.distributionDays[0].createdAt === '2026-08-05', `dist createdAt ⇒ ${out.distributionDays[0].createdAt}`);
// 4) שיבוץ — ריק נשאר, enrolledAt מוזז
ok(out.enrollments[0].dueDate === '', 'dueDate ריק השתנה');
ok(out.enrollments[0].enrolledAt === '2026-08-04', `enrolledAt ⇒ ${out.enrollments[0].enrolledAt}`);
// 5) דלתא 0 — אותה רפרנס
ok(freshenDemoDb(db, '2026-08-02', '2026-08-02', isoLocal) === db, 'דלתא 0 לא החזירה אותו db');
// 6) families לא ממופה + המקור קדוש
ok(out.families === db.families, 'families מופה בטעות');
ok(db.courses[0].start === '2026-08-01' && db.events[0].date === '2026-08-30', 'המקור השתנה');
if (f) process.exit(1);
console.log('✓ freshen-demo-db: 6 דוגמאות-חוזה (10 בדיקות) — ירוק');
