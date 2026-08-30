import { SITE_LANGS, resolveLocalized as __pure_resolveLocalized } from './resolve-localized.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_resolveLocalized_RESOLVE_LOCALIZED_T = {
  k1: "string",
};
const resolveLocalized = (...a) => __pure_resolveLocalized(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_resolveLocalized_RESOLVE_LOCALIZED_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

ok(JSON.stringify(SITE_LANGS) === '["he","en","yi"]', 'SITE_LANGS: ' + JSON.stringify(SITE_LANGS));
// 1 — undefined/null ⇒ ''
ok(resolveLocalized(undefined, 'en') === '', 'דוגמה 1a');
ok(resolveLocalized(null, 'he') === '', 'דוגמה 1b');
// 2 — מחרוזת עוברת כמות-שהיא
ok(resolveLocalized('שלום', 'en') === 'שלום', 'דוגמה 2');
// 3 — השפה המבוקשת קיימת
ok(resolveLocalized({ he: 'שלום', en: 'Hello' }, 'en') === 'Hello', 'דוגמה 3');
// 4 — ערך רווחים-בלבד ⇒ נפילה לעברית
ok(resolveLocalized({ he: 'שלום', en: '   ' }, 'en') === 'שלום', 'דוגמה 4');
// 5 — אין he; הסריקה מדלגת על en הריק ומגיעה ל-yi
ok(resolveLocalized({ en: '', yi: 'העלא' }, 'he') === 'העלא', 'דוגמה 5');
// 6 — מפה ריקה ⇒ ''
ok(resolveLocalized({}, 'yi') === '', 'דוגמה 6');
// 7 — נפילה לעברית לפני הסריקה הכללית
ok(resolveLocalized({ he: 'שלום' }, 'yi') === 'שלום', 'דוגמה 7');

if (f) process.exit(1);
console.log('✓ resolve-localized: 8 בדיקות-חוזה — ירוק');
