import { waBirthdayText } from './wa-birthday-text.mjs';
// שקעי-אמת מקומיים כהתנהגות maor (הבדיקה מייבאת רק את האטום שלה):
const DEFS = { 'wa.birthday': 'מזל טוב ל{first} ליום ההולדת! 🎂 באהבה, {org}' };
const renderTemplate = (cfg, key, vars) => {
  const def = DEFS[key] ?? '';
  let t = (cfg?.templates?.[key] ?? '').trim() || def;
  for (const [k, v] of Object.entries(vars)) t = t.split('{' + k + '}').join(v);
  return t;
};
const orgOf = (orgName) => orgName.trim() || 'העמותה';
const C = [
  ['מאור החסד', 'שרה', undefined, 'מזל טוב לשרה ליום ההולדת! 🎂 באהבה, מאור החסד'],
  ['  ', 'דוד', undefined, 'מזל טוב לדוד ליום ההולדת! 🎂 באהבה, העמותה'],
  ['מאור', '', undefined, 'מזל טוב ל ליום ההולדת! 🎂 באהבה, מאור'],
  ['מאור', 'שרה', { templates: { 'wa.birthday': '{first} — מזל טוב מ{org} 🎈' } }, 'שרה — מזל טוב ממאור 🎈'],
];
let f = 0;
for (const [org, first, cfg, w] of C) {
  const g = waBirthdayText(org, first, cfg, renderTemplate, orgOf);
  if (g !== w) { console.error(`✗ (${org},${first}) ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ wa-birthday-text: 4 דוגמאות-חוזה — ירוק');
