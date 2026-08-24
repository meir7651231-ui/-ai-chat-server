// 🥇 רתמת-זהב · deliveriesOfFamily — אותן דוגמאות-חוזה בדיוק כמו
// new/atoms/deliveries-of-family.test.mjs (אותם קלטים→פלטים). עובר ⇒ Dart ≡ JS.
// הרצה: dart run --enable-asserts new/dart-maor/deliveries-of-family_test.dart

import 'deliveries-of-family.dart';

void main() {
  final db = <String, dynamic>{
    'deliveries': <Map<String, dynamic>>[
      {'id': 'd1', 'familyId': 'f1'},
      {'id': 'd2', 'familyId': 'f2'},
      {'id': 'd3', 'familyId': 'f1'},
    ],
  };

  // 1) משפחה עם שתי מסירות — סדר-מקור + אותה רפרנס
  final a = deliveriesOfFamily(db, 'f1');
  assert(a.length == 2, 'f1: אורך ≠ 2');
  assert(a[0]['id'] == 'd1' && a[1]['id'] == 'd3', 'f1: לא [d1,d3] בסדר-המקור');
  assert(identical(a[1], (db['deliveries'] as List)[2]), 'f1: לא אותה רפרנס');

  // 2) משפחה עם מסירה אחת
  final b = deliveriesOfFamily(db, 'f2');
  assert(b.length == 1 && b[0]['id'] == 'd2', 'f2: לא [d2]');

  // 3) משפחה לא-קיימת
  assert(deliveriesOfFamily(db, 'f9').isEmpty, 'f9: לא ריק');

  // 4) deliveries ריק
  assert(
    deliveriesOfFamily(<String, dynamic>{'deliveries': <Map<String, dynamic>>[]}, 'f1').isEmpty,
    'ריק: לא ריק',
  );

  print('✓ deliveries-of-family: 4 דוגמאות-חוזה — ירוק (Dart ≡ JS)');
}
