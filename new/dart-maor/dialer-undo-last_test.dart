// רתמת-זהב · dialer-undo-last — קלט+WANT זהים ל-new/atoms/dialer-undo-last.test.mjs.
// אם עובר ⇒ Dart≡JS. הרצה: dart run --enable-asserts dialer-undo-last_test.dart ⇒ exit 0.
import 'dialer-undo-last.dart';

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
  final camp = <String, dynamic>{
    'name': 'C',
    'startedAt': '2026-08-26',
    'total': 3,
    'queue': ['3', '1'],
    'log': [
      {'id': '1', 'outcome': 'noanswer', 'at': '2026-08-26T10:00'},
      {'id': '2', 'outcome': 'donated', 'at': '2026-08-26T10:05', 'note': 'תרם 100'},
      {'id': '1', 'outcome': 'noanswer', 'at': '2026-08-26T10:10'},
    ],
  };
  final want = {
    'name': 'C',
    'startedAt': '2026-08-26',
    'total': 3,
    'queue': ['1', '3'],
    'log': [
      {'id': '1', 'outcome': 'noanswer', 'at': '2026-08-26T10:00'},
      {'id': '2', 'outcome': 'donated', 'at': '2026-08-26T10:05', 'note': 'תרם 100'},
    ],
  };
  final got = undoLast(camp);
  assert(_deepEq(got, want), '✗ dialer-undo-last\n$got\n≠\n$want');
  print('✓ dialer-undo-last (Dart): Golden — ירוק');
}
