import { finderAxisValue as __pure_finderAxisValue } from './finder-axis-value.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_finderAxisValue_FINDER_AXIS_VALUE_T = {
  k1: "city",
  k2: "comm",
  k3: "marital",
  k4: "לא ידוע",
  k5: "status",
  k6: "cred",
  k7: "kids",
  k8: "עם ילדים",
  k9: "בלי ילדים",
  k10: "enrolled",
  k11: "משתתפות ב",
  k12: "nav.courses",
  k13: "חוגים",
  k14: "לא משתתפות",
  k15: "sefach",
  k16: "קיים",
  k17: "חסר",
  k18: "lang",
  k19: 700,
};
const finderAxisValue = (...a) => __pure_finderAxisValue(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_finderAxisValue_FINDER_AXIS_VALUE_T);
// שקעי-ייחוס כמוסכמת-maor (מקומיים לבדיקה)
const STATUS_META = {
  active: { label: 'פעילה' },
  pending: { label: 'ממתינה' },
  inactive: { label: 'לא פעילה' },
};
const tierOf = (score) => {
  if (score >= 950) return { label: 'טיטאן' };
  if (score >= 800) return { label: 'לביאה' };
  if (score >= 500) return { label: 'טעון שיפור' };
  return { label: 'סיכון נטישה' };
};
const dict = { 'nav.courses': 'שיעורים' };
const termOf = (_c, k, fb) => dict[k] ?? fb;
let liveList = [];
const famLiveEnrollments = () => liveList;
const S = { termOf, tierOf, famLiveEnrollments, STATUS_META };
const db = {};
const base = { status: 'active', members: [] };

let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const V = (fam, axis, config) => finderAxisValue(db, { ...base, ...fam }, axis, config, S);

// 1) city
ok(V({ city: 'צפת' }, 'city') === 'צפת', "דוגמה 1: city ≠ 'צפת'");
ok(V({}, 'city') === '', "דוגמה 1: city חסר ≠ ''");
// 2) marital חסר
ok(V({}, 'marital') === 'לא ידוע', "דוגמה 2: marital חסר ≠ 'לא ידוע'");
// 3) status דרך STATUS_META
ok(V({ status: 'active' }, 'status') === 'פעילה', "דוגמה 3: status ≠ 'פעילה'");
// 4) cred — ברירת-מחדל 700 · ציון 960
ok(V({}, 'cred') === 'טעון שיפור', "דוגמה 4: cred חסר ≠ 'טעון שיפור'");
ok(V({ cred: { score: 960 } }, 'cred') === 'טיטאן', "דוגמה 4: score=960 ≠ 'טיטאן'");
// 5) kids
ok(V({ members: [{ isParent: true }, { isParent: false }] }, 'kids') === 'עם ילדים', 'דוגמה 5: עם ילדים');
ok(V({ members: [{ isParent: true }] }, 'kids') === 'בלי ילדים', 'דוגמה 5: בלי ילדים');
// 6) enrolled — עם/בלי config, עם/בלי שיבוץ-חי
liveList = [{ id: 'e1' }];
ok(V({}, 'enrolled') === 'משתתפות בחוגים', 'דוגמה 6: בלי config ≠ משתתפות בחוגים');
ok(V({}, 'enrolled', {}) === 'משתתפות בשיעורים', 'דוגמה 6: עם מילון ≠ משתתפות בשיעורים');
liveList = [];
ok(V({}, 'enrolled', {}) === 'לא משתתפות', "דוגמה 6: אין שיבוץ ≠ 'לא משתתפות'");
// 7) ציר לא-מוכר
ok(V({}, 'foo') === '', "דוגמה 7: ציר-זר ≠ ''");

if (f) process.exit(1);
console.log('✓ finder-axis-value: 7 דוגמאות-חוזה — ירוק');
