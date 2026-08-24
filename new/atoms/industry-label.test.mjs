import { industryLabel } from './industry-label.mjs';
// שקע-נתונים: תת-קבוצה של WIZARD_INDUSTRIES (ערכי-אמת מ-maor/src/lib/verticalPacks.ts)
const industries = [
  { id: 'chesed', label: 'עמותת חסד' },
  { id: 'clinic', label: 'קליניקה' },
];
const C = [
  ['chesed', 'עמותת חסד'],
  ['clinic', 'קליניקה'],
  ['no-such', 'no-such'],
  [undefined, '—'],
  ['', ''], // נאמן-למקור: ?? תופס רק null/undefined — מחרוזת-ריקה חוזרת כמו-שהיא
];
let f = 0;
for (const [id, w] of C) {
  const g = industryLabel(id, industries);
  if (g !== w) { console.error(`✗ ${JSON.stringify(id)} ⇒ ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ industry-label: 5 דוגמאות-חוזה — ירוק');
