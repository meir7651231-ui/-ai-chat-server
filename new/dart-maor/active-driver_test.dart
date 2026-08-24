// בדיקת-חוזה (רתמת-זהב) · activeDriver — מייבאת אך ורק את האטום-שלה (חוק-4).
// שלוש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/active-driver.test.mjs:
//   1) d={id:'manual'}                       ⇒ activeDriver(d) === d  (אותה רפרנס)
//   2) נהג מלא {id,label,capabilities}        ⇒ .id==='manual' ו-.capabilities.autoDial===false
//   3) ערך-זקיף 7                             ⇒ activeDriver(7) === 7   (עיוור-לתוכן, חוק-5)
// המרה: === של JS ⇒ identical ב-Dart. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/active-driver_test.dart  ⇒ exit 0
import 'active-driver.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1) אותה רפרנס — לא עותק (=== במקור ⇒ identical).
  final d = {'id': 'manual'};
  _ok(identical(activeDriver(d), d), 'לא הוחזרה אותה רפרנס'); n++;

  // 2) נהג מלא — שום שדה לא שונה.
  final full = {
    'id': 'manual',
    'label': 'חיוג בלחיצה',
    'capabilities': {'autoDial': false},
  };
  final got = activeDriver(full) as Map;
  _ok(got['id'] == 'manual', "id ≠ 'manual'"); n++;
  _ok((got['capabilities'] as Map)['autoDial'] == false, 'autoDial שונה'); n++;
  // חיזוק-זהות: הנהג המלא הוחזר כמו-שהוא, אותה רפרנס.
  _ok(identical(got, full), 'נהג-מלא: לא אותה רפרנס'); n++;

  // 3) עיוור לתוכן (חוק-5) — ערך-זקיף 7 מוחזר כמו-שהוא.
  _ok(identical(activeDriver(7), 7), 'ערך-זקיף 7 לא הוחזר כמו-שהוא'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(identical(activeDriver(d), d), 'assert-live guard');

  print('OK activeDriver: $n asserts passed');
}
