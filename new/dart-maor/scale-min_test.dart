// בדיקת-חוזה (רתמת-זהב) · scaleMin — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/scale-min.test.mjs:
//   SCALE_MIN === 0.8 · Number.isFinite(SCALE_MIN) · (SCALE_MIN > 0 && < 1)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/scale-min_test.dart  ⇒ exit 0
import 'scale-min.dart';

void main() {
  var n = 0;

  // — שלוש דוגמאות-החוזה, verbatim (scale-min.test.mjs) —
  // 1) הערך === 0.8
  assert(scaleMin == 0.8, 'הערך $scaleMin ≠ 0.8');
  n++;
  // 2) מספר סופי (מקבילת Number.isFinite: לא-NaN ולא-∞)
  assert(scaleMin.isFinite, 'לא מספר סופי');
  n++;
  // 3) הרצפה בין 0 ל-1 (חיובי וקטן מ-1)
  assert(scaleMin > 0 && scaleMin < 1, 'הרצפה לא בין 0 ל-1');
  n++;

  print('OK scaleMin: $n asserts passed');
}
