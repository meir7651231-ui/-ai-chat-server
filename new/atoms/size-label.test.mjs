import { sizeLabel } from './size-label.mjs';
// שקע-נתונים: ORG_SIZES (ערכי-אמת מ-maor/src/lib/signupWizard.ts:18-22)
const sizes = [
  { id: 'small', label: 'קטן' },
  { id: 'medium', label: 'בינוני' },
  { id: 'large', label: 'גדול' },
];
const C = [
  ['small', 'קטן'],
  ['medium', 'בינוני'],
  ['large', 'גדול'],
  ['no-such', 'no-such'],
  [undefined, '—'],
  ['', ''], // נאמן-למקור: ?? תופס רק null/undefined — מחרוזת-ריקה חוזרת כמו-שהיא
];
let f = 0;
for (const [id, w] of C) {
  const g = sizeLabel(id, sizes);
  if (g !== w) { console.error(`✗ ${JSON.stringify(id)} ⇒ ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ size-label: 6 דוגמאות-חוזה — ירוק');
