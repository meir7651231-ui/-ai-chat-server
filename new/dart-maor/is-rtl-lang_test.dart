// בדיקת-חוזה (רתמת-זהב) · isRtlLang — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/is-rtl-lang.test.mjs:
//   [['he',true],['yi',true],['en',false],['fr',true],['',true]]
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/is-rtl-lang_test.dart  ⇒ exit 0
import 'is-rtl-lang.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — חמש דוגמאות-החוזה verbatim (is-rtl-lang.test.mjs) —
  _eq(isRtlLang('he'), true, "1 'he' -> true");   n++;
  _eq(isRtlLang('yi'), true, "2 'yi' -> true");   n++;
  _eq(isRtlLang('en'), false, "3 'en' -> false"); n++;
  _eq(isRtlLang('fr'), true, "4 'fr' -> true");   n++; // הכלל עיוור — כל מה שאינו 'en'
  _eq(isRtlLang(''), true, "5 '' -> true");       n++; // מחרוזת-ריקה ≠ 'en'

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(isRtlLang('en') == false, 'assert-live guard');

  print('OK isRtlLang: $n asserts passed');
}
