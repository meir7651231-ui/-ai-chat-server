import { timeToMin as __pure_timeToMin } from './time-to-min.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_time_to_min_T = {
  k1: 60,
};
const timeToMin = (...a) => __pure_timeToMin(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_time_to_min_T);
const C = [
  ['9:30', 570], ['00:00', 0], ['23:59', 1439], [' 12:05 ', 725],
  ['9:5', NaN], ['930', NaN], ['', NaN], [null, NaN],
];
let f = 0;
for (const [t, w] of C) {
  const g = timeToMin(t);
  const ok = Number.isNaN(w) ? Number.isNaN(g) : g === w;
  if (!ok) { console.error(`✗ timeToMin(${JSON.stringify(t)}) = ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1); console.log('✓ time-to-min: 8 דוגמאות-חוזה — ירוק');
