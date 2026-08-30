import { waDeliveryText as __pure_waDeliveryText } from './wa-delivery-text.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_waDeliveryText_WA_DELIVERY_TEXT_T = {
  k1: "wa.delivery",
  k2: "משפחת ",
};
const waDeliveryText = (...a) => __pure_waDeliveryText(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_waDeliveryText_WA_DELIVERY_TEXT_T);
// שקעי-אמת מקומיים כהתנהגות maor (הבדיקה מייבאת רק את האטום שלה):
// renderTemplate — lib/templates.ts:57-66 עם ברירת-המחדל של 'wa.delivery'
const DEFS = { 'wa.delivery': 'שלום {name}, משלוח מ{org} בדרך אליכם היום 🚚' };
const renderTemplate = (cfg, key, vars) => {
  const def = DEFS[key] ?? '';
  let t = (cfg?.templates?.[key] ?? '').trim() || def;
  for (const [k, v] of Object.entries(vars)) t = t.split('{' + k + '}').join(v);
  return t;
};
// orgOf — wa.ts:47-49
const orgOf = (orgName) => orgName.trim() || 'העמותה';
const C = [
  ['מאור החסד', 'כהן', undefined, 'שלום משפחת כהן, משלוח ממאור החסד בדרך אליכם היום 🚚'],
  ['', 'לוי', undefined, 'שלום משפחת לוי, משלוח מהעמותה בדרך אליכם היום 🚚'],
  ['מאור החסד', '', undefined, 'שלום משפחת, משלוח ממאור החסד בדרך אליכם היום 🚚'],
  ['מאור', 'לוי', { templates: { 'wa.delivery': 'היי {name} — מ-{org}!' } }, 'היי משפחת לוי — מ-מאור!'],
  ['מאור', 'לוי', { templates: { 'wa.delivery': '  ' } }, 'שלום משפחת לוי, משלוח ממאור בדרך אליכם היום 🚚'],
];
let f = 0;
for (const [org, fam, cfg, w] of C) {
  const g = waDeliveryText(org, fam, cfg, renderTemplate, orgOf);
  if (g !== w) { console.error(`✗ (${org},${fam}) ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ wa-delivery-text: 5 דוגמאות-חוזה — ירוק');
