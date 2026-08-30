import { chargeDedupKey as __pure_chargeDedupKey } from './charge-dedup-key.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_chargeDedupKey_CHARGE_DEDUP_KEY_T = {
  k1: "txn:",
  k2: "ref:",
};
const chargeDedupKey = (...a) => __pure_chargeDedupKey(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_chargeDedupKey_CHARGE_DEDUP_KEY_T);
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
