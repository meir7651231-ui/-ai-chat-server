// בדיקת-חוזה · hok-effectively-active — מוכיחה את 7 דוגמאות-החוזה. מייבאת רק את האטום-שלה.
import { hokEffectivelyActive as __pure_hokEffectivelyActive } from './hok-effectively-active.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_hokEffectivelyActive_HOK_EFFECTIVELY_ACTIVE_T = {
  k1: "נדרים",
  k2: "סולה",
  k3: 12,
};
const hokEffectivelyActive = (...a) => __pure_hokEffectivelyActive(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_hokEffectivelyActive_HOK_EFFECTIVELY_ACTIVE_T);

const T = '2026-08-24';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// 1) בלי hok / דגל כבוי
ok(hokEffectivelyActive({}, T) === false, 'בלי hok לא false');
ok(hokEffectivelyActive({ hok: { active: false } }, T) === false, 'active:false לא false');
// 2) הו"ק ידני — לפי הדגל בלבד
ok(hokEffectivelyActive({ hok: { active: true, day: 10 } }, T) === true, 'הו"ק ידני פעיל לא true');
// 3) kevaId בלי hist — סומכים על הדגל
ok(hokEffectivelyActive({ hok: { active: true, kevaId: 'k1' } }, T) === true, 'keva בלי hist לא true');
// 4) חיוב-נדרים לפני 2 חודשים בדיוק — על הסף ≤2
ok(hokEffectivelyActive({ hok: { active: true, kevaId: 'k1' }, hist: [{ clearer: 'נדרים', d: '2026-06-15' }] }, T) === true,
  '2 חודשים (סף) לא true');
// 5) חיוב-נדרים לפני 3 חודשים — פגה
ok(hokEffectivelyActive({ hok: { active: true, kevaId: 'k1' }, hist: [{ clearer: 'נדרים', d: '2026-05-20' }] }, T) === false,
  '3 חודשים לא false');
// 6) 🐛 נחיל-סולה C7 — חיוב-סולה טרי מחיה
ok(hokEffectivelyActive({
  hok: { active: true, kevaId: 'k1' },
  hist: [{ clearer: 'נדרים', d: '2026-04-10' }, { clearer: 'סולה', d: '2026-07-15' }],
}, T) === true, 'חיוב-סולה טרי לא החיה (C7)');
// 7) חיוב שאינו נדרים/סולה לא מחיה
ok(hokEffectivelyActive({
  hok: { active: true, kevaId: 'k1' },
  hist: [{ clearer: 'אשראי', d: '2026-08-01' }, { clearer: 'נדרים', d: '2026-03-01' }],
}, T) === false, 'חיוב-אשראי החיה בטעות');

if (f) process.exit(1);
console.log('✓ hok-effectively-active: 7 דוגמאות-חוזה — ירוק');
