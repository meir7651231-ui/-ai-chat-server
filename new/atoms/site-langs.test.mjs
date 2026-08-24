import { siteLangs } from './site-langs.mjs';
// שקע-נתונים: SITE_LANGS (ערכי-אמת מ-maor/src/types/config.ts:65)
const KNOWN = ['he', 'en', 'yi'];
const C = [
  [{ langs: ['en', 'he'] }, ['en', 'he']], // הסדר של הקונפיג נשמר
  [{ langs: ['he', 'he', 'en'] }, ['he', 'en']], // כפולים מוסרים
  [{ langs: ['fr', 'en'] }, ['en']], // לא-מוכרת מסוננת
  [{ langs: ['fr'] }, ['he']], // הכול סונן ⇒ ברירת-מחדל
  [{ langs: [] }, ['he']], // רשימה ריקה
  [undefined, ['he']], // אין site
  [{}, ['he']], // site בלי langs
];
let f = 0;
for (const [site, w] of C) {
  const g = siteLangs(site, KNOWN);
  if (JSON.stringify(g) !== JSON.stringify(w)) {
    console.error(`✗ ${JSON.stringify(site)} ⇒ ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`);
    f = 1;
  }
}
if (f) process.exit(1);
console.log('✓ site-langs: 7 דוגמאות-חוזה — ירוק');
