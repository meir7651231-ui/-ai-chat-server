import { mergeSupportersByFields } from './merge-supporters-by-fields.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

// שקעים בסמנטיקת-maor (מקומיים לבדיקה — מייבאת רק את האטום שלה)
const mergeSupportersGroup = (keeper, losers) =>
  losers.reduce((acc, l) => ({ ...acc, ils: (acc.ils ?? 0) + (l.ils ?? 0) }), keeper);
const supDupFieldValue = (sups, def, pick, edit) => {
  const edited = edit[def.key];
  if (edited != null) return edited;
  const idx = pick[def.key] ?? sups.findIndex((s) => def.get(s));
  return def.get(sups[idx >= 0 ? idx : 0]);
};
const F = (key) => ({ key, label: key, get: (s) => s[key] || '' });
const SUP_DUP_FIELDS = ['name', 'phone', 'email', 'idNum', 'city', 'address', 'cat', 'forWho', 'notes'].map(F);
const sup = (o) => ({
  name: '', phone: '', email: '', idNum: '', city: '', address: '', cat: '',
  forWho: '', notes: '', ils: 0, ...o,
});

// דוגמה 1 — הכסף מהבסיס-הקבוצתי, לא מהבחירה
{
  const out = mergeSupportersByFields(
    [sup({ name: 'דנה', ils: 100 }), sup({ name: 'דנה לוי', ils: 50 })],
    {}, {}, mergeSupportersGroup, supDupFieldValue, SUP_DUP_FIELDS,
  );
  chk('1 ils=150', out.ils === 150);
}
// דוגמה 2 — pick בוחר רשומה
{
  const out = mergeSupportersByFields(
    [sup({ name: 'דנה' }), sup({ name: 'דנה לוי' })],
    { name: 1 }, {}, mergeSupportersGroup, supDupFieldValue, SUP_DUP_FIELDS,
  );
  chk('2 pick-name', out.name === 'דנה לוי');
}
// דוגמה 3 — edit גובר גם על pick וגם על ערכים מלאים
{
  const out = mergeSupportersByFields(
    [sup({ notes: 'הערה א' }), sup({ notes: 'הערה ב' })],
    { notes: 1 }, { notes: 'ממוזג ידנית' }, mergeSupportersGroup, supDupFieldValue, SUP_DUP_FIELDS,
  );
  chk('3 edit-גובר', out.notes === 'ממוזג ידנית');
}
// דוגמה 4 — ברירת-מחדל: הרשומה הראשונה עם ערך
{
  const out = mergeSupportersByFields(
    [sup({ city: '' }), sup({ city: 'חיפה' })],
    {}, {}, mergeSupportersGroup, supDupFieldValue, SUP_DUP_FIELDS,
  );
  chk('4 ראשון-עם-ערך', out.city === 'חיפה');
}
// דוגמה 5 — שדה לא-מוכר (ils) ברשימת-השקע מדולג; הכסף מוגן
{
  const hostile = [...SUP_DUP_FIELDS, { key: 'ils', label: 'כסף', get: () => '999999' }];
  const out = mergeSupportersByFields(
    [sup({ ils: 100 }), sup({ ils: 50 })],
    {}, {}, mergeSupportersGroup, supDupFieldValue, hostile,
  );
  chk('5 כסף-מוגן', out.ils === 150);
}
if (f) process.exit(1);
console.log('✓ merge-supporters-by-fields: 5 דוגמאות-חוזה — ירוק');
