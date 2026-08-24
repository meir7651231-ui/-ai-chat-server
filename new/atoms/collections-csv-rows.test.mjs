import { collectionsCsvRows } from './collections-csv-rows.mjs';
const termOf = (config, k, fb) => config.terms?.[k] ?? fb;
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const HDR = ['תאריך', 'רכז', 'קופה', 'משפחה', 'סכום', 'מבצע'];
const emptyDb = { tzBoxes: [], tzCoordinators: [], tzCampaigns: [], families: [] };
let f = 0;
const chk = (n, ok, got) => { if (!ok) { console.error(`✗ דוגמה ${n}: ${JSON.stringify(got)}`); f = 1; } };
// 1 — db ריק, בלי config ⇒ כותרות-fallback בלבד
let r = collectionsCsvRows(emptyDb, undefined, termOf);
chk(1, eq(r, [HDR]), r);
// 2+3+4+6 — קופות עם ריקונים
const db = {
  tzBoxes: [
    { num: 3, coordinatorId: 'c1', famId: 'f1', collections: [{ date: '2026-08-01', amount: 120 }, { date: '2026-08-15', amount: 80, campaignId: 'p1' }] },
    { num: 7, coordinatorId: 'zar', famId: 'zar', collections: [{ date: '2026-08-02', amount: 50 }] },
  ],
  tzCoordinators: [{ id: 'c1', name: 'רבקה' }],
  tzCampaigns: [{ id: 'p1', name: 'חנוכה' }],
  families: [{ id: 'f1', name: 'כהן' }],
};
r = collectionsCsvRows(db, undefined, termOf);
chk(2, eq(r[1], ['2026-08-01', 'רבקה', '#3', 'כהן', 120, '']), r[1]);
chk(3, eq(r[2], ['2026-08-15', 'רבקה', '#3', 'כהן', 80, 'חנוכה']), r[2]);
chk(4, eq(r[3], ['2026-08-02', '', '#7', '', 50, '']), r[3]);
chk(6, r.length === 4, r.length);
// 5 — מונח ארגוני דרך השקע
r = collectionsCsvRows(emptyDb, { terms: { 'entity.family': 'לקוח' } }, termOf);
chk(5, r[0][3] === 'לקוח', r[0]);
if (f) process.exit(1);
console.log('✓ collections-csv-rows: 6 דוגמאות-חוזה — ירוק');
