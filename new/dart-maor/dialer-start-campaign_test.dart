// רתמת-זהב · dialer-start-campaign — קלט+WANT זהים ל-new/atoms/dialer-start-campaign.test.mjs.
// אם עובר ⇒ Dart≡JS. הרצה: dart run --enable-asserts dialer-start-campaign_test.dart ⇒ exit 0.
import 'dialer-start-campaign.dart';

bool _deepEq(dynamic a, dynamic b) {
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k) || !_deepEq(a[k], b[k])) return false;
    }
    return true;
  }
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!_deepEq(a[i], b[i])) return false;
    }
    return true;
  }
  if (a is num && b is num) return a == b;
  return a == b;
}

void main() {
  final want = {
    'name': 'C',
    'startedAt': '2026-08-26',
    'queue': ['1', '2', '3'],
    'total': 3,
    'log': [],
  };
  final got = startCampaign('C', ['1', '1', '', '2', '3'], '2026-08-26');
  assert(_deepEq(got, want), '✗ dialer-start-campaign\n$got\n≠\n$want');
  print('✓ dialer-start-campaign (Dart): Golden — ירוק');
}
