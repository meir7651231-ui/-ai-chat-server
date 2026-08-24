// בדיקת-חוזה (רתמת-זהב) · famEnrollments — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/fam-enrollments.test.mjs:
//   1) members=[m1,m2] · enrollments=[m1,m3] ⇒ רק שיבוץ-m1 (m3 = משפחה אחרת — בחוץ).
//   2) בלי סינון-סטטוס: {m1,ended} + {m2,wait} ⇒ אורך 2.
//   3) members:[] ⇒ [].
//   4) enrollments:[] ⇒ [].
//   5) סדר-המקור נשמר: [m2,m1,m2] ⇒ n=[1,2,3].
//   6) זהות-הפניה: הרשומה המוחזרת === רשומת-המקור (⇒ identical ב-Dart).
// המרה: === של JS ⇒ identical ב-Dart. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/fam-enrollments_test.dart  ⇒ exit 0
import 'fam-enrollments.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  final fam = {
    'members': [
      {'id': 'm1'},
      {'id': 'm2'},
    ],
  };

  // 1) סינון לפי בני-המשפחה בלבד — שיבוץ-זר (m3) נופל.
  final r1 = famEnrollments({
    'enrollments': [
      {'memberId': 'm1', 'courseId': 'c1'},
      {'memberId': 'm3', 'courseId': 'c1'},
    ],
  }, fam);
  _ok(r1.length == 1, 'שיבוץ-זר נכנס או של-הבית נפל'); n++;
  _ok((r1[0] as Map)['memberId'] == 'm1' && (r1[0] as Map)['courseId'] == 'c1',
      'השיבוץ המסונן אינו m1/c1'); n++;

  // 2) בלי סינון-סטטוס — ended+wait נכללים.
  final r2 = famEnrollments({
    'enrollments': [
      {'memberId': 'm1', 'status': 'ended'},
      {'memberId': 'm2', 'status': 'wait'},
    ],
  }, fam);
  _ok(r2.length == 2, 'ended/wait סוננו — אסור (זו ההיסטוריה המלאה)'); n++;

  // 3) משפחה בלי בנים ⇒ [].
  final r3 = famEnrollments({
    'enrollments': [
      {'memberId': 'm1'},
    ],
  }, {'members': []});
  _ok(r3.isEmpty, 'members:[] ⇒ חייב []'); n++;

  // 4) enrollments ריק ⇒ [].
  final r4 = famEnrollments({'enrollments': []}, fam);
  _ok(r4.isEmpty, 'enrollments:[] ⇒ חייב []'); n++;

  // 5) סדר-המקור נשמר (filter יציב): [m2,m1,m2] ⇒ n=[1,2,3].
  final e5 = [
    {'memberId': 'm2', 'n': 1},
    {'memberId': 'm1', 'n': 2},
    {'memberId': 'm2', 'n': 3},
  ];
  final ord = famEnrollments({'enrollments': e5}, fam)
      .map((x) => (x as Map)['n'])
      .toList();
  _ok(ord.length == 3 && ord[0] == 1 && ord[1] == 2 && ord[2] == 3,
      'הסדר שובש'); n++;

  // 6) זהות-הפניה — הרשומה הוחזרה כמו-שהיא (=== ⇒ identical), אפס העתקה.
  final one = {'memberId': 'm1'};
  final r6 = famEnrollments({
    'enrollments': [one],
  }, fam);
  _ok(identical(r6[0], one), 'הרשומה הועתקה במקום זהות-הפניה'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(identical(r6[0], one), 'assert-live guard');

  print('OK famEnrollments: $n asserts passed');
}
