// רתמת-זהב · dialer-apply-outcome — קלט+WANT זהים ל-new/atoms/dialer-apply-outcome.test.mjs.
// שקע currentId = double מקומי (חזית-התור או null), כמו ה-JS. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts dialer-apply-outcome_test.dart ⇒ exit 0.
import 'dialer-apply-outcome.dart';

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

Object? _currentId(Map<String, dynamic> c) {
  final q = c['queue'] as List;
  return q.isNotEmpty ? q[0] : null;
}

void main() {
  final start = <String, dynamic>{
    'name': 'C',
    'startedAt': '2026-08-26',
    'queue': ['1', '2', '3'],
    'total': 3,
    'log': [],
  };
  final want = {
    'name': 'C',
    'startedAt': '2026-08-26',
    'queue': ['2', '3', '1'],
    'total': 3,
    'log': [
      {'id': '1', 'outcome': 'noanswer', 'at': '2026-08-26T09', 'note': 'לא בבית'},
    ],
  };
  final got = applyOutcome(start, 'noanswer', 'לא בבית', '2026-08-26T09',
      currentId: _currentId);
  assert(_deepEq(got, want), '✗ dialer-apply-outcome\n$got\n≠\n$want');
  print('✓ dialer-apply-outcome (Dart): Golden — ירוק');
}
