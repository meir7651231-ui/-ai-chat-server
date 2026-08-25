// בדיקת-חוזה (רתמת-זהב) · presentsInMonth — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/presents-in-month.test.mjs:
//   1) (['2026-08-01','2026-08-24','2026-07-31'], '2026-08-24') ⇒ 2  (יולי לא נספר)
//   2) (undefined→null,                          '2026-08-24') ⇒ 0
//   3) ([],                                       '2026-08-24') ⇒ 0
//   4) (['2026-08-05', null, 7],                  '2026-08-24') ⇒ 1  (לא-מחרוזת מדולג)
//   5) (['2025-08-10'],                           '2026-08-24') ⇒ 0  (שנה אחרת)
// המרה: undefined ⇒ null · מערך-מעורב ⇒ List<Object?>. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/presents-in-month_test.dart ⇒ exit 0
import 'presents-in-month.dart';

void _eq(int got, int want, String msg) {
  if (got != want) throw StateError('FAIL: $msg — got $got ≠ want $want');
}

void main() {
  var n = 0;

  _eq(presentsInMonth(
      <Object?>['2026-08-01', '2026-08-24', '2026-07-31'], '2026-08-24'),
      2, 'שלושה תאריכים, יולי לא נספר'); n++;

  _eq(presentsInMonth(null, '2026-08-24'), 0, 'presents חסר ⇒ 0'); n++;

  _eq(presentsInMonth(<Object?>[], '2026-08-24'), 0, 'רשימה ריקה ⇒ 0'); n++;

  _eq(presentsInMonth(<Object?>['2026-08-05', null, 7], '2026-08-24'), 1,
      'לא-מחרוזת (null,7) מדולג'); n++;

  _eq(presentsInMonth(<Object?>['2025-08-10'], '2026-08-24'), 0,
      'שנה אחרת — אותו חודש לא מספיק'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(presentsInMonth(<Object?>['2026-08-01', '2026-08-24', '2026-07-31'],
          '2026-08-24') == 2, 'assert-live guard');

  print('OK presentsInMonth: $n asserts passed');
}
