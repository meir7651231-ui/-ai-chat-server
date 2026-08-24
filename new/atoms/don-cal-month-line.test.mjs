import { donCalMonthLine } from './don-cal-month-line.mjs';
const inAug = (iso) => typeof iso === 'string' && iso.startsWith('2026-08');
let f = 0;
const eq = (name, got, want) => {
  if (got !== want) { console.error(`✗ ${name}: ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`); f = 1; }
};
// 1 — ריק (בלי config ⇒ השקע לא נקרא)
eq('ריק', donCalMonthLine([], inAug, undefined, undefined), 'אין תרומות מתועדות בחודש זה');
// 2 — שני מטבעות
eq('₪+$', donCalMonthLine([
  { date: '2026-08-05', amount: 100, cur: '₪' },
  { date: '2026-08-10', amount: 50, cur: '$' },
], inAug, undefined, undefined), '2 תרומות החודש · ₪100 + $50');
// 3 — מפריד-אלפים he-IL
eq('אלפים', donCalMonthLine([{ date: '2026-08-05', amount: 1234, cur: '₪' }], inAug, undefined, undefined),
  '1 תרומות החודש · ₪1,234');
// 4 — דולר בלבד
eq('$בלבד', donCalMonthLine([{ date: '2026-08-01', amount: 200, cur: '$' }], inAug, undefined, undefined),
  '1 תרומות החודש · $200');
// 5 — שורות בלי-סכום (קובץ היסטורי)
eq('היסטורי', donCalMonthLine([{ date: '2026-08-02', amount: 0, cur: '' }], inAug, undefined, undefined),
  '1 תרומות החודש · סכומים מהקובץ ההיסטורי');
// 6 — מחוץ לחודש
eq('מחוץ', donCalMonthLine([{ date: '2026-07-05', amount: 100, cur: '₪' }], inAug, undefined, undefined),
  'אין תרומות מתועדות בחודש זה');
// 7 — מונח ארגוני דרך שקע-termOf
const termOf = (cfg, k, fb) => cfg.terms?.[k] ?? fb;
eq('termOf', donCalMonthLine([], inAug, { terms: { 'entity.donations': 'נדבות' } }, termOf),
  'אין נדבות מתועדות בחודש זה');
if (f) process.exit(1);
console.log('✓ don-cal-month-line: 7 דוגמאות-חוזה — ירוק');
