import { chargeToHist } from './charge-to-hist.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// שקעים-מיני כמתועד בחוזה
const curOf = (c) => (String(c.currency || '').trim() === '$' ? '$' : '₪');
const providerClearer = (p) => (/sola/i.test(p || '') ? 'סולה' : 'נדרים');
const IO = [curOf, providerClearer];
// 1) עסקה מלאה — כל השדות עוברים
{
  const src = { d: '2026-08-01', amount: 180, currency: '₪', reference: 'R1', txnId: 'T1', receipt: 'K5', last4: '1234', kevaId: 'KV7' };
  const h = chargeToHist(src, ...IO);
  ok(JSON.stringify(h) === JSON.stringify({ d: '2026-08-01', a: 180, c: '₪', clearer: 'נדרים', ref: 'R1', txn: 'T1', receipt: 'K5', last4: '1234', kevaId: 'KV7' }), 'עסקה מלאה שגויה: ' + JSON.stringify(h));
  ok(src.d === '2026-08-01' && Object.keys(src).length === 8, 'הקלט שונה — הופר הטוהר');
}
// 2) d חסר ⇒ נגזר מ-at
ok(chargeToHist({ at: '2026-08-24T10:30:00', amount: 50 }, ...IO).d === '2026-08-24', 'd לא נגזר מ-at');
// 3) עסקה מינימלית — אפס מפתחות אופציונליים
{
  const h = chargeToHist({ amount: 50, currency: '$' }, ...IO);
  ok(JSON.stringify(h) === JSON.stringify({ d: '', a: 50, c: '$', clearer: 'נדרים' }), 'מינימלית: מפתחות עודפים/חסרים — ' + JSON.stringify(h));
  ok(!('ref' in h) && !('txn' in h) && !('receipt' in h) && !('last4' in h) && !('kevaId' in h), 'מפתח אופציונלי ריק נכנס');
}
// 4) provider Sola ⇒ סולה (דרך השקע)
ok(chargeToHist({ amount: 1, provider: 'Sola' }, ...IO).clearer === 'סולה', 'סולה לא זוהתה');
// 5) רווחים-בלבד נעדר; גזימה
{
  const h = chargeToHist({ amount: 1, reference: '   ', txnId: ' T2 ' }, ...IO);
  ok(!('ref' in h) && h.txn === 'T2', 'רווחים-בלבד/גזימה שגויים');
}
// 6) d קודם ל-at
ok(chargeToHist({ d: '2026-01-05', at: '2026-08-24T10:30:00', amount: 1 }, ...IO).d === '2026-01-05', 'd לא קודם ל-at');
if (f) process.exit(1);
console.log('✓ charge-to-hist — כל דוגמאות-החוזה ירוקות');
