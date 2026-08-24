import { attachChargesBulk } from './attach-charges-bulk.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// שקעים-מיני כמתועד בחוזה
const histDedupKey = (h) => (h.txn ? 'txn:' + h.txn : '');
const chargeDedupKey = (c) => (c.txnId ? 'txn:' + c.txnId : '');
const chargeToHist = (c) => ({ d: c.d, a: c.amount, txn: c.txnId });
const fillCardFromCharge = (sp) => ({ ...sp, filled: true });
const withNedarimHok = (sp) => ({ ...sp, hoked: true });
const IO = [histDedupKey, chargeDedupKey, chargeToHist, fillCardFromCharge, withNedarimHok];
const mk = () => [
  { id: 's1', hist: [{ d: '2026-01-01', a: 50, txn: 'T1' }] },
  { id: 's2', hist: [] },
];
// 1) אותו txn פעמיים באצווה — רק הראשון נרשם
{
  const r = attachChargesBulk(mk(), [
    { supId: 's1', charge: { amount: 100, txnId: 'T7', d: '2026-03-01' } },
    { supId: 's2', charge: { amount: 100, txnId: 'T7', d: '2026-03-01' } },
  ], ...IO);
  ok(r.added === 1, 'דדופ-תוך-אצווה: added ≠ 1');
  ok(r.supporters[0].hist.length === 2 && r.supporters[1].hist.length === 0, 'הכפול נרשם בכרטיס השני');
}
// 2) מפתח שכבר ב-hist קיים (T1 על s1) — מדולג גם לכרטיס אחר
{
  const r = attachChargesBulk(mk(), [{ supId: 's2', charge: { amount: 60, txnId: 'T1' } }], ...IO);
  ok(r.added === 0 && r.supporters[1].hist.length === 0, 'C2: מפתח-קיים נרשם שוב');
}
// 3) amount=0 ו-supId לא-ממופה — מדולגים בלי לעצור
{
  const r = attachChargesBulk(mk(), [
    { supId: 's2', charge: { amount: 0, txnId: 'T8' } },
    { supId: 'אין', charge: { amount: 90, txnId: 'T9' } },
    { supId: 's2', charge: { amount: 30, txnId: 'TA', d: '2026-04-04' } },
  ], ...IO);
  ok(r.added === 1 && r.supporters[1].hist.length === 1 && r.supporters[1].hist[0].txn === 'TA', 'דילוגי C10/לא-ממופה שגויים');
}
// 4) שתי תקינות לשני כרטיסים — added=2, טוהר-הקלט
{
  const sup = mk();
  const r = attachChargesBulk(sup, [
    { supId: 's1', charge: { amount: 10, txnId: 'TB', d: '2026-05-01' } },
    { supId: 's2', charge: { amount: 20, txnId: 'TC', d: '2026-05-02' } },
  ], ...IO);
  ok(r.added === 2, 'added ≠ 2');
  ok(r.supporters[0].hist.length === 2 && r.supporters[0].hist[1].txn === 'TB', 'כרטיס s1 שגוי');
  ok(r.supporters[1].hist.length === 1 && r.supporters[1].hist[0].txn === 'TC', 'כרטיס s2 שגוי');
  ok(r.supporters[0].filled && r.supporters[0].hoked, 'fill/hok לא הופעלו');
  ok(sup[0].hist.length === 1 && sup[1].hist.length === 0 && !sup[0].filled, 'הקלט שונה — הופר הטוהר');
}
// 5) אצווה ריקה
{
  const sup = mk();
  const r = attachChargesBulk(sup, [], ...IO);
  ok(r.added === 0 && JSON.stringify(r.supporters) === JSON.stringify(sup), 'אצווה-ריקה: פלט לא-שקול');
}
if (f) process.exit(1);
console.log('✓ attach-charges-bulk: 5 דוגמאות-חוזה — ירוק (דדופ-גלובלי מתעדכן)');
