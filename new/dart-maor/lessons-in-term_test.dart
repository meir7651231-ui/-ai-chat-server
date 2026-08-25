// בדיקת-חוזה (רתמת-זהב) · lessonsInTerm — מייבאת אך ורק את האטום-שלה (חוק-4).
// שבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/lessons-in-term.test.mjs:
//   1) (2,week,weekly)            ⇒ 2
//   2) (2,week,biweekly)          ⇒ 4            (perWeek×2)
//   3) (1,week,monthly)           ⇒ 52/12        (המרת שבוע→חודש) · WEEKS_PER_MONTH == 52/12
//   4) (4,month,months,3)         ⇒ 12           (perMonth×n)
//   5) (4,month,year)             ⇒ 48   · (4,month,half_year) ⇒ 24
//   6) (99,week,once)             ⇒ 1            (חד-פעמי מתעלם מתדירות)
//   7) (NaN,week,weekly) ⇒ 0 · (-3,week,weekly) ⇒ 0 · (2,week,nonsense) ⇒ 0
// המרה: === של JS על מספרים ⇒ == ב-Dart (2==2.0, 52/12==52/12). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/lessons-in-term_test.dart  ⇒ exit 0
import 'lessons-in-term.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1) שבועי
  _ok(lessonsInTerm(2, 'week', 'weekly') == 2, 'דוגמה 1: (2,week,weekly) ≠ 2'); n++;
  // 2) דו-שבועי = perWeek×2
  _ok(lessonsInTerm(2, 'week', 'biweekly') == 4, 'דוגמה 2: (2,week,biweekly) ≠ 4'); n++;
  // 3) המרה שבוע→חודש
  _ok(lessonsInTerm(1, 'week', 'monthly') == 52 / 12, 'דוגמה 3: (1,week,monthly) ≠ 52/12'); n++;
  _ok(WEEKS_PER_MONTH == 52 / 12, 'הקבוע WEEKS_PER_MONTH ≠ 52/12'); n++;
  // 4) מספר-חודשים
  _ok(lessonsInTerm(4, 'month', 'months', 3) == 12, 'דוגמה 4: (4,month,months,3) ≠ 12'); n++;
  // 5) שנתי + חצי-שנתי
  _ok(lessonsInTerm(4, 'month', 'year') == 48, 'דוגמה 5: (4,month,year) ≠ 48'); n++;
  _ok(lessonsInTerm(4, 'month', 'half_year') == 24, 'דוגמה 5: (4,month,half_year) ≠ 24'); n++;
  // 6) חד-פעמי מתעלם מתדירות
  _ok(lessonsInTerm(99, 'week', 'once') == 1, 'דוגמה 6: once ≠ 1'); n++;
  // 7) קצוות: NaN / שלילי / term לא-מוכר
  _ok(lessonsInTerm(double.nan, 'week', 'weekly') == 0, 'דוגמה 7: NaN ≠ 0'); n++;
  _ok(lessonsInTerm(-3, 'week', 'weekly') == 0, 'דוגמה 7: שלילי ≠ 0'); n++;
  _ok(lessonsInTerm(2, 'week', 'nonsense') == 0, 'דוגמה 7: term לא-מוכר ≠ 0'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(lessonsInTerm(2, 'week', 'weekly') == 2, 'assert-live guard');

  print('OK lessonsInTerm: $n asserts passed');
}
