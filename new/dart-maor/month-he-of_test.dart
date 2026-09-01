import '../dart-data-maor/month-he-of-sockets.dart' as sk_month_he_of;
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
  _eq(monthHeOf('Av', sk_month_he_of.monthHeOf_MONTHS), 'אב', '1 Av');             n++;
  _eq(monthHeOf('Tishri', sk_month_he_of.monthHeOf_MONTHS), 'תשרי', '2 Tishri');   n++;
  _eq(monthHeOf('Adar', sk_month_he_of.monthHeOf_MONTHS), 'אדר', '3 Adar');        n++;
  _eq(monthHeOf('Adar I', sk_month_he_of.monthHeOf_MONTHS), 'אדר א׳', '4 Adar I'); n++;
  _eq(monthHeOf('Adar II', sk_month_he_of.monthHeOf_MONTHS), 'אדר ב׳', '5 Adar II'); n++;
  _eq(monthHeOf('Heshvan', sk_month_he_of.monthHeOf_MONTHS), 'חשוון', '6 Heshvan'); n++;
  _eq(monthHeOf('Nope', sk_month_he_of.monthHeOf_MONTHS), '', '7 Nope -> empty');  n++;

  // — דין-הרישיות (בדיקת-ה-JS): "av" אינו מוכר ⇒ '' —
  _eq(monthHeOf('av', sk_month_he_of.monthHeOf_MONTHS), '', '8 lowercase av -> empty'); n++;

  // גרש עברי ׳ (U+05F3) — מדויק-תו, לא אפוסטרוף ASCII.
  _eq(monthHeOf('Adar I', sk_month_he_of.monthHeOf_MONTHS).codeUnitAt(5).toRadixString(16), '5f3',
      '9 geresh U+05F3'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(monthHeOf('Elul', sk_month_he_of.monthHeOf_MONTHS) == 'אלול', 'assert-live guard');

  print('OK monthHeOf: $n asserts passed');
}
