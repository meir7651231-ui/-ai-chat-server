import { taskStatsFor as __pure_taskStatsFor } from './task-stats-for.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_task_stats_for_T = {
  k1: 10,
  k2: 86400000,
};
const taskStatsFor = (...a) => __pure_taskStatsFor(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_task_stats_for_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
// שקעים כהתנהגות-המקור (worktasks.ts)
const tid = (email) => {
  const e = (email ?? '').trim().toLowerCase();
  return e || 'מקומי';
};
const tover = (t, todayIso) => !t.doneAt && !!t.due && t.due < todayIso;
const today = '2026-08-24';
// 1) ריק ⇒ אפסים
ok(eq(taskStatsFor([], 'a@x.co', today, tid, tover), { open: 0, overdue: 0, done: 0, doneWeek: 0 }), 'דוגמה 1: ריק לא אפסים');
// 2) תמהיל מלא + סינון עובדת-אחרת
const s2 = taskStatsFor(
  [
    { assignee: 'a@x.co' },
    { assignee: 'a@x.co', due: '2026-08-20' },
    { assignee: 'a@x.co', doneAt: '2026-08-23T09:00' },
    { assignee: 'a@x.co', doneAt: '2026-08-10T09:00' },
    { assignee: 'b@x.co', due: '2026-08-01' },
  ],
  'a@x.co', today, tid, tover,
);
ok(eq(s2, { open: 2, overdue: 1, done: 2, doneWeek: 1 }), 'דוגמה 2: תמהיל שגוי — ' + JSON.stringify(s2));
// 3) גבול-השבוע: 6 ימים בפנים, 7 בחוץ
const s3a = taskStatsFor([{ assignee: 'a@x.co', doneAt: '2026-08-18' }], 'a@x.co', today, tid, tover);
ok(s3a.done === 1 && s3a.doneWeek === 1, 'דוגמה 3: diff=6 לא נספר לשבוע');
const s3b = taskStatsFor([{ assignee: 'a@x.co', doneAt: '2026-08-17' }], 'a@x.co', today, tid, tover);
ok(s3b.done === 1 && s3b.doneWeek === 0, 'דוגמה 3: diff=7 נספר לשבוע');
// 4) doneAt עתידי ⇒ done בלי doneWeek
const s4 = taskStatsFor([{ assignee: 'a@x.co', doneAt: '2026-08-25' }], 'a@x.co', today, tid, tover);
ok(s4.done === 1 && s4.doneWeek === 0, 'דוגמה 4: doneAt עתידי נספר לשבוע');
// 5) נרמול-זהות
const s5 = taskStatsFor([{ assignee: ' A@X.co ' }], 'a@x.co', today, tid, tover);
ok(s5.open === 1, 'דוגמה 5: זהות לא נורמלה');
// 6) ריק/חסר ⇒ 'מקומי' בשני הצדדים
const s6 = taskStatsFor([{}], '', today, tid, tover);
ok(s6.open === 1, "דוגמה 6: 'מקומי' לא הותאם");
if (f) process.exit(1);
console.log('✓ task-stats-for: 6 דוגמאות-חוזה — ירוק');
