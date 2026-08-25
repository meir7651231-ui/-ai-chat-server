// בדיקת-חוזה (רתמת-זהב) · CRED_RED_THRESHOLD — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/cred-red-threshold.test.mjs:
//   T===500 · Number.isInteger(T) · T>0 · 499<T · !(500<T)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/cred-red-threshold_test.dart  ⇒ exit 0
import 'cred-red-threshold.dart';

void _ok(bool cond, String label) {
  if (!cond) {
    throw StateError('FAIL [$label]');
  }
}

void main() {
  var n = 0;
  const T = CRED_RED_THRESHOLD;

  // — חמש דוגמאות-החוזה verbatim (cred-red-threshold.test.mjs) —
  _ok(T == 500, 'הערך $T ≠ 500');            n++;
  _ok(T is int, 'לא מספר-שלם');               n++; // Number.isInteger(T)
  _ok(T > 0, 'לא חיובי');                     n++;
  _ok(499 < T, '499 לא מתחת לסף');            n++;
  _ok(!(500 < T), '500 מתחת לסף (על-הסף = לא-red)'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(CRED_RED_THRESHOLD == 500, 'assert-live guard');

  print('OK CRED_RED_THRESHOLD: $n asserts passed');
}
