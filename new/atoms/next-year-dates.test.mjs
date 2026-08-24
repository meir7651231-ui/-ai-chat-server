import { nextYearDates } from './next-year-dates.mjs';
// שקעי-תאריכים אמיתיים כמוסכמת-maor (מקומיים לבדיקה — הבדיקה מייבאת רק את האטום שלה).
const atNoon = (iso) => new Date(`${iso}T12:00:00`);
const toIso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const C = [
  ['דוגמה 1', '2025-09-01', '2026-06-30', { start: '2026-09-01', end: '2027-06-30' }],
  ['דוגמה 2 (29.2 מתגלגל)', '2024-02-29', '2024-06-30', { start: '2025-03-01', end: '2025-06-30' }],
  ['דוגמה 3 (חציית-מאה)', '1999-12-31', '2000-01-05', { start: '2000-12-31', end: '2001-01-05' }],
  ['דוגמה 4 (זהים)', '2026-01-01', '2026-01-01', { start: '2027-01-01', end: '2027-01-01' }],
];
let f = 0;
for (const [name, s, e, want] of C) {
  const g = nextYearDates(s, e, atNoon, toIso);
  if (JSON.stringify(g) !== JSON.stringify(want)) {
    console.error(`✗ ${name}: ${JSON.stringify(g)} ≠ ${JSON.stringify(want)}`);
    f = 1;
  }
}
if (f) process.exit(1);
console.log('✓ next-year-dates: 4 דוגמאות-חוזה — ירוק');
