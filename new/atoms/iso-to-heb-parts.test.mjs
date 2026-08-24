import { isoToHebParts } from './iso-to-heb-parts.mjs';
// שקעים אמיתיים כמוסכמת-maor (מקומיים לבדיקה — הבדיקה מייבאת רק את האטום שלה)
const fmtParts = new Intl.DateTimeFormat('en-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric' });
const hebParts = (d) => {
  if (isNaN(d.getTime())) return { day: 0, month: '', year: 0 };
  const parts = fmtParts.formatToParts(d);
  const get = (t) => parts.find((p) => p.type === t)?.value ?? '';
  return { day: +get('day'), month: get('month'), year: +get('year') };
};
const HE = { Tishri: 'תשרי', Heshvan: 'חשוון', Kislev: 'כסלו', Tevet: 'טבת', Shevat: 'שבט', Adar: 'אדר', 'Adar I': 'אדר א׳', 'Adar II': 'אדר ב׳', Nisan: 'ניסן', Iyar: 'אייר', Sivan: 'סיוון', Tamuz: 'תמוז', Av: 'אב', Elul: 'אלול' };
const monthHeOf = (en) => HE[en] ?? '';

const C = [
  ['2026-08-06', { day: 23, monthHe: 'אב', year: 5786 }],
  ['2026-09-12', { day: 1, monthHe: 'תשרי', year: 5787 }], // ראש-השנה
  ['2025-03-14', { day: 14, monthHe: 'אדר', year: 5785 }],
  ['שטויות', null],
  ['2026-8-6', null], // בלי ריפוד — נכשל ב-regex
  ['9999-99-99', null], // עובר-regex אך Date לא-חוקי
];
let f = 0;
for (const [a, w] of C) {
  const g = isoToHebParts(a, hebParts, monthHeOf);
  if (JSON.stringify(g) !== JSON.stringify(w)) {
    console.error(`✗ ${a} ⇒ ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`); f = 1;
  }
}
// חודש שהשקע לא מכיר (monthHeOf ⇒ '') ⇒ null
if (isoToHebParts('2026-08-06', hebParts, () => '') !== null) {
  console.error('✗ חודש-לא-מוכר — ציפינו null'); f = 1;
}
if (f) process.exit(1);
console.log('✓ iso-to-heb-parts: 7 דוגמאות-חוזה — ירוק');
