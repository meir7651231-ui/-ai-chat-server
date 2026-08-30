import { waPaymentText as __pure_waPaymentText } from './wa-payment-text.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_waPaymentText_WA_PAYMENT_TEXT_T = {
  k1: "wa.payment",
};
const waPaymentText = (...a) => __pure_waPaymentText(...a, ...Array(Math.max(0, 6 - a.length)).fill(undefined), __d_waPaymentText_WA_PAYMENT_TEXT_T);
// שקעי-אמת מקומיים כהתנהגות maor (הבדיקה מייבאת רק את האטום שלה):
// renderTemplate — lib/templates.ts:57-66 עם ברירת-המחדל של 'wa.payment'
const DEFS = { 'wa.payment': 'שלום, תזכורת ידידותית מ{org}: יתרה לתשלום עבור {what} — ₪{amount}. תודה רבה!' };
const renderTemplate = (cfg, key, vars) => {
  const def = DEFS[key] ?? '';
  let t = (cfg?.templates?.[key] ?? '').trim() || def;
  for (const [k, v] of Object.entries(vars)) t = t.split('{' + k + '}').join(v);
  return t;
};
// orgOf — wa.ts:47-49
const orgOf = (orgName) => orgName.trim() || 'העמותה';
const C = [
  ['מאור החסד', 'חוג ציור', 350, undefined,
    'שלום, תזכורת ידידותית ממאור החסד: יתרה לתשלום עבור חוג ציור — ₪350. תודה רבה!'],
  ['מאור החסד', 'כרטיסייה', 1234.6, undefined,
    'שלום, תזכורת ידידותית ממאור החסד: יתרה לתשלום עבור כרטיסייה — ₪1,235. תודה רבה!'],
  ['', 'חוג ציור', 80, undefined,
    'שלום, תזכורת ידידותית מהעמותה: יתרה לתשלום עבור חוג ציור — ₪80. תודה רבה!'],
  ['מאור', 'שחייה', 12500, undefined,
    'שלום, תזכורת ידידותית ממאור: יתרה לתשלום עבור שחייה — ₪12,500. תודה רבה!'],
  ['מאור', 'ציור', 90, { templates: { 'wa.payment': '{what}: {amount} ({org})' } }, 'ציור: 90 (מאור)'],
  ['מאור', 'ציור', 90, { templates: { 'wa.payment': '  ' } },
    'שלום, תזכורת ידידותית ממאור: יתרה לתשלום עבור ציור — ₪90. תודה רבה!'],
];
let f = 0;
for (const [org, what, bal, cfg, w] of C) {
  const g = waPaymentText(org, what, bal, cfg, renderTemplate, orgOf);
  if (g !== w) { console.error(`✗ (${org},${what},${bal}) ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ wa-payment-text: 6 דוגמאות-חוזה — ירוק');
