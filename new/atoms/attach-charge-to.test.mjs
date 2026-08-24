import { attachChargeTo } from './attach-charge-to.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// שקעים-מיני כמתועד בחוזה
const chargeDedupKey = (c) => (c.txnId ? 'txn:' + c.txnId : '');
const histDedupKey = (h) => (h.txn ? 'txn:' + h.txn : '');
const chargeToHist = (c) => ({ d: c.d, a: c.amount, txn: c.txnId });
const fillCardFromCharge = (sp) => ({ ...sp, filled: true });
const withNedarimHok = (sp) => ({ ...sp, hoked: true });
const IO = [chargeDedupKey, histDedupKey, chargeToHist, fillCardFromCharge, withNedarimHok];
const mk = () => [
  { id: 's1', hist: [{ d: '2026-01-01', a: 50, txn: 'T1' }] },
  { id: 's2', hist: [] },
];
// 1) כרטיס לא-קיים
{
  const sup = mk();
  const r = attachChargeTo(sup, 'אין', { amount: 100, txnId: 'T9' }, ...IO);
  ok(r.added === false && r.supporters === sup, 'לא-קיים: אמור added:false ואותה-רפרנס');
}
// 2) מגן C10 — ביטול amount=0
ok(attachChargeTo(mk(), 's2', { amount: 0, txnId: 'T9' }, ...IO).added === false, 'C10: ביטול נרשם בטעות');
// 3) מגן C2 — המפתח יושב על כרטיס *אחר*
ok(attachChargeTo(mk(), 's2', { amount: 100, txnId: 'T1' }, ...IO).added === false, 'C2: כפילות-חוצת-כרטיסים נרשמה');
// 4) הצלחה — hist גדל, טוהר-הקלט, שני-השקעים הופעלו
{
  const sup = mk();
  const r = attachChargeTo(sup, 's1', { amount: 200, txnId: 'T2', d: '2026-02-02' }, ...IO);
  ok(r.added === true, 'הצלחה: added ≠ true');
  const card = r.supporters[0];
  ok(card.hist.length === 2, 'hist לא גדל 1⇒2');
  const last = card.hist[1];
  ok(last.d === '2026-02-02' && last.a === 200 && last.txn === 'T2', 'הרשומה-החדשה שגויה');
  ok(card.filled === true && card.hoked === true, 'fill/hok לא הופעלו');
  ok(sup[0].hist.length === 1 && sup[0].filled === undefined, 'הקלט שונה — הופר הטוהר');
}
// 5) בלי מפתח — אין דדופ
{
  const sup = [{ id: 's1', hist: [{ d: '2026-01-01', a: 50 }] }];
  const r = attachChargeTo(sup, 's1', { amount: 50, d: '2026-01-01' }, ...IO);
  ok(r.added === true && r.supporters[0].hist.length === 2, 'אין-מפתח: אמור להתווסף בכל-זאת');
}
if (f) process.exit(1);
console.log('✓ attach-charge-to: 5 דוגמאות-חוזה — ירוק (מגיני C2+C10)');
