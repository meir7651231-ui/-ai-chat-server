// רתמת-זהב · warehouse-value — תרגום new/atoms/warehouse-value.test.mjs אחד-לאחד
// (6 דוגמאות-החוזה) + חיזוקי-נאמנות-JS. מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart-maor/warehouse-value_test.dart ⇒ OK
import 'warehouse-value.dart';

void main() {
  // 6 דוגמאות-החוזה (זהות ביט-אחר-ביט לבדיקת-ה-JS):
  final cases = <List<dynamic>>[
    [
      [
        {'qty': 10, 'cost': 50}
      ],
      500
    ],
    [
      // עיגול-בסוף: 500+59.7=559.7 ⇒ 560 (לא פר-פריט)
      [
        {'qty': 10, 'cost': 50},
        {'qty': 3, 'cost': 19.9}
      ],
      560
    ],
    [
      // בלי cost ⇒ 0
      [
        {'qty': 3}
      ],
      0
    ],
    [
      // קידום-מספרי של מחרוזות
      [
        {'qty': '2', 'cost': '7'}
      ],
      14
    ],
    [
      // לא-מספרי ⇒ 0
      [
        {'qty': 'x', 'cost': 50}
      ],
      0
    ],
    [<dynamic>[], 0],
  ];
  var i = 0;
  for (final c in cases) {
    i++;
    final got = warehouseValue(c[0]);
    if (got != c[1]) throw StateError('✗ דוגמה $i: ${c[0]} ⇒ $got ≠ ${c[1]}');
  }

  // פלט שלם באמת (טיפוס int בטווח-הבטוח)
  if (warehouseValue([
        {'qty': 10, 'cost': 50}
      ]) is! int) {
    throw StateError('✗ פלט אינו int');
  }

  // ‏null ⇒ 0 (‏+null=0 ב-JS)
  final gNull = warehouseValue([
    {'qty': null, 'cost': 100},
    {'qty': 2, 'cost': 5}
  ]);
  if (gNull != 10) throw StateError('✗ null-qty ⇒ $gNull ≠ 10');

  // מחרוזת ריקה/רווחים ⇒ 0 (‏Number('')=0)
  final gEmpty = warehouseValue([
    {'qty': '  ', 'cost': 100}
  ]);
  if (gEmpty != 0) throw StateError('✗ מחרוזת-רווחים ⇒ $gEmpty ≠ 0');

  // ‏'.5' תקין ב-ES ⇒ 0.5 (2 × .5 = 1)
  final gDot = warehouseValue([
    {'qty': '.5', 'cost': 2}
  ]);
  if (gDot != 1) throw StateError("✗ '.5' ⇒ $gDot ≠ 1");

  // חצי-שקל מתעגל כלפי-מעלה (Math.round: 0.5 ⇒ 1)
  final gHalf = warehouseValue([
    {'qty': 1, 'cost': 0.5}
  ]);
  if (gHalf != 1) throw StateError('✗ 0.5 ⇒ $gHalf ≠ 1');

  // חצי-שלילי ⇒ כלפי-+∞ (Math.round(-0.5) ⇒ 0, לא ‎-1)
  final gNegHalf = warehouseValue([
    {'qty': -1, 'cost': 0.5}
  ]);
  if (gNegHalf != 0) throw StateError('✗ ‎-0.5 ⇒ $gNegHalf ≠ 0');

  // טוהר: הקלט לא משתנה
  final src = [
    {'qty': 10, 'cost': 50}
  ];
  warehouseValue(src);
  if (src.length != 1 || src[0]['qty'] != 10 || src[0]['cost'] != 50) {
    throw StateError('✗ טוהר: הקלט השתנה');
  }

  print('OK · warehouse-value (Dart): 6 דוגמאות-חוזה + 7 חיזוקים — ירוק');
}
