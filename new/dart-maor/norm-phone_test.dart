// בדיקת-חוזה (רתמת-זהב) · normPhone — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/norm-phone.test.mjs
// (12 הקלטות-Golden). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/norm-phone_test.dart  ⇒ exit 0
import 'norm-phone.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  // — 12 דוגמאות-Golden verbatim (norm-phone.test.mjs) —
  _eq(normPhone(''), '', '1 "" -> ""');                                 n++;
  _eq(normPhone('אבג'), '', '2 אבג -> ""');                             n++;
  _eq(normPhone('כהן לוי'), '', '3 כהן לוי -> ""');                     n++;
  _eq(normPhone('abc'), '', '4 abc -> ""');                             n++;
  _eq(normPhone('a@b.com'), '', '5 a@b.com -> ""');                     n++;
  _eq(normPhone('2026-08-24'), '20260824', '6 date -> digits');        n++;
  _eq(normPhone('2026-08-24T12:00:00'), '20260824120000', '7 dt');     n++;
  _eq(normPhone('0501234567'), '0501234567', '8 mobile');              n++;
  _eq(normPhone('03-1234567'), '031234567', '9 landline dashes');      n++;
  _eq(normPhone('https://x.co'), '', '10 url -> ""');                  n++;
  _eq(normPhone('שלום עולם'), '', '11 hebrew -> ""');                  n++;
  _eq(normPhone('12'), '12', '12 short');                              n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(normPhone('2026-08-24') == '20260824', 'assert-live guard');

  print('OK normPhone: $n asserts passed');
}
