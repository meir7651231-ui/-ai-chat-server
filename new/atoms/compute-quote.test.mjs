import { computeQuote as __pure_computeQuote } from './compute-quote.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_computeQuote_COMPUTE_QUOTE_T = {
  k1: "module",
  k2: "integration",
  k3: "subscription",
};
const computeQuote = (...a) => __pure_computeQuote(...a, ...Array(Math.max(0, 7 - a.length)).fill(undefined), __d_computeQuote_COMPUTE_QUOTE_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const ALL = ['families', 'courses', 'supporters'];
const nameOf = (m) => ({ families: 'משפחות', courses: 'חוגים', supporters: 'תורמים' }[m] ?? m);
const P = {
  base: 290,
  modules: { families: 0, courses: 120, supporters: 180 },
  integrations: { whatsapp: 50 },
  sizeMult: { small: 1, medium: 1.6 },
  setup: 1500,
  enterprise: { oneTime: 55000, annualMaintenance: 9000 },
};
// 1) courses כבוי · small · בלי addons
const q1 = computeQuote({ modules: { courses: false } }, 'small', P, nameOf, ALL);
ok(q1.lines.length === 1 && q1.lines[0].key === 'supporters' && q1.lines[0].price === 180, '1: lines ≠ [supporters@180]');
ok(q1.included.length === 1 && q1.included[0].key === 'families', '1: included ≠ [families@0]');
ok(q1.modulesSubtotal === 180, '1: subtotal ≠ 180');
ok(q1.monthly === 470, '1: monthly ≠ 470 (קיבלנו ' + q1.monthly + ')');
ok(q1.firstPayment === 1970 && q1.yearly === 5640 && q1.yearlyDiscounted === 4700, '1: תשלומים שגויים');
// 2) הכל דלוק · medium · addon וואטסאפ
const q2 = computeQuote({}, 'medium', P, nameOf, ALL, [{ key: 'whatsapp', label: 'וואטסאפ' }]);
ok(q2.lines.map((l) => l.key).join(',') === 'courses,supporters,whatsapp', '2: סדר-שורות שגוי');
ok(q2.lines[2].kind === 'integration' && q2.lines[2].price === 50, "2: whatsapp ≠ integration@50");
ok(q2.modulesSubtotal === 350 && q2.sizeMult === 1.6, '2: subtotal/mult שגויים');
ok(q2.monthly === 1024 && q2.firstPayment === 2524 && q2.yearlyDiscounted === 10240, '2: monthly ≠ 1024 (קיבלנו ' + q2.monthly + ')');
// 3) גודל לא-מוכר ⇒ מכפיל 1
const q3 = computeQuote({}, 'huge', P, nameOf, ALL);
ok(q3.sizeMult === 1 && q3.monthly === 590, '3: נפילת-מכפיל שגויה (monthly=' + q3.monthly + ')');
// 4) הרחבה בלי מחיר ⇒ לא ב-lines
const q4 = computeQuote({ modules: { courses: false, supporters: false } }, 'small', P, nameOf, ALL, [{ key: 'zzz', label: '?' }]);
ok(q4.lines.length === 0, '4: הרחבה במחיר 0 נכנסה ל-lines');
// 5) enterprise + בלי setup
const P5 = { ...P, setup: undefined };
const q5 = computeQuote({}, 'small', P5, nameOf, ALL, [], 'enterprise');
ok(q5.setup === 0 && q5.firstPayment === q5.monthly, '5: setup חסר ≠ 0');
ok(q5.mode === 'enterprise' && q5.enterpriseOneTime === 55000 && q5.enterpriseAnnual === 9000, '5: העברת-enterprise שגויה');
if (f) process.exit(1);
console.log('✓ compute-quote: 5 דוגמאות-חוזה — ירוק');
