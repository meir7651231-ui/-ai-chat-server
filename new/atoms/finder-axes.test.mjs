import { finderAxes as __pure_finderAxes } from './finder-axes.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_finderAxes_FINDER_AXES_T = {
  k1: "city",
  k2: "עיר",
  k3: "comm",
  k4: "קהילה",
  k5: "marital",
  k6: "מצב משפחתי",
  k7: "status",
  k8: "סטטוס",
  k9: "cred",
  k10: "entity.cred",
  k11: "אמינות",
  k12: "kids",
  k13: "ילדים",
  k14: "enrolled",
  k15: "nav.courses",
  k16: "חוגים",
  k17: "sefach",
  k18: "ספח מלא",
  k19: "lang",
  k20: "שפה",
};
const finderAxes = (...a) => __pure_finderAxes(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_finderAxes_FINDER_AXES_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// 1) termOf של ברירות-מחדל ⇒ תוויות-המקור
const fb = (_c, _k, fallback) => fallback;
let a = finderAxes({}, fb);
ok(a.length === 9, 'דוגמה 1: האורך ≠ 9');
ok(a[0][0] === 'city' && a[0][1] === 'עיר', "דוגמה 1: [0] ≠ ['city','עיר']");
ok(a[4][0] === 'cred' && a[4][1] === 'אמינות', "דוגמה 1: [4] ≠ ['cred','אמינות']");
ok(a[6][0] === 'enrolled' && a[6][1] === 'חוגים', "דוגמה 1: [6] ≠ ['enrolled','חוגים']");
ok(a[8][0] === 'lang' && a[8][1] === 'שפה', "דוגמה 1: [8] ≠ ['lang','שפה']");
// 2) מילון שממפה nav.courses ⇒ רק תווית-enrolled מתחלפת
const dict = { 'nav.courses': 'שיעורים' };
const termOf = (_c, k, fallback) => dict[k] ?? fallback;
a = finderAxes({}, termOf);
ok(a[6][1] === 'שיעורים', "דוגמה 2: [6] לא קיבל 'שיעורים' מהמילון");
ok(a[4][1] === 'אמינות', 'דוגמה 2: cred זז מברירת-המחדל');
// 3) סדר-המפתחות המחייב
ok(a.map((x) => x[0]).join(',') === 'city,comm,marital,status,cred,kids,enrolled,sefach,lang',
  'דוגמה 3: סדר-הצירים השתנה');

if (f) process.exit(1);
console.log('✓ finder-axes: 3 דוגמאות-חוזה — ירוק');
