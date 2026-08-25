// רתמת-זהב · item-remaining — בדיוק דוגמאות-החוזה של new/atoms/item-remaining.test.mjs.
// עובר ⇒ Dart ≡ JS.  הרצה: dart run --enable-asserts item-remaining_test.dart
import 'item-remaining.dart';

// שקע חוזי (מדמה את שכן-המקור — מחריג מבוטלים)
Iterable<dynamic> liveRedemptions(dynamic a) =>
    (a['redemptions'] as List).where((r) => (r as Map)['voidedAt'] == null);

final db = <String, dynamic>{
  'shopItems': [
    {'id': 'i1', 'stock': 5},
    {'id': 'i2'}, // בלי stock — ללא-מעקב
    {'id': 'i3', 'stock': 1},
  ],
  'shopProducts': [
    {
      'id': 'p1',
      'components': [
        {'id': 'c1', 'itemId': 'i1'},
        {'id': 'c2', 'itemId': 'i2'},
        {'id': 'c3', 'itemId': 'i3'},
      ],
    },
  ],
  'shopAssignments': [
    {
      'productId': 'p1',
      'redemptions': [
        {'componentId': 'c1'},
        {'componentId': 'c1'},
        {'componentId': 'c2'},
      ],
    },
    {
      'productId': 'p1',
      'redemptions': [
        {'componentId': 'c1'},
        {'componentId': 'c1', 'voidedAt': '2026-08-01'},
      ],
    },
    {
      'productId': 'pZZZ',
      'redemptions': [
        {'componentId': 'c1'},
      ],
    }, // חבילה לא-קיימת — מדולג
  ],
};

void main() {
  // 1) 5 − (2+1) מימושים-חיים של c1 = 2 (מבוטל הוחרג, pZZZ דולג, c2 לא נספר)
  final r1 = itemRemaining(db, 'i1', liveRedemptions);
  assert(r1 == 2, '1: (db,i1) ≠ 2 (קיבלנו $r1)');

  // 2) פריט בלי stock ⇒ null
  assert(itemRemaining(db, 'i2', liveRedemptions) == null, '2: פריט ללא-מעקב ≠ null');

  // 3) פריט לא-קיים ⇒ null
  assert(itemRemaining(db, 'iZZZ', liveRedemptions) == null, '3: פריט לא-קיים ≠ null');

  // 4) לא שלילי — i3{stock:1} עם 3 מימושים-חיים ⇒ 0
  final db4 = <String, dynamic>{
    ...db,
    'shopAssignments': [
      {
        'productId': 'p1',
        'redemptions': [
          {'componentId': 'c3'},
          {'componentId': 'c3'},
          {'componentId': 'c3'},
        ],
      },
    ],
  };
  assert(itemRemaining(db4, 'i3', liveRedemptions) == 0, '4: מלאי-חסר ≠ 0 (שלילי?)');

  // 5) בלי שיוכים כלל ⇒ המלאי המלא
  final db5 = <String, dynamic>{...db, 'shopAssignments': []};
  assert(itemRemaining(db5, 'i1', liveRedemptions) == 5, '5: בלי שיוכים ≠ 5');

  print('✓ item-remaining: 5 דוגמאות-חוזה — ירוק');
}
