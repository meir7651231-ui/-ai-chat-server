// רתמת-זהב · receipt-verify-code — בדיוק דוגמאות-החוזה מ-receipt-verify-code.test.mjs.
// עובר ⇒ Dart ≡ JS.
import 'receipt-verify-code.dart';

void main() {
  final cases = <List<dynamic>>[
    [
      ['R-0001', 180, '₪', '2026-08-05'],
      '0I5-MI1'
    ],
    [
      ['R-0001', 180, '', '2026-08-05T12:00:00'],
      '0I5-MI1'
    ],
    [
      ['R-0001', 181, '₪', '2026-08-05'],
      'N3T-66S'
    ],
    [
      ['R-0002', 180, '₪', '2026-08-05'],
      '7RO-NJ2'
    ],
    [
      ['D-0042', 500, '\$', '2026-01-01'],
      'PG5-8EB'
    ],
  ];

  for (final c in cases) {
    final a = c[0] as List;
    final want = c[1] as String;
    final got = receiptVerifyCode(
        a[0] as String, a[1] as num, a[2] as String?, a[3] as String);
    assert(got == want, '✗ $a ⇒ $got ≠ $want');
    if (got != want) {
      throw StateError('✗ $a ⇒ $got ≠ $want');
    }
  }
  print('✓ receipt-verify-code: 5 דוגמאות-חוזה — ירוק');
}
