import { defaultPrices as __pure_defaultPrices } from './default-prices.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_default_prices_T = {
  k1: 290,
  k2: 120,
  k3: 70,
  k4: 180,
  k5: 60,
  k6: 90,
  k7: 80,
  k8: 1500,
  k9: 55000,
  k10: 9000,
};
const defaultPrices = (...a) => __pure_defaultPrices(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_default_prices_T);
let f = 0;
const bad = (msg) => { console.error('✗ ' + msg); f = 1; };
const ip = { ai: 120 };
const t = defaultPrices(ip);
// 1
if (t.base !== 290) bad(`base ⇒ ${t.base} ≠ 290`);
if (t.setup !== 1500) bad(`setup ⇒ ${t.setup} ≠ 1500`);
// 2
const wantModules = { families: 0, calendar: 0, courses: 120, diary: 70, supporters: 180, reports: 60, tzedaka: 90, shop: 90, shop7: 80 };
if (Object.keys(t.modules).length !== 9) bad(`modules — ${Object.keys(t.modules).length} מפתחות ≠ 9`);
for (const [k, v] of Object.entries(wantModules)) if (t.modules[k] !== v) bad(`modules.${k} ⇒ ${t.modules[k]} ≠ ${v}`);
if (Math.max(...Object.values(t.modules)) !== t.modules.supporters) bad('supporters אינו הערך הגבוה ביותר');
// 3
if (JSON.stringify(t.sizeMult) !== JSON.stringify({ small: 1, medium: 1.6, large: 2.4 })) bad(`sizeMult ⇒ ${JSON.stringify(t.sizeMult)}`);
// 4
if (JSON.stringify(t.enterprise) !== JSON.stringify({ oneTime: 55000, annualMaintenance: 9000 })) bad(`enterprise ⇒ ${JSON.stringify(t.enterprise)}`);
// 5
if (t.integrations !== ip) bad('integrations אינו אותה רפרנס של השקע');
if (f) process.exit(1);
console.log('✓ default-prices: 5 דוגמאות-חוזה — ירוק');
