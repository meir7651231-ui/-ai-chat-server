import { normalizePrices as __pure_normalizePrices } from './normalize-prices.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_normalizePrices_NORMALIZE_PRICES_T = {
  k1: "object",
  k2: "number",
};
const normalizePrices = (...a) => __pure_normalizePrices(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_normalizePrices_NORMALIZE_PRICES_T);
// שקעי-דמה כדוגמאות-החוזה (הבדיקה מייבאת רק את האטום שלה).
const ALL_MODULES = ['families', 'courses'];
const DEFAULT_INTEGRATION_PRICES = { whatsapp: 50, ai: 120 };
const DEFAULT_PRICES = {
  base: 290,
  modules: { families: 0, courses: 120 },
  integrations: DEFAULT_INTEGRATION_PRICES,
  sizeMult: { small: 1, medium: 1.6, large: 2.4 },
  setup: 1500,
  enterprise: { oneTime: 55000, annualMaintenance: 9000 },
};
const norm = (raw) => normalizePrices(raw, ALL_MODULES, DEFAULT_PRICES, DEFAULT_INTEGRATION_PRICES);
let f = 0;
const eq = (name, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g !== w) { console.error(`✗ ${name}: ${g} ≠ ${w}`); f = 1; }
};

// 1. raw=null ⇒ טבלת-ברירות-המחדל המלאה
eq('דוגמה 1 (null ⇒ ברירות-מחדל)', norm(null), {
  base: 290,
  modules: { families: 0, courses: 120 },
  integrations: { whatsapp: 50, ai: 120 },
  sizeMult: { small: 1, medium: 1.6, large: 2.4 },
  setup: 1500,
  enterprise: { oneTime: 55000, annualMaintenance: 9000 },
});
// 2. שלילי נדחה
eq('דוגמה 2 (שלילי)', norm({ base: -5 }).base, 290);
// 3. אפס מתקבל
const r3 = norm({ base: 350, modules: { courses: 0 } });
eq('דוגמה 3 (אפס חוקי)', [r3.base, r3.modules.courses], [350, 0]);
// 4. מחרוזת/NaN נדחים
const r4 = norm({ base: '100', sizeMult: { small: NaN } });
eq('דוגמה 4 (מחרוזת/NaN)', [r4.base, r4.sizeMult.small], [290, 1]);
// 5. מפתח-מודול זר נזרק
eq('דוגמה 5 (מודול זר)', norm({ modules: { shop: 999 } }).modules, { families: 0, courses: 120 });
// 6. הרחבות — רק מפתחות ברירת-המחדל
eq('דוגמה 6 (הרחבה זרה)', norm({ integrations: { whatsapp: 70, junk: 5 } }).integrations, { whatsapp: 70, ai: 120 });
// 7. enterprise חלקי — חסר מושלם מברירת-המחדל
eq('דוגמה 7 (enterprise חלקי)', norm({ enterprise: { oneTime: 40000 } }).enterprise, { oneTime: 40000, annualMaintenance: 9000 });

if (f) process.exit(1);
console.log('✓ normalize-prices: 7 דוגמאות-חוזה — ירוק');
