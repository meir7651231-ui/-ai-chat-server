import { supScoreBins as __pure_supScoreBins } from './sup-score-bins.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_sup_score_bins_T = {
  k1: 10,
  k2: 100,
};
const supScoreBins = (...a) => __pure_supScoreBins(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_sup_score_bins_T);
const byScore = (sp) => sp.score;
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// 1) רשימה ריקה — תמיד 10 סלים
ok(eq(supScoreBins([], 3.7, byScore), [0,0,0,0,0,0,0,0,0,0]), 'דוגמה 1: לא 10 אפסים');
// 2) 130⇒סל1 · 580⇒סל5 · 1000⇒נצמד לסל9
ok(eq(supScoreBins([{ score: 130 }, { score: 580 }, { score: 1000 }], 3.7, byScore),
  [0,1,0,0,0,1,0,0,0,1]), 'דוגמה 2: פיזור שגוי');
// 3) שניים באותו סל עליון
ok(eq(supScoreBins([{ score: 999 }, { score: 950 }], 3.7, byScore),
  [0,0,0,0,0,0,0,0,0,2]), 'דוגמה 3: סל-9 ≠ 2');
// 4) ציון 0 ⇒ סל 0
ok(eq(supScoreBins([{ score: 0 }], 3.7, byScore), [1,0,0,0,0,0,0,0,0,0]), 'דוגמה 4: סל-0 ≠ 1');
// 5) ה-rate זורם לשקע: מפורש 4 ⇒ סל 4; ברירת-מחדל 3.7 ⇒ סל 3
const byRate = (sp, r) => r * 100;
ok(eq(supScoreBins([{}], 4, byRate), [0,0,0,0,1,0,0,0,0,0]), 'דוגמה 5א: rate=4 ≠ סל-4');
ok(eq(supScoreBins([{}], undefined, byRate), [0,0,0,1,0,0,0,0,0,0]), 'דוגמה 5ב: ברירת-מחדל ≠ סל-3');
if (f) process.exit(1);
console.log('✓ sup-score-bins: 5 דוגמאות-חוזה — ירוק');
