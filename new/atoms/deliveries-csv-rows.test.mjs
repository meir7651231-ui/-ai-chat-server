import { deliveriesCsvRows } from './deliveries-csv-rows.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };
const eq = (name, a, b) => chk(name + ` ⇒ ${JSON.stringify(a)}`, JSON.stringify(a) === JSON.stringify(b));

const statusLabel = (s) => (s === 'pickup' ? 'איסוף' : s === 'enroute' ? 'בדרך' : 'נמסר');
const termOf = (c, k, fb) => c.terms?.[k] ?? fb;
const db = {
  distributionDays: [{ id: 'd1', date: '2026-08-01' }],
  families: [
    { id: 'f1', name: 'כהן', address: ' הרצל 3 ', city: 'צפת' },
    { id: 'f2', name: 'לוי', address: '', city: '' },
  ],
  volunteers: [{ id: 'v1', name: 'משה' }],
  deliveries: [
    { dayId: 'd1', familyId: 'f1', volunteerId: 'v1', status: 'pickup', note: 'דחוף' },
    { dayId: 'dX', familyId: 'f2', volunteerId: 'vX', status: 'delivered' },
  ],
};

// 1–3, 6) עם config ומונח-דריסה
const rows = deliveriesCsvRows(db, { terms: { 'entity.family': 'לקוח' } }, termOf, statusLabel);
eq('1 כותרת עם מונח', rows[0], ['תאריך', 'לקוח', 'כתובת', 'מתנדב', 'סטטוס', 'הערה']);
eq('2 שורה מלאה (trim+", ")', rows[1], ['2026-08-01', 'כהן', 'הרצל 3, צפת', 'משה', 'איסוף', 'דחוף']);
eq('3 לא-נמצאים/ריקים ⇒ ""', rows[2], ['', 'לוי', '', '', 'נמסר', '']);
chk('6 שלוש שורות בסדר deliveries', rows.length === 3);

// 4) בלי config — fallback, והשקע לא נקרא כלל
const boom = () => { throw new Error('termOf הופעל בלי config'); };
const rows2 = deliveriesCsvRows(db, undefined, boom, statusLabel);
eq('4 כותרת ברירת-מחדל', rows2[0], ['תאריך', 'משפחה', 'כתובת', 'מתנדב', 'סטטוס', 'הערה']);

// 5) deliveries ריק ⇒ כותרת בלבד
const rows3 = deliveriesCsvRows({ ...db, deliveries: [] }, undefined, boom, statusLabel);
chk('5 כותרת בלבד', rows3.length === 1);

if (f) process.exit(1);
console.log('✓ deliveries-csv-rows: 6 דוגמאות-חוזה (שקעי termOf/statusLabel) — ירוק');
