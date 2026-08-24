// בדיקת-חוזה (רתמת-זהב) · holidayAllowed — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/holiday-allowed.test.mjs:
//   1) {}                          · 'פורים'  ⇒ true   (אין רשימה ⇒ כללי)
//   2) {holidays:[]}               · 'חנוכה'  ⇒ true   (רשימה ריקה ⇒ כללי)
//   3) {holidays:['פורים','חנוכה']} · 'פורים'  ⇒ true   (נמצא ברשימה)
//   4) {holidays:['פורים']}        · 'חנוכה'  ⇒ false  (לא ברשימה)
//   5) {holidays:['פורים']}        · 'פורים ' ⇒ false  (רווח-נגרר ⇒ אי-התאמה)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/holiday-allowed_test.dart  ⇒ exit 0
import 'holiday-allowed.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1) אין רשימת-חגים ⇒ כללי לכל חג.
  _ok(holidayAllowed({}, 'פורים') == true, "1) {} · 'פורים' ≠ true"); n++;

  // 2) רשימה ריקה ⇒ כללי.
  _ok(holidayAllowed({'holidays': []}, 'חנוכה') == true,
      "2) [] · 'חנוכה' ≠ true"); n++;

  // 3) החג נמצא ברשימה.
  _ok(holidayAllowed({'holidays': ['פורים', 'חנוכה']}, 'פורים') == true,
      "3) ['פורים','חנוכה'] · 'פורים' ≠ true"); n++;

  // 4) החג לא ברשימה.
  _ok(holidayAllowed({'holidays': ['פורים']}, 'חנוכה') == false,
      "4) ['פורים'] · 'חנוכה' ≠ false"); n++;

  // 5) רווח-נגרר ⇒ אי-התאמה מדויקת.
  _ok(holidayAllowed({'holidays': ['פורים']}, 'פורים ') == false,
      "5) ['פורים'] · 'פורים ' ≠ false"); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(holidayAllowed({}, 'פורים') == true, 'assert-live guard');

  print('OK holidayAllowed: $n asserts passed');
}
