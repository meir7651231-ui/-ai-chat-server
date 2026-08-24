// בדיקת-חוזה (רתמת-זהב) · clampScale — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/clamp-scale.test.mjs:
//   clampScale(1.0)=1 · (2.5)=1.6 · (0.5)=0.8 · (NaN)=1 · (Infinity)=1 ·
//   ('1.2')=1 · (1.2)=1.2 · (5,0,2)=2
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/clamp-scale_test.dart  ⇒ exit 0
import 'clamp-scale.dart';

void _eq(num got, num want, String label) {
  // JS השתמש ב-Object.is; ל-num סופי, השוואת-ערך של Dart שקולה (1==1.0).
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — שמונה בדיקות מ-7 דוגמאות-החוזה, verbatim (clamp-scale.test.mjs) —
  _eq(clampScale(1.0), 1, '1 בתוך הטווח');              n++;
  _eq(clampScale(2.5), 1.6, '2 חיתוך לגבול-עליון');       n++;
  _eq(clampScale(0.5), 0.8, '3 חיתוך לגבול-תחתון');       n++;
  _eq(clampScale(double.nan), 1, '4a NaN ⇒ ברירת-מחדל');  n++;
  _eq(clampScale(double.infinity), 1, '4b ∞ ⇒ ברירת-מחדל'); n++;
  _eq(clampScale('1.2'), 1, '5 מחרוזת אינה מספר');        n++;
  _eq(clampScale(1.2), 1.2, '6 ערך-ביניים נשמר');         n++;
  _eq(clampScale(5, 0, 2), 2, '7 שקעי min/max מוזרקים');  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(clampScale(2.5) == 1.6, 'assert-live guard');

  print('OK clampScale: $n asserts passed');
}
