// בדיקת-חוזה (רתמת-זהב) · tierOrder — מייבאת אך ורק את האטום-שלה (חוק-4).
// מתרגמת את בדיקת-ה-JS new/atoms/tier-order.test.mjs (צילום-ערך):
//   SNAP: JSON.stringify(TIER_ORDER) === '["זהב","כסף","ארד","רדומה"]'
// ההשוואה כאן איבר-איבר + אורך (חוק-8: לעולם לא join — גבול-איבר), שווה-ערך
// קפדני לצילום-ה-JSON: אותו אורך + אותן מחרוזות באותו סדר ⇔ אותו stringify.
// וכן דוגמאות-החוזה הנגזרות: הערך זהה-ביט לצילום (4 איברים, אפס-כפילות).
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/tier-order_test.dart  ⇒ exit 0
import 'tier-order.dart';

void main() {
  var n = 0;
  final m = tierOrder;

  // הצילום מבדיקת-ה-JS — הערך המלא, כלשונו.
  const want = ['זהב', 'כסף', 'ארד', 'רדומה'];

  // 1) אורך זהה לצילום (חוק-8: קודם אורך).
  if (m.length != want.length) {
    throw StateError('FAIL: אורך ${m.length} ≠ ${want.length} — סטה מהצילום');
  }
  n++;

  // 2) איבר-איבר מול הצילום (חוק-8: לא join, גבול-איבר).
  for (var i = 0; i < want.length; i++) {
    if (m[i] != want[i]) {
      throw StateError("FAIL: [$i]='${m[i]}' ≠ '${want[i]}' — סטה מהצילום");
    }
  }
  n++;

  // 3) אפס-כפילות (תכונת-הצילום: 4 ערכים שונים).
  if (m.toSet().length != m.length) {
    throw StateError('FAIL: כפילות בדרגות');
  }
  n++;

  // 4) קריאה-חוזרת מחזירה אותו ערך (קבוע יציב, לא מוטבל).
  final again = tierOrder;
  if (again.length != m.length) {
    throw StateError('FAIL: קריאה-חוזרת שינתה אורך');
  }
  for (var i = 0; i < m.length; i++) {
    if (again[i] != m[i]) {
      throw StateError('FAIL: קריאה-חוזרת סטתה באיבר $i');
    }
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(tierOrder[0] == 'זהב' && tierOrder[3] == 'רדומה', 'assert-live guard');

  print('OK tierOrder: $n asserts passed');
}
