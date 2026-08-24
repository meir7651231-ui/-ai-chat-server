import { renderTemplate } from './render-template.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(a === b, msg + ` ⇒ ${JSON.stringify(a)}`);

const DEFS = [{ key: 'wa.delivery', def: 'שלום {name}, משלוח מ{org} בדרך אליכם היום 🚚' }];

// 1) בלי דריסה — ברירת-מחדל + החלפת-משתנים
eq(renderTemplate(undefined, 'wa.delivery', { name: 'רחל', org: 'מאור' }, DEFS),
  'שלום רחל, משלוח ממאור בדרך אליכם היום 🚚', 'ברירת-מחדל שגויה');

// 2) דריסת-ארגון גוברת
eq(renderTemplate({ templates: { 'wa.delivery': 'היי {name}!' } }, 'wa.delivery', { name: 'דנה' }, DEFS),
  'היי דנה!', 'דריסת-ארגון לא גברה');

// 3) דריסה ריקה/רווחים ⇒ ברירת-המחדל
eq(renderTemplate({ templates: { 'wa.delivery': '  ' } }, 'wa.delivery', { name: 'רחל', org: 'מאור' }, DEFS),
  'שלום רחל, משלוח ממאור בדרך אליכם היום 🚚', 'דריסה-ריקה לא נפלה לברירת-מחדל');

// 4) משתנה לא-מסופק נשאר כפי-שהוא
eq(renderTemplate(undefined, 'wa.delivery', { name: 'רחל' }, DEFS),
  'שלום רחל, משלוח מ{org} בדרך אליכם היום 🚚', 'משתנה-חסר לא נשאר');

// 5) מפתח לא-מוכר ⇒ ''
eq(renderTemplate(undefined, 'wa.none', { x: '1' }, DEFS), '', 'מפתח לא-מוכר לא החזיר ריק');

// 6) כל המופעים מוחלפים
eq(renderTemplate({ templates: { 'wa.delivery': '{name} {name}' } }, 'wa.delivery', { name: 'אב' }, DEFS),
  'אב אב', 'לא כל המופעים הוחלפו');

if (f) process.exit(1);
console.log('✓ render-template: 6 דוגמאות-חוזה — ירוק');
