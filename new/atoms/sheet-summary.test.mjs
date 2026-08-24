import { sheetSummary } from './sheet-summary.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (out, present, total, msg) =>
  ok(out.present === present && out.total === total,
    msg + ' (בפועל: ' + JSON.stringify(out) + ')');

// 1) רק מי שהתאריך ברשימתו נספר
{
  const roster = [
    { presents: ['2026-08-24'] },
    { presents: ['2026-08-23'] },
    { presents: ['2026-08-23', '2026-08-24'] },
  ];
  eq(sheetSummary(roster, '2026-08-24'), 2, 3, 'חייב {present:2,total:3}');
}
// 2) presents חסר נספר לא-נוכח, בלי לקרוס
{
  eq(sheetSummary([{}, { presents: ['2026-08-24'] }], '2026-08-24'), 1, 2,
    'שיבוץ בלי presents חייב להיספר לא-נוכח (?? [])');
}
// 3) רשימה ריקה
{
  eq(sheetSummary([], '2026-08-24'), 0, 0, 'רשימה ריקה חייבת {present:0,total:0}');
}
// 4) אף אחד לא סומן
{
  eq(sheetSummary([{ presents: [] }, { presents: ['2026-08-23'] }], '2026-08-24'), 0, 2,
    'בלי סימון ליום ⇒ present:0, total נשאר 2');
}
// 5) התאמת-תאריך מדויקת — אין נירמול-פורמט
{
  eq(sheetSummary([{ presents: ['2026-08-04'] }], '2026-08-4'), 0, 1,
    "'2026-08-4' אסור שיתאים ל-'2026-08-04' — includes מדויק");
}
if (f) process.exit(1);
console.log('✓ sheet-summary: 5 דוגמאות-חוזה — ירוק (טהור)');
