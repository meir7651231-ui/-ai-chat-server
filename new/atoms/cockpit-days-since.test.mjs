import { cockpitDaysSince as __pure_cockpitDaysSince } from './cockpit-days-since.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_cockpit_days_since_T = {
  k1: 86400000,
};
const cockpitDaysSince = (...a) => __pure_cockpitDaysSince(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_cockpit_days_since_T);
// Golden — נלכד מהרצת האטום על קלטים מייצגים + קצוות (ריק/לא-תקין/מעברי-חודש/שנה מעוברת).
// Infinity ⇒ JSON "null" (כמו במקור). דין שנה-מעוברת: 2024-02-28→03-01 = 2 ימים.
const CASES = [
  [['', ''], 'null'],
  [['2026-08-26', '2026-08-26'], '0'],
  [['2026-08-20', '2026-08-26'], '6'],
  [['2026-08-27', '2026-08-26'], '-1'],
  [['2026-07-26', '2026-08-26'], '31'],
  [['bad', '2026-08-26'], 'null'],
  [['2026-08-26', ''], 'null'],
  [['2024-02-28', '2024-03-01'], '2'],
  [['2026-02-28', '2026-03-01'], '1'],
  [['2025-12-31', '2026-01-01'], '1'],
];
let f = 0;
for (const [args, want] of CASES) {
  const got = JSON.stringify(cockpitDaysSince(...args));
  if (got !== want) { console.error('✗ ' + JSON.stringify(args) + ' ⇒ ' + got + ' ≠ ' + want); f = 1; }
}
if (f) process.exit(1);
console.log('✓ cockpit-days-since: ' + CASES.length + ' הקלטות-Golden — ירוק');
