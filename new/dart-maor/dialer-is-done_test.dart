// רתמת-זהב · dialer-is-done — קלט+WANT זהים ל-new/atoms/dialer-is-done.test.mjs.
// אם עובר ⇒ Dart≡JS. הרצה: dart run --enable-asserts dialer-is-done_test.dart ⇒ exit 0.
import 'dialer-is-done.dart';

void main() {
  final start = <String, dynamic>{
    'name': 'C',
    'startedAt': '2026-08-26',
    'queue': ['1', '2', '3'],
    'total': 3,
    'log': [],
  };
  final got = [isDone(start), isDone({'queue': []})];
  const want = [false, true];
  assert(got[0] == want[0] && got[1] == want[1],
      '✗ dialer-is-done\n$got\n≠\n$want');
  print('✓ dialer-is-done (Dart): Golden — ירוק');
}
