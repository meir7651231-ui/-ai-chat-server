// בדיקת-חוזה (רתמת-זהב) · familyContext — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/family-context.test.mjs.
// הרצה: dart run --enable-asserts new/dart-maor/family-context_test.dart  ⇒ exit 0
import 'family-context.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void _eq(Map<String, int> got, int open, int active, String msg) {
  _ok(got['openDeliveries'] == open && got['activeAssignments'] == active,
      '$msg ⇒ $got');
}

void main() {
  var n = 0;

  // 1) מסירות: 'delivered' ומשפחה-אחרת לא נספרים.
  _eq(
      familyContext({
        'deliveries': [
          {'familyId': 'f1', 'status': 'pickup'},
          {'familyId': 'f1', 'status': 'delivered'},
          {'familyId': 'f2', 'status': 'pickup'},
        ]
      }, 'f1'),
      1, 0, 'ספירת-מסירות שגויה');
  n++;

  // 2) שיוכים: רק 'active'.
  _eq(
      familyContext({
        'shopAssignments': [
          {'famId': 'f1', 'status': 'active'},
          {'famId': 'f1', 'status': 'redeemed'},
          {'famId': 'f2', 'status': 'active'},
        ]
      }, 'f1'),
      0, 1, 'ספירת-שיוכים שגויה');
  n++;

  // 3) db בלי המערכים ⇒ אפסים בלי קריסה.
  _eq(familyContext({}, 'f1'), 0, 0, 'db ריק קרס/שגוי');
  n++;

  // 4) מסירה בלי status = פתוחה; שיוך בלי status = לא נספר.
  _eq(
      familyContext({
        'deliveries': [
          {'familyId': 'f1'}
        ],
        'shopAssignments': [
          {'famId': 'f1'}
        ]
      }, 'f1'),
      1, 0, 'דין חסר-סטטוס שגוי');
  n++;

  // 5) הצלבת-שדות: famId במסירה / familyId בשיוך — לא נספרים.
  _eq(
      familyContext({
        'deliveries': [
          {'famId': 'f1', 'status': 'pickup'}
        ],
        'shopAssignments': [
          {'familyId': 'f1', 'status': 'active'}
        ]
      }, 'f1'),
      0, 0, 'שמות-השדה התחלפו');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(familyContext({}, 'f1')['openDeliveries'] == 0, 'assert-live guard');

  print('OK familyContext: $n asserts passed');
}
