import { eventsCsvRows } from './events-csv-rows.mjs';
// מימושי-שקע לבדיקה — נאמנים למקור:
const termOf = (c, k, fb) => c?.terms?.[k] || fb;
const hebDateFull = (iso) => 'ע(' + iso + ')';
const evMeta = {
  call: { label: 'טלפון' },
  org: { label: 'אירוע' },
  custom: { label: 'אירוע' },
};
const db = {
  events: [
    { title: 'ברית', type: 'custom', customType: 'ברית מילה', date: '2026-09-01', time: '19:00', famId: 'f1', priority: 'red', done: false },
    { title: 'שיחה', type: 'call', date: '2026-08-20', priority: 'green', done: true },
  ],
  families: [{ id: 'f1', name: 'כהן' }],
};
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ': ' + JSON.stringify(a));
const R = eventsCsvRows(db, undefined, termOf, hebDateFull, evMeta);
ok(R.length === 3, 'אורך ' + R.length + ' ≠ 3');
eq(R[0], ['כותרת', 'סוג אירוע', 'תאריך עברי', 'תאריך לועזי', 'שעה', 'משפחה', 'עדיפות', 'הערות', 'בוצע'], 'כותרת');
eq(R[1], ['שיחה', 'טלפון', 'ע(2026-08-20)', '20/08/2026', '', '', 'רגיל (ירוק)', '', 'כן'], 'שורה-1 (מיון הפך סדר)');
eq(R[2], ['ברית', 'ברית מילה', 'ע(2026-09-01)', '01/09/2026', '19:00', 'כהן', 'דחוף (אדום)', '', 'לא'], 'שורה-2');
// עם config — המונח מהשקע:
const R2 = eventsCsvRows(db, { terms: { 'entity.family': 'בית-אב' } }, termOf, hebDateFull, evMeta);
ok(R2[0][5] === 'בית-אב', 'כותרת-משפחה עם config: ' + R2[0][5]);
// בלי-תאריך + עדיפות לא-מוכרת:
const R3 = eventsCsvRows({ events: [{ title: 'x', type: 'org', priority: 'x', date: '', done: false }], families: [] }, undefined, termOf, hebDateFull, evMeta);
eq(R3[1], ['x', 'אירוע', '', '', '', '', 'x', '', 'לא'], 'אירוע ריק-תאריך');
if (f) process.exit(1);
console.log('✓ events-csv-rows: כל דוגמאות-החוזה — ירוק');
