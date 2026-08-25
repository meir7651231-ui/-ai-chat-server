// בדיקת-חוזה (רתמת-זהב) · pendingDeliveriesToday — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/pending-deliveries-today.test.mjs:
//   1) הפלט המדויק על todayIso='2026-08-24'  ⇒  ids == 'v1,v3' (סדר-מקור נשמר)
//   2) יום-שחלף-פתוח (d1) לא נשמט            ⇒  v1 נכלל
//   3) delivered (v2) לא נכלל
//   4) יום-עתידי (d3 > today) לא נכלל          ⇒  v4 נשמט
//   5) יום-סגור (d4.closed=true) לא נכלל       ⇒  v5 נשמט
// המרה: filter של JS ⇒ list ב-Dart; join(',') ⇒ .join(','). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/pending-deliveries-today_test.dart  ⇒ exit 0
import 'pending-deliveries-today.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  final db = <String, dynamic>{
    'distributionDays': [
      {'id': 'd1', 'date': '2026-08-20'},
      {'id': 'd2', 'date': '2026-08-24'},
      {'id': 'd3', 'date': '2026-08-25'},
      {'id': 'd4', 'date': '2026-08-10', 'closed': true},
    ],
    'deliveries': [
      {'id': 'v1', 'dayId': 'd1', 'status': 'pending'},
      {'id': 'v2', 'dayId': 'd2', 'status': 'delivered'},
      {'id': 'v3', 'dayId': 'd2', 'status': 'assigned'},
      {'id': 'v4', 'dayId': 'd3', 'status': 'pending'},
      {'id': 'v5', 'dayId': 'd4', 'status': 'pending'},
    ],
  };

  final r = pendingDeliveriesToday(db, '2026-08-24');
  final ids = r.map((d) => d['id']).join(',');

  // 1) הפלט המדויק — סדר-מקור נשמר.
  _ok(ids == 'v1,v3', 'הפלט המדויק: $ids'); n++;

  // 2) יום-שחלף-פתוח נשמט?
  _ok(r.any((d) => d['id'] == 'v1'), 'יום-שחלף-פתוח נשמט'); n++;

  // 3) delivered נכלל?
  _ok(!r.any((d) => d['id'] == 'v2'), 'delivered נכלל'); n++;

  // 4) יום-עתידי נכלל?
  _ok(!r.any((d) => d['id'] == 'v4'), 'יום-עתידי נכלל'); n++;

  // 5) יום-סגור נכלל?
  _ok(!r.any((d) => d['id'] == 'v5'), 'יום-סגור נכלל'); n++;

  // חיזוק-זהות: המסירות המוחזרות הן אותן רפרנסות-מקור (filter לא מעתיק).
  _ok(identical(r[0], (db['deliveries'] as List)[0]),
      'v1: לא אותה רפרנס-מקור'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(pendingDeliveriesToday(db, '2026-08-24').map((d) => d['id']).join(',') ==
      'v1,v3', 'assert-live guard');

  print('OK pendingDeliveriesToday: $n asserts passed');
}
