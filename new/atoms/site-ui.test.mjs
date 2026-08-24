import { siteUi } from './site-ui.mjs';
// שקע-נתונים: תת-קבוצה מערכי-האמת של site-ui-labels (מוצהרים בבדיקה עצמה —
// הבדיקה רשאית לייבא אך ורק את האטום שלה; זהות-הערכים למקור נאכפת בבדיקת site-ui-labels)
const UI = {
  he: { donate: 'לתרומה', goal: 'יעד', dir: 'rtl' },
  en: { donate: 'Donate', goal: 'Goal', dir: 'ltr' },
  yi: { donate: 'שפּענדן', goal: 'ציל', dir: 'rtl' },
};
const C = [
  ['he', 'donate', UI, 'לתרומה'],
  ['en', 'goal', UI, 'Goal'],
  ['yi', 'dir', UI, 'rtl'],
  ['fr', 'donate', UI, 'לתרומה'], // שפה לא-מוכרת ⇒ מילון-he
  ['en', 'no-such', UI, ''], // מפתח שאינו קיים באף מילון
  ['en', 'shalom', { he: { shalom: 'שלום' }, en: {} }, 'שלום'], // מפתח חסר באנגלית ⇒ הערך העברי
];
let f = 0;
for (const [lang, key, labels, w] of C) {
  const g = siteUi(lang, key, labels);
  if (g !== w) {
    console.error(`✗ ('${lang}','${key}') ⇒ ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`);
    f = 1;
  }
}
if (f) process.exit(1);
console.log('✓ site-ui: 6 דוגמאות-חוזה — ירוק');
