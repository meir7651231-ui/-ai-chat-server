import { doneTodayFor as __pure_doneTodayFor } from './done-today-for.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_done_today_for_T = {
  k1: 10,
};
const doneTodayFor = (...a) => __pure_doneTodayFor(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_done_today_for_T);
// שקע מוזרק לפי חוזה task-identity (הבדיקה לא מייבאת אטום אחר — חוק-4)
const taskIdentity = (email) => { const e = (email ?? '').trim().toLowerCase(); return e || 'מקומי'; };
const TODAY = '2026-08-24';
const T1 = { assignee: 'A@x.com', doneAt: '2026-08-24T10:00' };
const T2 = { assignee: 'a@x.com', doneAt: '2026-08-23T23:59' };
const T3 = { assignee: 'a@x.com' };
const T4 = { assignee: 'b@x.com', doneAt: '2026-08-24' };
const C = [
  [[T1], 'a@x.com', 1],
  [[T2], 'a@x.com', 0],
  [[T3], 'a@x.com', 0],
  [[T4], 'a@x.com', 0],
  [[{ doneAt: '2026-08-24' }, { assignee: '', doneAt: '2026-08-24' }], '', 2],
  [[T1, T2, T3, T4], 'a@x.com', 1],
];
let f = 0;
for (const [tasks, id, w] of C) {
  const g = doneTodayFor(tasks, id, TODAY, taskIdentity);
  if (g !== w) { console.error(`✗ doneTodayFor(${JSON.stringify(tasks)}, '${id}') = ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ done-today-for: 6 דוגמאות-חוזה (זהות-מוזרקת) — ירוק');
