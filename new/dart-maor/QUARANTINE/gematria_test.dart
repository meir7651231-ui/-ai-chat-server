// בדיקת-חוזה (רתמת-זהב) · gem — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/gematria.test.mjs:
//   [[15,'ט״ו'],[16,'ט״ז'],[5,'ה׳'],[786,'תשפ״ו'],[30,'ל׳'],
//    [21,'כ״א'],[0,''],[-3,''],[NaN,'']]
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/gematria_test.dart  ⇒ exit 0
import 'gematria.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  // — תשע דוגמאות-החוזה verbatim (gematria.test.mjs) —
  _eq(gem(15), 'ט״ו', '1 gem(15)');          n++;
  _eq(gem(16), 'ט״ז', '2 gem(16)');          n++;
  _eq(gem(5), 'ה׳', '3 gem(5)');             n++;
  _eq(gem(786), 'תשפ״ו', '4 gem(786)');      n++;
  _eq(gem(30), 'ל׳', '5 gem(30)');           n++;
  _eq(gem(21), 'כ״א', '6 gem(21)');          n++;
  _eq(gem(0), '', '7 gem(0)');               n++;
  _eq(gem(-3), '', '8 gem(-3)');             n++;
  _eq(gem(double.nan), '', '9 gem(NaN)');    n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(gem(786) == 'תשפ״ו', 'assert-live guard');

  print('OK gem: $n asserts passed');
}
