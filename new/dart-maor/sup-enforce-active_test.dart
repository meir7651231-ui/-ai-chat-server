// בדיקת-חוזה (רתמת-זהב) · supEnforceActive — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/sup-enforce-active.test.mjs:
//   1) שקע true  ⇒ true   (אכיפה פעילה — הצד-הדוחף יזריק skey)
//   2) שקע false ⇒ false  (דורמנטי — ברירת-המחדל של הקופסה, ביט-זהה להיום)
//   3) עובר כמות-שהוא, עיוור-לתוכן (טוהר חוק-5): 7 ⇒ 7 · אובייקט ⇒ אותה רפרנס
//   4) דטרמיניסטי וחסר-מצב: קריאות חוזרות ⇒ אותו פלט, אפס דליפה בין קריאות
// המרה: === של JS ⇒ identical ב-Dart (bool/int קטן/Map — כולם משמרים זהות).
// הרצה: dart run --enable-asserts new/dart-maor/sup-enforce-active_test.dart  ⇒ exit 0
import 'sup-enforce-active.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1) אכיפה פעילה ⇒ true (=== במקור ⇒ identical).
  _ok(identical(supEnforceActive(true), true),
      'שקע true ⇒ true (הצד-הדוחף יזריק skey)'); n++;

  // 2) דורמנטי ⇒ false (ביט-זהה להיום).
  _ok(identical(supEnforceActive(false), false),
      'שקע false ⇒ false (ברירת-המחדל של הקופסה)'); n++;

  // 3) עובר כמות-שהוא — עיוור לתוכן (טוהר חוק-5).
  _ok(identical(supEnforceActive(7), 7),
      'ערך-זקיף 7 ⇒ 7 (אותו ערך בדיוק)'); n++;
  final o = {'on': true};
  _ok(identical(supEnforceActive(o), o), 'אובייקט ⇒ אותה רפרנס (===)'); n++;

  // 4) דטרמיניסטי וחסר-מצב.
  _ok(identical(supEnforceActive(true), supEnforceActive(true)),
      'קריאות חוזרות ⇒ אותו פלט'); n++;
  _ok(identical(supEnforceActive(false), supEnforceActive(false)),
      'אפס דליפה בין קריאות'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(identical(supEnforceActive(o), o), 'assert-live guard');

  print('OK supEnforceActive: $n asserts passed');
}
