import { chargeDedupKey } from './charge-dedup-key.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// 1) txn רגיל
ok(chargeDedupKey({ txnId: 'T123' }) === 'txn:T123', 'txn רגיל שגוי');
// 2) txn נגזם
ok(chargeDedupKey({ txnId: '  T123  ' }) === 'txn:T123', 'txn לא נגזם');
// 3) txn קודם לאסמכתא
ok(chargeDedupKey({ txnId: 'T123', reference: 'R9' }) === 'txn:T123', 'txn לא קודם לאסמכתא');
// 4) נפילה לאסמכתא
ok(chargeDedupKey({ txnId: '', reference: 'R9' }) === 'ref:R9', 'נפילה לאסמכתא שגויה');
// 5) txn רווחים-בלבד = ריק; ref נגזם
ok(chargeDedupKey({ txnId: '   ', reference: '  R9 ' }) === 'ref:R9', 'רווחים-בלבד לא טופלו');
// 6) ריק ⇒ אין-דדופ
ok(chargeDedupKey({}) === '', 'אובייקט ריק אמור להחזיר ""');
ok(chargeDedupKey({ reference: '   ' }) === '', 'ref רווחים-בלבד אמור להחזיר ""');
if (f) process.exit(1);
console.log('✓ charge-dedup-key — כל דוגמאות-החוזה ירוקות');
