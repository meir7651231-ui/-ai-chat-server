// בדיקת-חוזה (רתמת-זהב) · normEmail — מייבאת אך ורק את האטום-שלה (חוק-4).
// 12 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/norm-email.test.mjs
// (אותם קלטים→פלטים; הערכים הומרו ל-Dart). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/norm-email_test.dart  ⇒ exit 0
import 'norm-email.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  // — 12 הקלטות-Golden verbatim (norm-email.test.mjs) —
  _eq(normEmail(''), '', '1 empty');                                          n++;
  _eq(normEmail('אבג'), 'אבג', '2 hebrew');                                   n++;
  _eq(normEmail('כהן לוי'), 'כהן לוי', '3 hebrew spaced');                    n++;
  _eq(normEmail('abc'), 'abc', '4 ascii');                                    n++;
  _eq(normEmail('a@b.com'), 'a@b.com', '5 email');                            n++;
  _eq(normEmail('2026-08-24'), '2026-08-24', '6 date');                       n++;
  _eq(normEmail('2026-08-24T12:00:00'), '2026-08-24t12:00:00', '7 datetime'); n++;
  _eq(normEmail('0501234567'), '0501234567', '8 phone');                      n++;
  _eq(normEmail('03-1234567'), '03-1234567', '9 phone dash');                 n++;
  _eq(normEmail('https://x.co'), 'https://x.co', '10 url');                   n++;
  _eq(normEmail('שלום עולם'), 'שלום עולם', '11 hebrew hello');                n++;
  _eq(normEmail('12'), '12', '12 digits');                                    n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(normEmail('2026-08-24T12:00:00') == '2026-08-24t12:00:00', 'assert-live guard');

  print('OK normEmail: $n asserts passed');
}
