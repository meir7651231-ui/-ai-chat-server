import { isoDaysAgo } from './iso-days-ago.mjs';
// שקע-isoLocal אמיתי כמוסכמת-maor (מקומי לבדיקה — הבדיקה מייבאת רק את האטום שלה)
const p2 = (n) => String(n).padStart(2, '0');
const isoLocalReal = (d) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
const shifted = (days) => { const d = new Date(); d.setDate(d.getDate() - days); return isoLocalReal(d); };

let f = 0;
// דוגמה 2 — שקע-זקיף: הפלט הוא פלט-השקע בלבד
if (isoDaysAgo(5, () => 'X') !== 'X') { console.error('✗ שקע-זקיף — ציפינו X'); f = 1; }
// דוגמאות 1+3 — יחס מול השעון (חישוב לפני+אחרי הקריאה, חסין לחציית-חצות)
for (const days of [0, 7, 31, -1, 10]) {
  const before = shifted(days);
  const got = isoDaysAgo(days, isoLocalReal);
  const after = shifted(days);
  if (got !== before && got !== after) {
    console.error(`✗ days=${days} ⇒ ${got} ∉ {${before}, ${after}}`); f = 1;
  }
}
// דוגמה 3 — ה-Date הנמסר לשקע מוזז N ימים בדיוק (בדיקת-הארגומנט עצמו)
{
  const days = 10;
  const seen = [];
  isoDaysAgo(days, (d) => { seen.push(d); return ''; });
  const want = new Date(); want.setDate(want.getDate() - days);
  const diffMs = Math.abs(want.getTime() - seen[0].getTime());
  if (seen.length !== 1 || diffMs > 5000) {
    console.error(`✗ ה-Date שנמסר לשקע לא מוזז 10 ימים (סטייה ${diffMs}ms)`); f = 1;
  }
}
if (f) process.exit(1);
console.log('✓ iso-days-ago: 7 דוגמאות-חוזה — ירוק');
