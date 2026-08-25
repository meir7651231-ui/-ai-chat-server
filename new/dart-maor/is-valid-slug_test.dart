// בדיקת-חוזה (רתמת-זהב) · isValidSlug — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/is-valid-slug.test.mjs
// (12 הקלטות-Golden; הערכים הומרו ל-Dart — String→bool):
//   [["",false],["אבג",false],["כהן לוי",false],["abc",true],["a@b.com",false],
//    ["2026-08-24",true],["2026-08-24T12:00:00",false],["0501234567",true],
//    ["03-1234567",true],["https://x.co",false],["שלום עולם",false],["12",true]]
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/is-valid-slug_test.dart  ⇒ exit 0
import 'is-valid-slug.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — 12 דוגמאות-החוזה verbatim (is-valid-slug.test.mjs) —
  _eq(isValidSlug(''), false, '1 empty');                       n++;
  _eq(isValidSlug('אבג'), false, '2 hebrew');                   n++;
  _eq(isValidSlug('כהן לוי'), false, '3 hebrew+space');         n++;
  _eq(isValidSlug('abc'), true, '4 abc');                       n++;
  _eq(isValidSlug('a@b.com'), false, '5 email');                n++;
  _eq(isValidSlug('2026-08-24'), true, '6 iso-date');           n++;
  _eq(isValidSlug('2026-08-24T12:00:00'), false, '7 iso-dt');   n++;
  _eq(isValidSlug('0501234567'), true, '8 phone');              n++;
  _eq(isValidSlug('03-1234567'), true, '9 phone-dash');         n++;
  _eq(isValidSlug('https://x.co'), false, '10 url');            n++;
  _eq(isValidSlug('שלום עולם'), false, '11 hebrew-phrase');     n++;
  _eq(isValidSlug('12'), true, '12 min-len');                   n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(isValidSlug('abc') && !isValidSlug('a@b.com'), 'assert-live guard');

  print('OK isValidSlug: $n asserts passed');
}
