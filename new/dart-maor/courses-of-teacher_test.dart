// בדיקת-חוזה (רתמת-זהב) · coursesOfTeacher — מייבאת אך ורק את האטום-שלה (חוק-4).
// 12 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/courses-of-teacher.test.mjs
// (אותם קלטים→פלטים; כל דוגמה = teacherId falsy '' או 0 ⇒ courses מוחזר כמו-שהוא):
//   1)  "",          ""  ⇒ ""
//   2)  "",          0   ⇒ ""
//   3)  "אבג",       ""  ⇒ "אבג"
//   4)  "אבג",       0   ⇒ "אבג"
//   5)  "כהן לוי",   ""  ⇒ "כהן לוי"
//   6)  "כהן לוי",   0   ⇒ "כהן לוי"
//   7)  "abc",       ""  ⇒ "abc"
//   8)  "abc",       0   ⇒ "abc"
//   9)  "a@b.com",   ""  ⇒ "a@b.com"
//   10) "a@b.com",   0   ⇒ "a@b.com"
//   11) "2026-08-24","" ⇒ "2026-08-24"
//   12) "2026-08-24",0  ⇒ "2026-08-24"
// המרה: הזהב הקליט courses כמחרוזת + teacherId falsy ⇒ תמיד ענף-ה-else (courses כמו-שהוא).
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/courses-of-teacher_test.dart  ⇒ exit 0
import 'courses-of-teacher.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 12 דוגמאות-הזהב: courses מחרוזת · teacherId falsy ('' / 0) ⇒ מוחזר כמו-שהוא.
  final golden = <List<dynamic>>[
    ['', ''],
    ['', 0],
    ['אבג', ''],
    ['אבג', 0],
    ['כהן לוי', ''],
    ['כהן לוי', 0],
    ['abc', ''],
    ['abc', 0],
    ['a@b.com', ''],
    ['a@b.com', 0],
    ['2026-08-24', ''],
    ['2026-08-24', 0],
  ];
  for (final c in golden) {
    final courses = c[0];
    final teacherId = c[1];
    final got = coursesOfTeacher(courses, teacherId);
    _ok(got == courses, 'courses=$courses teacherId=$teacherId ⇒ $got ≠ $courses');
    // ענף-ה-falsy מחזיר אותה רפרנס בדיוק (בלי העתקה) — כמו במקור-ה-JS.
    _ok(identical(got, courses), 'לא אותה רפרנס: courses=$courses teacherId=$teacherId');
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(identical(coursesOfTeacher('abc', 0), 'abc'), 'assert-live guard');

  print('OK coursesOfTeacher: $n asserts passed');
}
