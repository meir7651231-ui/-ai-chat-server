import { academicYearLabel as __pure_academicYearLabel } from './academic-year-label.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_academic_year_label_T = {
  k1: 100,
};
const academicYearLabel = (...a) => __pure_academicYearLabel(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_academic_year_label_T);
// שקע-atNoon אמיתי כמוסכמת-maor (מקומי לבדיקה — הבדיקה מייבאת רק את האטום שלה)
const atNoon = (iso) => new Date(`${iso}T12:00:00`);
const C = [
  ['2026-09-01', '2026/27'],
  ['2027-06-30', '2026/27'],
  ['2026-08-31', '2025/26'],
  ['2000-09-15', '2000/01'],
  ['1999-01-01', '1998/99'],
  ['2099-10-01', '2099/00'],
];
let f = 0;
for (const [a, w] of C) {
  const g = academicYearLabel(a, atNoon);
  if (g !== w) { console.error(`✗ ${a} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ academic-year-label: 6 דוגמאות-חוזה — ירוק');
