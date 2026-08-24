// רתמת-זהב · grand-total — בדיוק דוגמאות-החוזה של grand-total.test.mjs.
// אם עובר: Dart ≡ JS.
import 'grand-total.dart';

num boxTotal(dynamic b) => (b['collections'] as List).fold<num>(
    0, (a, c) => a + ((c['amount'] is num && (c['amount'] as num).isFinite) ? c['amount'] as num : 0));

Map box(List<num> amounts) =>
    {'collections': amounts.map((amount) => {'amount': amount}).toList()};

void main() {
  final b1 = box([100, 50]), b2 = box([30]), b3 = box([]);
  final cases = [
    [
      [b1, b2],
      180,
      'שתי קופות'
    ],
    [
      [b1, b3],
      150,
      'קופה ריקה נספרת 0'
    ],
    [[], 0, 'מערך ריק'],
    [
      [b2],
      30,
      'קופה יחידה'
    ],
  ];
  for (final c in cases) {
    final boxes = c[0] as List;
    final want = c[1] as num;
    final msg = c[2] as String;
    final got = grandTotal(boxes, boxTotal);
    if (got != want) {
      throw AssertionError('✗ $msg ⇒ $got ≠ $want');
    }
  }
  print('✓ grand-total: 4 דוגמאות-חוזה — ירוק');
}
