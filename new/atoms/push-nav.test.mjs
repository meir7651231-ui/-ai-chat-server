import { pushNav as __pure_pushNav } from './push-nav.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v2; בדיקה לא מייבאת אטום-שכן)
const __d_pushNav_NAV_HIST_MAX = 20;
const pushNav = (...a) => __pure_pushNav(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_pushNav_NAV_HIST_MAX);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// 1) מחסנית ריקה
ok(eq(pushNav([], 'A'), ['A']), 'דוגמה 1: [] + A ≠ [A]');

// 2) סדר נשמר, הנדחף אחרון
ok(eq(pushNav(['A', 'B'], 'C'), ['A', 'B', 'C']), 'דוגמה 2: הסדר/המיקום שגויים');

// 3) תקרת 20 — הישן ביותר נזרק
{
  const h20 = Array.from({ length: 20 }, (_, i) => 'v' + (i + 1));
  const out = pushNav(h20, 'v21');
  ok(out.length === 20, 'דוגמה 3: אורך ' + out.length + ' ≠ 20');
  ok(out[0] === 'v2', 'דוגמה 3: הראשון ' + out[0] + ' ≠ v2 (v1 היה אמור להיזרק)');
  ok(out[19] === 'v21', 'דוגמה 3: האחרון ' + out[19] + ' ≠ v21');
}

// 4) אורך 19 ⇒ 20, אף איבר לא נזרק
{
  const h19 = Array.from({ length: 19 }, (_, i) => 'v' + (i + 1));
  const out = pushNav(h19, 'v20');
  ok(out.length === 20 && out[0] === 'v1', 'דוגמה 4: מתחת לתקרה נזרק איבר בטעות');
}

// 5) טוהר — הקלט לא משתנה
{
  const h = ['A', 'B'];
  pushNav(h, 'C');
  ok(h.length === 2 && h[0] === 'A' && h[1] === 'B', 'דוגמה 5: הקלט המקורי השתנה');
}

process.exit(f);
