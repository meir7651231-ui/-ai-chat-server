// רתמת-זהב · charge-dedup-key — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// אם עובר: Dart ≡ JS. הקלטים והפלטים הומרו אחד-לאחד מ-new/atoms/charge-dedup-key.test.mjs.
import 'charge-dedup-key.dart';

void main() {
  // 1) txn רגיל
  assert(chargeDedupKey({'txnId': 'T123'}) == 'txn:T123', 'txn רגיל שגוי');
  // 2) txn נגזם
  assert(chargeDedupKey({'txnId': '  T123  '}) == 'txn:T123', 'txn לא נגזם');
  // 3) txn קודם לאסמכתא
  assert(chargeDedupKey({'txnId': 'T123', 'reference': 'R9'}) == 'txn:T123', 'txn לא קודם לאסמכתא');
  // 4) נפילה לאסמכתא
  assert(chargeDedupKey({'txnId': '', 'reference': 'R9'}) == 'ref:R9', 'נפילה לאסמכתא שגויה');
  // 5) txn רווחים-בלבד = ריק; ref נגזם
  assert(chargeDedupKey({'txnId': '   ', 'reference': '  R9 '}) == 'ref:R9', 'רווחים-בלבד לא טופלו');
  // 6) ריק ⇒ אין-דדופ
  assert(chargeDedupKey({}) == '', 'אובייקט ריק אמור להחזיר ""');
  assert(chargeDedupKey({'reference': '   '}) == '', 'ref רווחים-בלבד אמור להחזיר ""');
  print('✓ charge-dedup-key (Dart): 7 דוגמאות-חוזה — ירוק');
}
