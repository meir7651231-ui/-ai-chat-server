import { stepScale as __pure_stepScale } from './step-scale.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_step_scale_T = {
  k1: 10,
};
const stepScale = (...a) => __pure_stepScale(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_step_scale_T);

// שקע-clampScale אמיתי כקוד-המקור (מקומי לבדיקה — הבדיקה מייבאת רק את האטום שלה)
const clampScale = (v) => {
  if (!Number.isFinite(v)) return 1;
  return Math.min(1.6, Math.max(0.8, v));
};

const C = [
  ['1: צעד למעלה', [1.0, 1], 1.1],
  ['2: הוכחת-עיגול 1.1+0.1', [1.1, 1], 1.2],
  ['3: תקרה 1.6', [1.6, 1], 1.6],
  ['4: רצפה 0.8', [0.8, -1], 0.8],
  ['5: קלט-חורג מוצמד קודם', [2.5, 1], 1.6],
  ['6: NaN ⇒ 1 ואז צעד', [NaN, 1], 1.1],
  ['7: צעד למטה', [1.3, -1], 1.2],
];
let f = 0;
for (const [n, [v, dir], want] of C) {
  const got = stepScale(v, dir, clampScale);
  // דוגמה-2 דורשת שוויון-ביטים מדויק (הוכחת-העיגול) — === מספיק לכולן
  if (got !== want) { console.error(`✗ ${n}: ${got} ≠ ${want}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ step-scale: 7 דוגמאות-חוזה — ירוק');
