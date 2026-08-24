// בדיקת-חוזה (רתמת-זהב) · eligibleAssignmentsForDay — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/eligible-assignments-for-day.test.mjs:
//   a1{status:active} a2{status:active} a3{status:done}; deliveries=[{dayId:d1,assignmentId:a1}]
//   1) ('d1')                       ⇒ ids == 'a2'        (a1 נמסר, a3 לא-active)
//   2) ('d2')                       ⇒ ids == 'a1,a2'     (מסירת-d1 לא חוסמת יום אחר)
//   3) בלי deliveries               ⇒ ids == 'a1,a2'
//   4) בלי shopAssignments          ⇒ length == 0
//   5) הפלט מצביע לאובייקט-המקור      ⇒ out[0] identical a1
// המרה: === של JS ⇒ identical/== ב-Dart. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/eligible-assignments-for-day_test.dart ⇒ exit 0
import 'eligible-assignments-for-day.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

String _ids(List arr) => arr.map((a) => (a as Map)['id']).join(',');

void main() {
  var n = 0;

  final a1 = {'id': 'a1', 'status': 'active'};
  final a2 = {'id': 'a2', 'status': 'active'};
  final a3 = {'id': 'a3', 'status': 'done'};
  final db = {
    'shopAssignments': [a1, a2, a3],
    'deliveries': [
      {'dayId': 'd1', 'assignmentId': 'a1'}
    ],
  };

  // 1) d1 ⇒ רק a2 (a1 נמסר, a3 לא-active).
  _ok(_ids(eligibleAssignmentsForDay(db, 'd1')) == 'a2',
      "d1 ⇒ רק a2 (a1 נמסר, a3 לא-active)"); n++;

  // 2) יום אחר ⇒ a1 חוזר להיות זמין.
  _ok(_ids(eligibleAssignmentsForDay(db, 'd2')) == 'a1,a2',
      'יום אחר ⇒ a1 חוזר להיות זמין'); n++;

  // 3) בלי מסירות ⇒ כל הפעילים.
  _ok(
      _ids(eligibleAssignmentsForDay(
              {'shopAssignments': [a1, a2, a3], 'deliveries': []}, 'd1')) ==
          'a1,a2',
      'בלי מסירות ⇒ כל הפעילים'); n++;

  // 4) בלי שיוכים ⇒ ריק.
  _ok(
      eligibleAssignmentsForDay({'shopAssignments': [], 'deliveries': []}, 'd1')
              .length ==
          0,
      'בלי שיוכים ⇒ ריק'); n++;

  // 5) הפלט מצביע לאובייקט-המקור (לא עותק).
  _ok(identical(eligibleAssignmentsForDay(db, 'd2')[0], a1),
      'הפלט מצביע לאובייקט-המקור (לא עותק)'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_ids(eligibleAssignmentsForDay(db, 'd1')) == 'a2', 'assert-live guard');

  print('OK eligibleAssignmentsForDay: $n asserts passed');
}
