// בדיקת-חוזה · waMeDigits — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/wa_me_digits_test.dart
import 'wa_me_digits.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  // — דוגמאות-החוזה verbatim —
  _eq(waMeDigits('050-123 4567'), '972501234567', '1 israeli-local');      n++;
  _eq(waMeDigits('+972 50 123 4567'), '972501234567', '2 plus-intl');      n++;
  _eq(waMeDigits('00972501234567'), '972501234567', '3 double-zero');      n++;
  _eq(waMeDigits('972501234567'), '972501234567', '4 already-intl');       n++;
  _eq(waMeDigits('abc'), '', '5 no-digits');                              n++;
  _eq(waMeDigits(''), '', '6 empty');                                     n++;
  _eq(waMeDigits('00'), '', '7 bare-00');                                 n++;
  _eq(waMeDigits('0'), '972', '8 bare-trunk-zero');                       n++;
  _eq(waMeDigits('000123'), '972123', '9 cascade-00-then-0');             n++;
  _eq(waMeDigits('(050) 123-4567'), '972501234567', '10 parens-strip');  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(waMeDigits('050-123 4567') == '972501234567', 'assert-live guard');

  print('OK waMeDigits: $n asserts passed');
}
