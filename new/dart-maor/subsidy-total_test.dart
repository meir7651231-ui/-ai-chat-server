// בדיקת-חוזה (רתמת-זהב) · subsidyTotal — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/subsidy-total.test.mjs:
//   1) givenValue⇒500,  collectedPaid⇒120  ⇒ 380
//   2) givenValue⇒0,    collectedPaid⇒0    ⇒ 0   (אין שיוכים)
//   3) givenValue⇒300,  collectedPaid⇒300  ⇒ 0   (שולם מלוא-השווי — אפס סבסוד)
//   4) givenValue⇒250.5, collectedPaid⇒100.25 ⇒ 150.25 (אין עיגול)
//   5) assignments מגיע לשני השקעים כמו-שהוא (אותה רפרנס — === ב-JS ⇒ identical ב-Dart)
// השוואת-מערכים (כלל-8): אורך + איבר-איבר — לא נדרשת כאן (הפלט מספר), הרפרנס נבדקת ב-identical.
// הרצה: dart run --enable-asserts new/dart-maor/subsidy-total_test.dart  ⇒ exit 0
import 'subsidy-total.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

/// שקע-קבוע — מקביל ל-konst(n) שבבדיקת-ה-JS: מתעלם מהקלט ומחזיר n.
dynamic Function(dynamic) _konst(num n) => (dynamic _) => n;

void main() {
  var n = 0;

  // 1) הפרש בסיסי: 500-120 ⇒ 380.
  _ok(subsidyTotal(<dynamic>[], _konst(500), _konst(120)) == 380,
      'דוגמה 1: 500-120 ≠ 380'); n++;

  // 2) אין שיוכים: 0-0 ⇒ 0.
  _ok(subsidyTotal(<dynamic>[], _konst(0), _konst(0)) == 0,
      'דוגמה 2: 0-0 ≠ 0'); n++;

  // 3) שולם מלוא-השווי: 300-300 ⇒ 0 — אפס סבסוד.
  _ok(subsidyTotal(<dynamic>[], _konst(300), _konst(300)) == 0,
      'דוגמה 3: אפס-סבסוד שגוי'); n++;

  // 4) אין עיגול: 250.5-100.25 ⇒ 150.25 בדיוק.
  _ok(subsidyTotal(<dynamic>[], _konst(250.5), _konst(100.25)) == 150.25,
      'דוגמה 4: עיגול לא-רצוי'); n++;

  // 5) assignments מועבר כמו-שהוא (אותה רפרנס) לשני השקעים — === ⇒ identical.
  final as_ = <dynamic>[{'id': 'a1'}];
  dynamic seenG, seenC;
  subsidyTotal(as_, (dynamic x) { seenG = x; return 10; },
                    (dynamic x) { seenC = x; return 4; });
  _ok(identical(seenG, as_) && identical(seenC, as_),
      'דוגמה 5: הרפרנס לא הועברה כמו-שהיא'); n++;

  // חיזוק-סדר (סמנטיקת-JS: אופרנד-שמאל מוערך קודם): givenValue לפני collectedPaid.
  final order = <String>[];
  subsidyTotal(as_, (dynamic _) { order.add('g'); return 1; },
                    (dynamic _) { order.add('c'); return 1; });
  _ok(order.length == 2 && order[0] == 'g' && order[1] == 'c',
      'סדר-הקריאות שונה מהמקור (givenValue קודם)'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(subsidyTotal(<dynamic>[], _konst(500), _konst(120)) == 380, 'assert-live guard');

  print('OK subsidyTotal: $n asserts passed');
}
