// בדיקת-חוזה (רתמת-זהב) · deliveriesOfDay — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/deliveries-of-day.test.mjs:
//   db = { deliveries: [ {id:'d1',dayId:'A'}, {id:'d2',dayId:'B'}, {id:'d3',dayId:'A'} ] }
//   1) 'A' ⇒ אורך 2, [d1,d3] בסדר-המקור, a[0] === deliveries[0] (אותה רפרנס)
//   2) 'B' ⇒ אורך 1, [d2]
//   3) 'C' (לא-קיים) ⇒ ריק
//   4) deliveries ריק ⇒ ריק
// המרה: === של JS ⇒ identical ב-Dart. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/deliveries-of-day_test.dart  ⇒ exit 0
import 'deliveries-of-day.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  final db = <String, dynamic>{
    'deliveries': [
      {'id': 'd1', 'dayId': 'A'},
      {'id': 'd2', 'dayId': 'B'},
      {'id': 'd3', 'dayId': 'A'},
    ],
  };

  // 1) יום עם שתי מסירות — סדר-מקור + אותה רפרנס.
  final a = deliveriesOfDay(db, 'A');
  _ok(a.length == 2, 'A: אורך ≠ 2'); n++;
  _ok((a[0] as Map)['id'] == 'd1' && (a[1] as Map)['id'] == 'd3',
      'A: לא [d1,d3] בסדר-המקור'); n++;
  _ok(identical(a[0], (db['deliveries'] as List)[0]), 'A: לא אותה רפרנס'); n++;

  // 2) יום עם מסירה אחת.
  final b = deliveriesOfDay(db, 'B');
  _ok(b.length == 1 && (b[0] as Map)['id'] == 'd2', 'B: לא [d2]'); n++;

  // 3) יום לא-קיים.
  _ok(deliveriesOfDay(db, 'C').length == 0, 'C: לא ריק'); n++;

  // 4) deliveries ריק.
  _ok(deliveriesOfDay(<String, dynamic>{'deliveries': []}, 'A').length == 0,
      'ריק: לא ריק'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(deliveriesOfDay(db, 'A').length == 2, 'assert-live guard');

  print('OK deliveriesOfDay: $n asserts passed');
}
