// בדיקת total-label — כל דוגמאות-החוזה + בדיקת-ה-JS (שקעי-צבירה מוזרקים).
import 'total-label.dart';

void main() {
  dynamic supIls(dynamic sp) => sp['ils'];
  dynamic supUsd(dynamic sp) => sp['usd'];

  // חמש הדוגמאות המחייבות מהחוזה ≡ total-label.test.mjs
  final cases = <List<dynamic>>[
    [
      {'ils': 1200, 'usd': 300},
      '₪1,200 + \$300'
    ],
    [
      {'ils': 1200, 'usd': 0},
      '₪1,200'
    ],
    [
      {'ils': 0, 'usd': 300},
      '\$300'
    ],
    [
      {'ils': 0, 'usd': 0},
      '—'
    ],
    [
      {'ils': 1234567, 'usd': 0},
      '₪1,234,567'
    ],
  ];

  var failed = 0;
  for (final c in cases) {
    final sp = c[0];
    final want = c[1];
    final got = totalLabel(sp, supIls, supUsd);
    if (got != want) {
      print('✗ totalLabel($sp) = $got ≠ $want');
      failed = 1;
    }
  }

  if (failed != 0) {
    throw StateError('total-label: יש כשלים');
  }
  print('✓ total-label: 5 דוגמאות-חוזה (שקעי-צבירה מוזרקים) — ירוק');
  print('OK');
}
