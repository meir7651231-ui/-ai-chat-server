// בדיקת-חוזה (רתמת-זהב) · guide-recipe-swaps — צילום-ערך + מגן-סדר.
import { RECIPE_SWAPS } from './guide-recipe-swaps.mjs';
let f = 0;
const froms = RECIPE_SWAPS.map((r) => r[0]);
for (const from of ['ליד השיבוץ', 'כדי שיבוץ', 'משפחה חדשה', 'חוג מתאים', 'מצא חוג', 'החוג', 'למורה', '← ＋ תרומה', 'תרומה ←'])
  if (!froms.includes(from)) { console.error(`✗ חסרה החלפה '${from}'`); f = 1; }
if (RECIPE_SWAPS.length !== 9) { console.error('✗ מספר-שורות ≠ 9'); f = 1; }
if (froms.indexOf('← ＋ תרומה') > froms.indexOf('תרומה ←')) { console.error('✗ סדר-ההחלפות התהפך'); f = 1; }
if (RECIPE_SWAPS.some((r) => r.length !== 5)) { console.error('✗ שורה ללא 5 שדות'); f = 1; }
if (f) process.exit(1);
console.log('✓ guide-recipe-swaps: 9 שורות · סדר-נשמר · מבנה-5-שדות');
