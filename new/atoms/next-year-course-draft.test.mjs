import { nextYearCourseDraft } from './next-year-course-draft.mjs';
// שקעים מקומיים לבדיקה בהתנהגות-המקור (הבדיקה מייבאת רק את האטום שלה).
const atNoon = (iso) => new Date(`${iso}T12:00:00`);
const toIso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const nextYearDates = (start, end) => {
  const shift = (iso) => { const d = atNoon(iso); d.setFullYear(d.getFullYear() + 1); return toIso(d); };
  return { start: shift(start), end: shift(end) };
};
const academicYearLabel = (iso) => {
  const d = atNoon(iso);
  const y = d.getFullYear();
  const startYear = d.getMonth() >= 8 ? y : y - 1;
  return `${startYear}/${String((startYear + 1) % 100).padStart(2, '0')}`;
};
let f = 0;
const eq = (name, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g !== w) { console.error(`✗ ${name}: ${g} ≠ ${w}`); f = 1; }
};

// 1 + 4. שדות מועתקים + טוהר-המקור
const src1 = { id: 'c1', name: 'ציור', start: '2025-09-01', end: '2026-06-30', weekday: 2, time: '17:00' };
const r1 = nextYearCourseDraft(src1, 'c7', nextYearDates, academicYearLabel);
eq('דוגמה 1', r1, { id: 'c7', name: 'ציור', start: '2026-09-01', end: '2027-06-30', weekday: 2, time: '17:00', year: '2026/27', prevYearId: 'c1' });
eq('דוגמה 4 (טוהר — src לא נגע)', src1, { id: 'c1', name: 'ציור', start: '2025-09-01', end: '2026-06-30', weekday: 2, time: '17:00' });

// 2. דריסת year/prevYearId ישנים
const r2 = nextYearCourseDraft({ id: 'c2', name: 'נגרות', start: '2026-09-01', end: '2027-06-30', year: '2026/27', prevYearId: 'c1' }, 'c9', nextYearDates, academicYearLabel);
eq('דוגמה 2', [r2.id, r2.start, r2.end, r2.year, r2.prevYearId], ['c9', '2027-09-01', '2028-06-30', '2027/28', 'c2']);

// 3. פתיחה בינואר ⇒ שנה"ל של השנה הקודמת
const r3 = nextYearCourseDraft({ id: 'c3', name: 'קיץ', start: '2026-01-10', end: '2026-03-10' }, 'c4', nextYearDates, academicYearLabel);
eq('דוגמה 3', [r3.start, r3.year], ['2027-01-10', '2026/27']);

if (f) process.exit(1);
console.log('✓ next-year-course-draft: 4 דוגמאות-חוזה — ירוק');
