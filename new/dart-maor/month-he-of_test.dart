// בדיקת-חוזה (רתמת-זהב) · monthHeOf — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/month-he-of.test.mjs:
//   [['Av','אב'],['Tishri','תשרי'],['Adar','אדר'],['Adar I','אדר א׳'],
//    ['Adar II','אדר ב׳'],['Heshvan','חשוון'],['Nope','']]
//   + דין-הרישיות: 'av' ⇒ ''.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/month-he-of_test.dart  ⇒ exit 0
import 'month-he-of.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  // — שבע דוגמאות-החוזה verbatim (month-he-of.test.mjs) —
  _eq(monthHeOf('Av'), 'אב', '1 Av');             n++;
  _eq(monthHeOf('Tishri'), 'תשרי', '2 Tishri');   n++;
  _eq(monthHeOf('Adar'), 'אדר', '3 Adar');        n++;
  _eq(monthHeOf('Adar I'), 'אדר א׳', '4 Adar I'); n++;
  _eq(monthHeOf('Adar II'), 'אדר ב׳', '5 Adar II'); n++;
  _eq(monthHeOf('Heshvan'), 'חשוון', '6 Heshvan'); n++;
  _eq(monthHeOf('Nope'), '', '7 Nope -> empty');  n++;

  // — דין-הרישיות (בדיקת-ה-JS): "av" אינו מוכר ⇒ '' —
  _eq(monthHeOf('av'), '', '8 lowercase av -> empty'); n++;

  // גרש עברי ׳ (U+05F3) — מדויק-תו, לא אפוסטרוף ASCII.
  _eq(monthHeOf('Adar I').codeUnitAt(5).toRadixString(16), '5f3',
      '9 geresh U+05F3'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(monthHeOf('Elul') == 'אלול', 'assert-live guard');

  print('OK monthHeOf: $n asserts passed');
}
