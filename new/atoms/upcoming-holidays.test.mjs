import { upcomingHolidays } from './upcoming-holidays.mjs';
let f = 0;
const eq = (a, b, msg) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) { console.error(`✗ ${msg} ⇒ ${JSON.stringify(a)}`); f = 1; }
};

// שקעים סטנדרטיים לבדיקה: isoOf מקומי + holidayOf לפי מפת-ISO
const pad2 = (n) => String(n).padStart(2, '0');
const isoOf = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const byMap = (map) => (d) => map[isoOf(d)] ?? null;

// 1) דדופ-שם — חג רב-ימי מוחזר ביומו הראשון בלבד
{
  const holidayOf = byMap({
    '2026-09-12': 'ראש השנה', '2026-09-13': 'ראש השנה', '2026-09-15': 'צום גדליה',
  });
  eq(upcomingHolidays('2026-09-10', 5, holidayOf, isoOf),
    [{ iso: '2026-09-12', name: 'ראש השנה' }, { iso: '2026-09-15', name: 'צום גדליה' }],
    'דוגמה 1: דדופ + יום ראשון');
}

// 2) הטווח כולל את יום-הקצה (i<=days ⇒ days+1 ימים)
{
  const holidayOf = byMap({ '2026-09-12': 'ראש השנה' });
  eq(upcomingHolidays('2026-09-10', 2, holidayOf, isoOf),
    [{ iso: '2026-09-12', name: 'ראש השנה' }], 'דוגמה 2: יום-הקצה נכלל');
}

// 3) days=0 — רק fromIso עצמו
{
  const holidayOf = byMap({ '2026-09-10': 'חג היום', '2026-09-11': 'חג מחר' });
  eq(upcomingHolidays('2026-09-10', 0, holidayOf, isoOf),
    [{ iso: '2026-09-10', name: 'חג היום' }], 'דוגמה 3: days=0');
}

// 4) אין חגים ⇒ []
eq(upcomingHolidays('2026-09-10', 5, () => null, isoOf), [], 'דוגמה 4: ריק');

// 5) גלגול-חודש
{
  const holidayOf = byMap({ '2026-02-02': 'חג פברואר' });
  eq(upcomingHolidays('2026-01-30', 3, holidayOf, isoOf),
    [{ iso: '2026-02-02', name: 'חג פברואר' }], 'דוגמה 5: גלגול-חודש');
}

if (f) process.exit(1);
console.log('✓ upcoming-holidays: 5 דוגמאות-חוזה — ירוק');
