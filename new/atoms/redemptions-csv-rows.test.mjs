import { redemptionsCsvRows } from './redemptions-csv-rows.mjs';
// מימושי-שקע לבדיקה — כמוגדר בחוזה:
const NAMES = { c1: 'קופון מזון', c2: 'מתנה' };
const itemOf = (_db, comp) => ({ name: NAMES[comp.id] ?? '' });
const beneficiaryLabel = (_db, a) => (a.famId === 'f1' ? 'משפחת כהן' : 'משפחת לוי');
const db = {
  shopProducts: [{ id: 'p1', name: 'סל חג', components: [{ id: 'c1' }, { id: 'c2' }] }],
  shopAssignments: [
    {
      famId: 'f1', productId: 'p1',
      redemptions: [
        { date: '2026-08-01', componentId: 'c1', paid: 20, value: 100, rid: 'S-0001' },
        { date: '2026-08-02', componentId: 'cX', paid: 0, value: 50, voidedAt: '2026-08-03' },
      ],
    },
    { famId: 'f2', productId: 'pZZZ', redemptions: [{ date: '2026-08-04', componentId: 'c2', paid: 5, value: 30 }] },
  ],
};
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const R = redemptionsCsvRows(db, undefined, beneficiaryLabel, itemOf);
ok(R.length === 4, 'אורך ' + R.length + ' ≠ 4');
ok(eq(R[0], ['תאריך', 'מוטב', 'פריט', 'חבילה', 'שולם', 'שווי', 'אישור', 'מבוטל']), 'כותרת: ' + JSON.stringify(R[0]));
ok(eq(R[1], ['2026-08-01', 'משפחת כהן', 'קופון מזון', 'סל חג', 20, 100, 'S-0001', '']), 'שורה 1: ' + JSON.stringify(R[1]));
ok(eq(R[2], ['2026-08-02', 'משפחת כהן', '', 'סל חג', 0, 50, '', 'בוטל ב-2026-08-03']), 'שורה 2: ' + JSON.stringify(R[2]));
ok(eq(R[3], ['2026-08-04', 'משפחת לוי', '', '', 5, 30, '', '']), 'שורה 3: ' + JSON.stringify(R[3]));
// אפס-שיוכים ⇒ כותרת בלבד:
const E = redemptionsCsvRows({ shopProducts: [], shopAssignments: [] }, undefined, beneficiaryLabel, itemOf);
ok(E.length === 1, 'ריק: אורך ' + E.length + ' ≠ 1');

if (f) process.exit(1);
console.log('✓ redemptions-csv-rows: 6 דוגמאות-חוזה — ירוק');
