import '../dart-data-maor/month-en-of.dart';
// בדיקת-חוזה (רתמת-זהב) · monthEnOf — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/month-en-of.test.mjs:
//   [['אב','Av'],['תשרי','Tishri'],['אדר','Adar'],['אדר א׳','Adar I'],
//    ['אדר ב׳','Adar II'],['חשוון','Heshvan'],['שטויות',null]]
//   + דין-הגרש: "אדר א'" (גרש-ASCII) ⇒ null (התאמה מדויקת-תו).
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/month-en-of_test.dart  ⇒ exit 0
import 'month-en-of.dart';

void _eq(String? got, String? want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  // — שבע דוגמאות-החוזה verbatim (month-en-of.test.mjs) —
  _eq(monthEnOf('אב', months: kMonths), 'Av', '1 אב -> Av');                  n++;
  _eq(monthEnOf('תשרי', months: kMonths), 'Tishri', '2 תשרי -> Tishri');      n++;
  _eq(monthEnOf('אדר', months: kMonths), 'Adar', '3 אדר -> Adar');            n++;
  _eq(monthEnOf('אדר א׳', months: kMonths), 'Adar I', '4 אדר א׳ -> Adar I');  n++;
  _eq(monthEnOf('אדר ב׳', months: kMonths), 'Adar II', '5 אדר ב׳ -> Adar II'); n++;
  _eq(monthEnOf('חשוון', months: kMonths), 'Heshvan', '6 חשוון -> Heshvan');  n++;
  _eq(monthEnOf('שטויות', months: kMonths), null, '7 שטויות -> null');        n++;

  // — דין-הגרש: גרש-ASCII (U+0027) אינו הגרש-העברי (U+05F3) ⇒ null —
  _eq(monthEnOf("אדר א'", months: kMonths), null, '8 גרש-ASCII -> null');     n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(monthEnOf('אב', months: kMonths) == 'Av', 'assert-live guard');

  print('OK monthEnOf: $n asserts passed');
}
