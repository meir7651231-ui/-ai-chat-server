import { buildCourseDailyRows as __pure_buildCourseDailyRows } from './build-course-daily-rows.mjs';
const __d_buildCourseDailyRows_BUILD_COURSE_DAILY_ROWS_T = {
  k1: "תאריך עברי",
  k2: "תאריך לועזי",
  k3: "יום",
  k4: "קבוצה/שעה",
  k5: "סטטוס יום",
  k6: "תלמידה פעילה",
  k7: "entity.family",
  k8: "משפחה",
  k9: "סטטוס נוכחות",
  k10: "קבוצה",
  k11: "wait",
  k12: "ended",
  k13: "אין רשומות",
  k14: "paused",
  k15: "מוקפא",
  k16: "מתקיים",
  k17: "לא הופיעה",
  k18: "חיסור",
  k19: "פעיל",
};
// צילום-מקומי מ-build-course-daily-rows-data + עטיפת-כריכה (מנוע-הטיהור v2; בדיקה לא מייבאת אטום-שכן)
const DAY_NAMES = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const buildCourseDailyRows = (...a) => __pure_buildCourseDailyRows(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), DAY_NAMES, __d_buildCourseDailyRows_BUILD_COURSE_DAILY_ROWS_T);

// שקעים מקומיים לבדיקה
const hebDateFull = (iso) => 'ע:' + iso;
const termOf = (cfg, k, fb) => cfg.terms?.[k] ?? fb;

let f = 0;
const eq = (name, got, want) => {
  if (JSON.stringify(got) !== JSON.stringify(want)) { console.error(`✗ ${name}:\n  ${JSON.stringify(got)}\n≠ ${JSON.stringify(want)}`); f = 1; }
};

const db1 = {
  families: [
    { id: 'f1', name: 'פרץ', members: [{ id: 'm1', first: 'רות' }, { id: 'm2', first: 'יעל' }] },
    { id: 'f2', name: 'גל', members: [{ id: 'm3', first: 'נעמי' }, { id: 'm4', first: 'תמר' }] },
  ],
  enrollments: [
    { courseId: 'c1', memberId: 'm1', status: 'active', enrolledAt: '2026-08-01', absences: [{ date: '2026-08-30', reason: 'מחלה' }] },
    { courseId: 'c1', memberId: 'm2', status: 'wait', absences: [] },
    { courseId: 'c1', memberId: 'm3', status: 'ended', endedAt: '2026-08-30', enrolledAt: '2026-08-01', absences: [{ date: '2026-08-23', noshow: true }] },
    { courseId: 'c1', memberId: 'm4', status: 'paused', absences: [] },
  ],
};
const c1 = { id: 'c1', start: '2026-08-23', end: '2026-08-30', weekday: 0, time: '16:00' };

// דוגמה 1
const r1 = buildCourseDailyRows(c1, db1, undefined, termOf, hebDateFull);
eq('1 · days', r1.days, 2);
eq('1 · rows.length', r1.rows.length, 6);
eq('1 · רות 23.8', r1.rows[1], ['ע:2026-08-23', '23/08/2026', 'ראשון', 'קבוצה · 16:00', 'מתקיים', 'רות', 'פרץ', 'פעיל']);
eq('1 · נעמי 23.8 noshow', r1.rows[2], ['ע:2026-08-23', '23/08/2026', 'ראשון', 'קבוצה · 16:00', 'מתקיים', 'נעמי', 'גל', 'לא הופיעה']);
eq('1 · תמר 23.8 מוקפא', r1.rows[3], ['ע:2026-08-23', '23/08/2026', 'ראשון', 'קבוצה · 16:00', 'מוקפא', 'תמר', 'גל', 'מוקפא']);
eq('1 · רות 30.8 חיסור·סיבה', r1.rows[4], ['ע:2026-08-30', '30/08/2026', 'ראשון', 'קבוצה · 16:00', 'מתקיים', 'רות', 'פרץ', 'חיסור · מחלה']);
eq('1 · תמר 30.8', r1.rows[5][5], 'תמר'); // נעמי איננה ב-30.8, יעל (wait) לא בכלל
eq('1 · אין נעמי/יעל ב-30.8', r1.rows.filter((r) => r[1] === '30/08/2026').map((r) => r[5]), ['רות', 'תמר']);

// דוגמה 2 — termOf על כותרת-המשפחה
const r2 = buildCourseDailyRows(c1, db1, { terms: { 'entity.family': 'לקוח' } }, termOf, hebDateFull);
eq('2 · כותרת עם config', r2.rows[0][6], 'לקוח');
eq('2 · כותרת בלי config', r1.rows[0][6], 'משפחה');

// דוגמה 3 — start ריק
const r3 = buildCourseDailyRows({ id: 'c1', start: '', end: '2026-08-30' }, db1, undefined, termOf, hebDateFull);
eq('3 · start ריק', { n: r3.rows.length, days: r3.days }, { n: 1, days: 0 });

// דוגמה 4 — אין שיבוצים ⇒ 'אין רשומות'
const r4 = buildCourseDailyRows({ id: 'cX', start: '2026-08-23', end: '2026-08-23', weekday: 0, time: '16:00' }, db1, undefined, termOf, hebDateFull);
eq('4 · אין רשומות', r4.rows[1], ['ע:2026-08-23', '23/08/2026', 'ראשון', 'קבוצה · 16:00', 'אין רשומות', '', '', '']);

// דוגמה 5 — קבוצות מרובות: תואמת-label נכנסת לסלוט שלה; חסרת-קבוצה לכל סלוט
const c5 = { id: 'c5', start: '2026-08-23', end: '2026-08-23', sessions: [{ day: 0, time: '10:00', label: 'א' }, { day: 0, time: '12:00', label: 'ב' }] };
const db5 = {
  families: db1.families,
  enrollments: [
    { courseId: 'c5', memberId: 'm1', status: 'active', group: 'א', absences: [] },
    { courseId: 'c5', memberId: 'm3', status: 'active', absences: [] },
  ],
};
const r5 = buildCourseDailyRows(c5, db5, undefined, termOf, hebDateFull);
eq('5 · days', r5.days, 1);
eq('5 · סלוט א', r5.rows.filter((r) => r[3] === 'א · 10:00').map((r) => r[5]), ['רות', 'נעמי']);
eq('5 · סלוט ב', r5.rows.filter((r) => r[3] === 'ב · 12:00').map((r) => r[5]), ['נעמי']);

// דוגמה 6 — קטיעה ב-MAX_DAYS=500
const r6 = buildCourseDailyRows({ id: 'cY', start: '2026-01-04', end: '2036-12-31', weekday: 0, time: '' }, { families: [], enrollments: [] }, undefined, termOf, hebDateFull);
eq('6 · days=500', r6.days, 500);
eq('6 · rows=502', r6.rows.length, 502);
eq('6 · שורת-הקטיעה', r6.rows[501], ['—', '—', '—', '—', 'הדוח נקטע ב-500 ימי מפגש — בדקו את תאריך הסיום של החוג', '', '', '']);

if (f) process.exit(1);
console.log('✓ build-course-daily-rows: 6 דוגמאות-חוזה — ירוק');
