// בדיקת-חוזה (רתמת-זהב) · envPath — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/env-path.test.mjs (12 הקלטות-Golden).
// arg0=slug, arg1=cloudRoot. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/env-path_test.dart  ⇒ exit 0
import 'env-path.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  // — 12 דוגמאות-הזהב verbatim (env-path.test.mjs) —
  _eq(envPath('', ''), 'orgs//_enc/envelope', '1 empty,empty');          n++;
  _eq(envPath('', 'אבג'), '_enc/envelope', '2 heb');                     n++;
  _eq(envPath('', 'כהן לוי'), '_enc/envelope', '3 heb-space');           n++;
  _eq(envPath('', 'abc'), '_enc/envelope', '4 ascii');                   n++;
  _eq(envPath('', 'a@b.com'), '_enc/envelope', '5 email');               n++;
  _eq(envPath('', '2026-08-24'), '_enc/envelope', '6 date');             n++;
  _eq(envPath('', '2026-08-24T12:00:00'), '_enc/envelope', '7 datetime'); n++;
  _eq(envPath('', '0501234567'), '_enc/envelope', '8 phone');            n++;
  _eq(envPath('', '03-1234567'), '_enc/envelope', '9 phone-dash');       n++;
  _eq(envPath('', 'https://x.co'), '_enc/envelope', '10 url');           n++;
  _eq(envPath('', 'שלום עולם'), '_enc/envelope', '11 heb-hello');        n++;
  _eq(envPath('', '12'), '_enc/envelope', '12 num-str');                 n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(envPath('', '') == 'orgs//_enc/envelope', 'assert-live guard');

  print('OK envPath: $n asserts passed');
}
