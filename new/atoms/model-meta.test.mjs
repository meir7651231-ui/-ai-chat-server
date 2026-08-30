import { modelMeta as __pure_modelMeta } from './model-meta.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_modelMeta_MODEL_META_T = {
  k1: "punch",
  k2: "כרטיסייה · ",
  k3: " ניקובים",
  k4: "#fdf1d4",
  k5: "half_year",
  k6: "מנוי חצי-שנתי",
  k7: "#e7edf5",
  k8: "year",
  k9: "מנוי שנתי",
  k10: "#efe7f3",
  k11: "#7c3aed",
  k12: "מנוי חודשי",
};
const modelMeta = (...a) => __pure_modelMeta(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_modelMeta_MODEL_META_T);
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// 1) כרטיסייה — size משובץ
chk('1 punch size=10', eq(modelMeta({ model: 'punch', size: 10 }),
  { label: 'כרטיסייה · 10 ניקובים', bg: '#fdf1d4', c: '#9a6414' }));

// 2) חצי-שנתי
chk('2 half_year', eq(modelMeta({ model: 'half_year' }),
  { label: 'מנוי חצי-שנתי', bg: '#e7edf5', c: '#3a5a86' }));

// 3) שנתי
chk('3 year', eq(modelMeta({ model: 'year' }),
  { label: 'מנוי שנתי', bg: '#efe7f3', c: '#7c3aed' }));

// 4) חודשי — ענף ברירת-המחדל
chk('4 monthly ברירת-מחדל', eq(modelMeta({ model: 'monthly' }),
  { label: 'מנוי חודשי', bg: '#e4f5ea', c: '#12803c' }));

// 5) model לא-מוכר/חסר — אותה ברירת-מחדל
chk('5 model חסר ⇒ חודשי', eq(modelMeta({ model: undefined }),
  { label: 'מנוי חודשי', bg: '#e4f5ea', c: '#12803c' }));

// 6) punch size=1 — שיבוץ ישיר בלי דין-יחיד
chk('6 punch size=1', modelMeta({ model: 'punch', size: 1 }).label === 'כרטיסייה · 1 ניקובים');

if (f) process.exit(1);
console.log('✓ model-meta: 6 דוגמאות-חוזה — ירוק');
