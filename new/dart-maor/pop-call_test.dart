// בדיקת-חוזה (רתמת-זהב) · popCall — מייבאת אך ורק את האטום-שלה (חוק-4).
// 12 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/pop-call.test.mjs:
//   כל קלט = מחרוזת; הפלט = אותה מחרוזת בלי התו האחרון; מחרוזת ריקה ⇒ ריקה.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/pop-call_test.dart  ⇒ exit 0
import 'pop-call.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // הקלטות-Golden: [קלט, פלט-צפוי] — זהות ל-CASES של ה-JS.
  final cases = <List<String>>[
    ['', ''],
    ['אבג', 'אב'],
    ['כהן לוי', 'כהן לו'],
    ['abc', 'ab'],
    ['a@b.com', 'a@b.co'],
    ['2026-08-24', '2026-08-2'],
    ['2026-08-24T12:00:00', '2026-08-24T12:00:0'],
    ['0501234567', '050123456'],
    ['03-1234567', '03-123456'],
    ['https://x.co', 'https://x.c'],
    ['שלום עולם', 'שלום עול'],
    ['12', '1'],
  ];

  for (final c in cases) {
    final got = popCall(c[0]);
    _ok(got == c[1], '"${c[0]}" ⇒ "$got" ≠ "${c[1]}"');
    n++;
  }

  // חיזוק-חוזה: null/undefined מוחזר כמו-שהוא (`!calls` במקור).
  _ok(popCall(null) == null, 'null לא הוחזר כמו-שהוא');
  n++;

  // חיזוק: נתיב-המערך (המקור נשען על .length/.slice לשניהם) — הסרת האיבר האחרון.
  final lst = popCall(<int>[1, 2, 3]) as List;
  _ok(lst.length == 2 && lst[0] == 1 && lst[1] == 2, 'נתיב-מערך: slice(0,-1) שגוי');
  n++;
  _ok((popCall(<int>[]) as List).isEmpty, 'מערך-ריק לא הוחזר כמו-שהוא');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(popCall('12') == '1', 'assert-live guard');

  print('OK popCall: $n asserts passed');
}
