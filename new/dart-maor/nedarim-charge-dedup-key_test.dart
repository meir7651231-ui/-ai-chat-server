// רתמת-זהב · nedarim-charge-dedup-key — קלט+WANT זהים ל-new/atoms/nedarim-charge-dedup-key.test.mjs.
// אין שקעים. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts nedarim-charge-dedup-key_test.dart ⇒ exit 0.
import 'nedarim-charge-dedup-key.dart';

void main() {
  final ch1 = {'toremId': 'T100', 'amount': 100, 'txnId': 'TX1', 'd': '2026-08-10', 'currency': '₪'};
  final got = [chargeDedupKey(ch1), chargeDedupKey({'reference': 'R9'}), chargeDedupKey({})];
  const want = ['txn:TX1', 'ref:R9', ''];
  assert(got[0] == want[0] && got[1] == want[1] && got[2] == want[2],
      '✗ nedarim-charge-dedup-key\n$got\n≠\n$want');
  print('✓ nedarim-charge-dedup-key (Dart): Golden — ירוק');
}
