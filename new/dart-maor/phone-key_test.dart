// בדיקת-חוזה (רתמת-זהב) · phoneKey — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/phone-key.test.mjs (12 הקלטות-Golden):
//   ''→'' · 'אבג'→'' · 'כהן לוי'→'' · 'abc'→'' · 'a@b.com'→'' ·
//   '2026-08-24'→'20260824' · '2026-08-24T12:00:00'→'20260824120000' ·
//   '0501234567'→'501234567' · '03-1234567'→'31234567' · 'https://x.co'→'' ·
//   'שלום עולם'→'' · '12'→'12'
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/phone-key_test.dart  ⇒ exit 0
import 'phone-key.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  _eq(phoneKey(''), '', '1 empty');                                   n++;
  _eq(phoneKey('אבג'), '', '2 hebrew abg');                          n++;
  _eq(phoneKey('כהן לוי'), '', '3 hebrew name');                     n++;
  _eq(phoneKey('abc'), '', '4 abc');                                  n++;
  _eq(phoneKey('a@b.com'), '', '5 email');                            n++;
  _eq(phoneKey('2026-08-24'), '20260824', '6 date');                  n++;
  _eq(phoneKey('2026-08-24T12:00:00'), '20260824120000', '7 datetime'); n++;
  _eq(phoneKey('0501234567'), '501234567', '8 mobile');              n++;
  _eq(phoneKey('03-1234567'), '31234567', '9 landline');             n++;
  _eq(phoneKey('https://x.co'), '', '10 url');                        n++;
  _eq(phoneKey('שלום עולם'), '', '11 hebrew hello');                 n++;
  _eq(phoneKey('12'), '12', '12 short');                              n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(phoneKey('03-1234567') == '31234567', 'assert-live guard');

  print('OK phoneKey: $n asserts passed');
}
