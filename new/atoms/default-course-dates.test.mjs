import { defaultCourseDates } from './default-course-dates.mjs';
const C = [
  ['2026-08-24', { start: '2026-09-01', end: '2027-07-31' }],
  ['2026-07-31', { start: '2025-09-01', end: '2026-07-31' }],
  ['2026-08-01', { start: '2026-09-01', end: '2027-07-31' }],
  ['2026-09-01', { start: '2026-09-01', end: '2027-07-31' }],
  ['2027-01-15', { start: '2026-09-01', end: '2027-07-31' }],
  ['2031-12-31T23:59:59', { start: '2031-09-01', end: '2032-07-31' }],
];
let f = 0;
for (const [today, want] of C) {
  const got = defaultCourseDates(today);
  if (JSON.stringify(got) !== JSON.stringify(want)) { console.error(`✗ ${today} ⇒ ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`); f = 1; }
}
// 7: תאריך-שבור ⇒ נפילה לשעון-הנוכחי (מחושב דינמית באותו כלל)
{ const now = new Date();
  const sy = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  const want = { start: `${sy}-09-01`, end: `${sy + 1}-07-31` };
  const got = defaultCourseDates('שטויות');
  if (JSON.stringify(got) !== JSON.stringify(want)) { console.error(`✗ תאריך-שבור ⇒ ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`); f = 1; } }
if (f) process.exit(1);
console.log('✓ default-course-dates: 7 דוגמאות-חוזה — ירוק (כולל נפילת-תאריך-שבור)');
