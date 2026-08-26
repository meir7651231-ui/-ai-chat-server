// רתמת-זהב · nedarim-charge-to-hist — קלט+WANT זהים ל-new/atoms/nedarim-charge-to-hist.test.mjs.
// curOf inline באטום ⇒ אין שקעים. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts nedarim-charge-to-hist_test.dart ⇒ exit 0.
import 'nedarim-charge-to-hist.dart';

bool _deepEq(dynamic a, dynamic b) {
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k) || !_deepEq(a[k], b[k])) return false;
    }
    return true;
  }
  if (a is num && b is num) return a == b;
  return a == b;
}

void main() {
  final want = {
    'd': '2026-08-10',
    'a': 100,
    'c': r'$',
    'clearer': 'נדרים',
    'ref': 'R9',
    'txn': 'TX1',
    'receipt': 'RC',
    'last4': '1234',
    'kevaId': 'K1',
  };
  final got = chargeToHist({
    'amount': 100,
    'currency': '2',
    'd': '2026-08-10',
    'reference': 'R9',
    'txnId': 'TX1',
    'receipt': 'RC',
    'last4': '1234',
    'kevaId': 'K1',
  });
  assert(_deepEq(got, want), '✗ nedarim-charge-to-hist\n$got\n≠\n$want');
  print('✓ nedarim-charge-to-hist (Dart): Golden — ירוק');
}
