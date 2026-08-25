// רתמת-זהב · max-discount-pct — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// אם עובר: Dart ≡ JS. אותם קלטים→פלטים, מומרים ל-Dart.
import 'max-discount-pct.dart';

void main() {
  final criteria = <Map<String, dynamic>>[
    {'id': 'c1', 'discountPct': 10},
    {'id': 'c2', 'discountPct': 25},
    {'id': 'c3', 'discountPct': 150},
    {'id': 'c4', 'discountPct': double.nan},
  ];

  assert(maxDiscountPct(['c1', 'c2'], criteria) == 25, 'הגבוה מנצח (לא מצטבר)');
  assert(maxDiscountPct(['c1'], criteria) == 10, 'קריטריון יחיד');
  assert(maxDiscountPct(['zzz'], criteria) == 0, 'מזהה לא-קיים');
  assert(maxDiscountPct(['c3'], criteria) == 100, 'חיתוך-תקרה 150⇒100');
  assert(maxDiscountPct(['c4', 'c1'], criteria) == 10, 'NaN מדולג');
  assert(maxDiscountPct(<String>[], criteria) == 0, 'רשימה ריקה');
  assert(
      maxDiscountPct(['c1'], <Map<String, dynamic>>[
            {'id': 'c1', 'discountPct': -30}
          ]) ==
          0,
      'שלילי ⇒ רצפת-0');

  print('✓ max-discount-pct (Dart): 7 דוגמאות-חוזה — ירוק');
}
