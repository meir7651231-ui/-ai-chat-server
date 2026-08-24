// בדיקת-חוזה (רתמת-זהב) · currentId — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/current-id.test.mjs:
//   1) queue:['a','b','c']  ⇒ currentId(c) == 'a'   (חזית)
//   2) queue:['x']          ⇒ currentId == 'x'       (יחיד)
//   3) queue:[]             ⇒ currentId == null       (ריק)
//   4) התור לא השתנה — c['queue'].length==3 ו-c['queue'][0]=='a'  (חסר-מוטביליות)
// המרה: truthiness של length (JS) ⇒ isNotEmpty (Dart). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/current-id_test.dart  ⇒ exit 0
import 'current-id.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1) חזית התור.
  final c = {
    'queue': ['a', 'b', 'c']
  };
  _ok(currentId(c) == 'a', "חזית ≠ 'a'"); n++;

  // 2) תור בן-פריט-אחד.
  _ok(currentId({'queue': ['x']}) == 'x', "יחיד ≠ 'x'"); n++;

  // 3) תור ריק ⇒ null.
  _ok(currentId({'queue': []}) == null, 'ריק ≠ null'); n++;

  // 4) התור לא השתנה (קריאה בלבד).
  _ok((c['queue'] as List).length == 3 && (c['queue'] as List)[0] == 'a',
      'התור השתנה'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(currentId(c) == 'a', 'assert-live guard');

  print('OK currentId: $n asserts passed');
}
