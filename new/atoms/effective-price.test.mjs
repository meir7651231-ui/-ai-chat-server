import { effectivePrice as __pure_effectivePrice } from './effective-price.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_effective_price_T = {
  k1: 100,
};
const effectivePrice = (...a) => __pure_effectivePrice(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_effective_price_T);
// מימוש-שקע לבדיקה (בקופסה יחווט האטום האמיתי maxDiscountPct):
const maxDiscountPct = (ids, criteria) => {
  let pct = 0;
  for (const id of ids) {
    const c = criteria.find((x) => x.id === id);
    if (c && Number.isFinite(c.discountPct) && c.discountPct > pct) pct = c.discountPct;
  }
  return pct;
};
const criteria = [
  { id: 'c1', discountPct: 30 },
  { id: 'c2', discountPct: 50 },
  { id: 'c3', discountPct: 110 },
];
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const p = (base, ids) => effectivePrice(base, ids, criteria, maxDiscountPct);
ok(p(100, ['c1']) === 70, '100 עם 30% ⇒ 70');
ok(p(100, ['c1', 'c2']) === 50, 'הגבוה מבין הקריטריונים — לא מצטבר');
ok(p(99, ['c1']) === 69, '99·0.7=69.3 ⇒ עיגול 69');
ok(p(100, []) === 100, 'בלי קריטריונים ⇒ מחיר מלא');
ok(p(100, ['c3']) === 0, '110% ⇒ נחסם ב-0, לא שלילי');
ok(p(NaN, ['c1']) === 0, 'בסיס לא-סופי ⇒ 0');
if (f) process.exit(1);
console.log('✓ effective-price: 6 דוגמאות-חוזה — ירוק');
