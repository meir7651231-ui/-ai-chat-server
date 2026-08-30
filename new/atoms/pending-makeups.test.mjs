import { pendingMakeups as __pure_pendingMakeups } from './pending-makeups.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_pendingMakeups_PENDING_MAKEUPS_T = {
  k1: "ended",
  k2: "wait",
};
const pendingMakeups = (...a) => __pure_pendingMakeups(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_pendingMakeups_PENDING_MAKEUPS_T);
const E1 = { id: 'e1', memberId: 'm1', courseId: 'c1', status: 'active', absences: [
  { date: '2026-03-01', reason: 'מחלה', makeup: true },
  { date: '2026-02-01', reason: 'טיול', makeup: false },
] };
const E2 = { id: 'e2', memberId: 'm2', courseId: 'c2', status: 'active', absences: [
  { date: '2026-01-05', reason: 'חג', makeup: true, makeupDate: '2026-04-01' },
] };
const E3 = { id: 'e3', memberId: 'm3', courseId: 'c1', status: 'ended', absences: [
  { date: '2026-01-01', reason: 'x', makeup: true },
] };
const E4 = { id: 'e4', memberId: 'm4', courseId: 'c1', status: 'wait', absences: [
  { date: '2026-01-02', reason: 'y', makeup: true },
] };
const E5 = { id: 'e5', memberId: 'm5', courseId: 'c1', status: 'active', absences: [
  { date: '2026-02-10', reason: 'אירוע', makeup: true },
] };
let f = 0;
// 1+2+3: מיון לא-מתוזמן-קודם, makeup:false מדולג, ended/wait מדולגים
const r1 = pendingMakeups([E1, E2, E3, E4]);
if (r1.length !== 2 || r1[0].enrollmentId !== 'e1' || r1[1].enrollmentId !== 'e2' || r1[1].makeupDate !== '2026-04-01') { console.error('✗ 1 מיון/סינון', r1); f = 1; }
if (r1.some((x) => x.date === '2026-02-01')) { console.error('✗ 2 makeup:false נכלל'); f = 1; }
if (r1.some((x) => x.enrollmentId === 'e3' || x.enrollmentId === 'e4')) { console.error('✗ 3 ended/wait נכללו'); f = 1; }
// 4: סינון פר-חוג + מיון-תאריך בתוך הלא-מתוזמנים
const r2 = pendingMakeups([E1, E2, E5], 'c1');
if (r2.length !== 2 || r2[0].enrollmentId !== 'e5' || r2[1].enrollmentId !== 'e1') { console.error('✗ 4 סינון-חוג/מיון-תאריך', r2); f = 1; }
// 5: שדות-הפריט
const it = r2[1];
if (it.memberId !== 'm1' || it.courseId !== 'c1' || it.date !== '2026-03-01' || it.reason !== 'מחלה' || it.makeupDate !== undefined) { console.error('✗ 5 שדות-פריט', it); f = 1; }
if (f) process.exit(1);
console.log('✓ pending-makeups: 5 דוגמאות-חוזה — ירוק');
