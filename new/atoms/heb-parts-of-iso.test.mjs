import { hebPartsOfIso } from './heb-parts-of-iso.mjs';
// שקע-hebParts אמיתי עם מונה-קריאות (מקומי לבדיקה — הבדיקה מייבאת רק את האטום שלה)
const fmtParts = new Intl.DateTimeFormat('en-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric' });
let calls = 0;
function hebParts(d) {
  calls++;
  const parts = fmtParts.formatToParts(d);
  const get = (t) => parts.find((p) => p.type === t)?.value ?? '';
  return { day: +get('day'), month: get('month'), year: +get('year') };
}
let f = 0;
const p1 = hebPartsOfIso('2026-08-24', hebParts);
if (!(p1.day === 11 && p1.month === 'Elul' && p1.year === 5786)) { console.error('✗ אלול: ' + JSON.stringify(p1)); f = 1; }
const p2 = hebPartsOfIso('2026-04-02', hebParts);
if (!(p2.day === 15 && p2.month === 'Nisan' && p2.year === 5786)) { console.error('✗ פסח: ' + JSON.stringify(p2)); f = 1; }
// מימואיזציה: אותה מחרוזת שוב ⇒ אפס קריאה נוספת, אותו אובייקט
const before = calls;
const p1b = hebPartsOfIso('2026-08-24', hebParts);
if (calls !== before) { console.error('✗ מימואיזציה: hebParts נקרא שוב'); f = 1; }
if (p1b !== p1) { console.error('✗ מימואיזציה: אובייקט שונה'); f = 1; }
// זנב-שעה: מפתח נפרד (קריאה נוספת) אך אותם רכיבים
const p1c = hebPartsOfIso('2026-08-24T23:59:00', hebParts);
if (!(p1c.day === 11 && p1c.month === 'Elul')) { console.error('✗ חיתוך-זנב: ' + JSON.stringify(p1c)); f = 1; }
// תקרת-מטמון 3000: מציפים במפתחות שונים ⇒ מפתח ותיק מחושב מחדש (המטמון נוקה)
const cheap = () => { calls++; return { day: 1, month: 'Tishri', year: 5786 }; };
for (let i = 0; i < 3001; i++) hebPartsOfIso('fill-' + i, cheap);
const afterFill = calls;
hebPartsOfIso('2026-08-24', hebParts);
if (calls !== afterFill + 1) { console.error('✗ תקרה: המפתח הוותיק היה אמור להתחשב מחדש אחרי ניקוי'); f = 1; }
if (f) process.exit(1);
console.log('✓ heb-parts-of-iso: רכיבים מול הלוח + מימואיזציה + חיתוך-זנב + תקרת-3000 — ירוק');
