import { kitProgress as __pure_kitProgress } from './kit-progress.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_kit_progress_T = {
  k1: 100,
};
const kitProgress = (...a) => __pure_kitProgress(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_kit_progress_T);
let f = 0;
const eqJ = (a, b, msg) => {
  const A = JSON.stringify(a), B = JSON.stringify(b);
  if (A !== B) { console.error(`✗ ${msg}\n  קיבלנו: ${A}\n  ציפינו: ${B}`); f = 1; }
};
const K = (n, done) => Array.from({ length: n }, (_, i) => ({ label: 'שלב ' + i, done: i < done }));

// 1) 3 מתוך 5 ⇒ 60%, לא מוכן
eqJ(kitProgress({ kit: K(5, 3) }), { done: 3, total: 5, pct: 60, ready: false }, '1: 3/5');

// 2) הכול סומן ⇒ 100%, מוכן-למסירה
eqJ(kitProgress({ kit: K(3, 3) }), { done: 3, total: 3, pct: 100, ready: true }, '2: 3/3');

// 3) עיגול מטה — 1/3 ⇒ 33
eqJ(kitProgress({ kit: K(3, 1) }).pct, 33, '3: 1/3 ≠ 33');

// 4) עיגול מעלה — 2/3 ⇒ 67
eqJ(kitProgress({ kit: K(3, 2) }).pct, 67, '4: 2/3 ≠ 67');

// 5) ערכה ריקה — ריק אינו "מוכן"
eqJ(kitProgress({ kit: [] }), { done: 0, total: 0, pct: 0, ready: false }, '5: ערכה ריקה');

// 6) null / undefined / בלי kit ⇒ אותו פלט-ריק
const empty = { done: 0, total: 0, pct: 0, ready: false };
eqJ(kitProgress(null), empty, '6: null');
eqJ(kitProgress(undefined), empty, '6: undefined');
eqJ(kitProgress({}), empty, '6: בלי kit');

if (f) process.exit(1);
console.log('✓ kit-progress: 6 דוגמאות-חוזה — ירוק');
