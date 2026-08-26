// רתמת-זהב · dialer-current-id — קלט+WANT זהים ל-new/atoms/dialer-current-id.test.mjs.
// אם עובר ⇒ Dart≡JS. הרצה: dart run --enable-asserts dialer-current-id_test.dart ⇒ exit 0.
import 'dialer-current-id.dart';

void main() {
  final start = <String, dynamic>{
    'name': 'C',
    'startedAt': '2026-08-26',
    'queue': ['1', '2', '3'],
    'total': 3,
    'log': [],
  };
  final got = [currentId(start), currentId({'queue': []})];
  const want = ['1', null];
  assert(got.length == want.length && got[0] == want[0] && got[1] == want[1],
      '✗ dialer-current-id\n$got\n≠\n$want');
  print('✓ dialer-current-id (Dart): Golden — ירוק');
}
