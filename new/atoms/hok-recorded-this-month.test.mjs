import { hokRecordedThisMonth as __pure_hokRecordedThisMonth } from './hok-recorded-this-month.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_hokRecordedThisMonth_HOK_RECORDED_THIS_MONTH_T = {
  k1: "נדרים",
  k2: "סולה",
};
const hokRecordedThisMonth = (...a) => __pure_hokRecordedThisMonth(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_hokRecordedThisMonth_HOK_RECORDED_THIS_MONTH_T);
const HOK_CAT = 'הו"ק'; // ערך-השקע כמוסכמת-maor (מקומי לבדיקה)
const T = '2026-08-24';
const hok = { amount: 100, cur: '₪' };
const C = [
  // [תיאור, sp, צפוי]
  ['1 בלי-הו"ק', { donations: [] }, false],
  ['2 קטגוריית-הו"ק', { hok, donations: [{ date: '2026-08-05', cat: 'הו"ק', amount: 50 }] }, true],
  ['3 סכום-מדויק+מטבע-חסר', { hok, donations: [{ date: '2026-08-05', cat: 'כללי', amount: 100 }] }, true],
  ['4 חודש-קודם', { hok, donations: [{ date: '2026-07-30', cat: 'הו"ק', amount: 100 }] }, false],
  ['5 נדרים-בלי-סכום', { hok, donations: [], hist: [{ d: '2026-08-12', clearer: 'נדרים', a: 37 }] }, true],
  ['5ב סולה-בלי-סכום', { hok, donations: [], hist: [{ d: '2026-08-12', clearer: 'סולה', a: 5 }] }, true],
  ['6 hist-לגאסי-סכום-מדויק', { hok, donations: [], hist: [{ d: '2026-08-12', a: 100 }] }, true],
  ['7 hist-סכום-שגוי', { hok, donations: [], hist: [{ d: '2026-08-12', a: 70 }] }, false],
];
let f = 0;
for (const [name, sp, want] of C) {
  const got = hokRecordedThisMonth(sp, T, HOK_CAT);
  if (got !== want) { console.error(`✗ ${name} ⇒ ${got} ≠ ${want}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ hok-recorded-this-month: 8 דוגמאות-חוזה — ירוק');
