// בדיקת-חוזה (רתמת-זהב) · installAvailable — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/install-available.test.mjs:
//   1) null                              ⇒ false  (טרם נלכד / כבר נוצל)
//   2) {prompt(){}, userChoice:{}}        ⇒ true   (אירוע-שנלכד)
//   3) {}                                 ⇒ true   (כל אובייקט ≠ null)
//   4) undefined                          ⇒ true   — בלתי-ניתן-לביטוי ב-Dart (אין undefined);
//      במקור `!== null` בלבד, והחוזה מסמן "לא קורה" (הקופסה מזריקה null-או-אירוע).
//      ב-Dart null הוא הערך-הנוֹל היחיד = case 1; אין ערך שני להבחין. מתועד, לא נבדק.
// המרה: `!== null` של JS ⇒ `!= null` ב-Dart (null≠undefined לא רלוונטי — אין undefined).
// הרצה: dart run --enable-asserts new/dart-maor/install-available_test.dart  ⇒ exit 0
import 'install-available.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1) null ⇒ false — טרם נלכד אירוע.
  _ok(installAvailable(null) == false, 'null צריך false'); n++;

  // 2) אירוע-שנלכד (אובייקט עם prompt+userChoice) ⇒ true.
  final ev = {'prompt': () {}, 'userChoice': <String, Object?>{}};
  _ok(installAvailable(ev) == true, 'אירוע-שנלכד צריך true'); n++;

  // 3) כל אובייקט ≠ null ⇒ true (עיוור-לתוכן — גם מפה ריקה).
  _ok(installAvailable(<String, Object?>{}) == true, 'מפה-ריקה צריך true'); n++;

  // חיזוק (חוק-5, עיוור-לתוכן): ערכים לא-null נוספים ⇒ true.
  _ok(installAvailable(0) == true, '0 (לא-null) צריך true'); n++;
  _ok(installAvailable('') == true, "'' (לא-null) צריך true"); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(installAvailable(null) == false, 'assert-live guard');

  print('OK installAvailable: $n asserts passed');
}
