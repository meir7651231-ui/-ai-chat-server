// בדיקת-חוזה (רתמת-זהב) · normId — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/norm-id.test.mjs (12 הקלטות-Golden):
//   [["",""],["אבג",""],["כהן לוי",""],["abc",""],["a@b.com",""],
//    ["2026-08-24","20260824"],["2026-08-24T12:00:00","20260824120000"],
//    ["0501234567","0501234567"],["03-1234567","031234567"],
//    ["https://x.co",""],["שלום עולם",""],["12",""]]
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/norm-id_test.dart  ⇒ exit 0
import 'norm-id.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  // — 12 דוגמאות-הזהב verbatim (norm-id.test.mjs) —
  _eq(normId(''), '', '1 empty');                               n++;
  _eq(normId('אבג'), '', '2 hebrew letters');                   n++;
  _eq(normId('כהן לוי'), '', '3 name');                         n++;
  _eq(normId('abc'), '', '4 latin');                            n++;
  _eq(normId('a@b.com'), '', '5 email');                        n++;
  _eq(normId('2026-08-24'), '20260824', '6 date');              n++;
  _eq(normId('2026-08-24T12:00:00'), '20260824120000', '7 datetime'); n++;
  _eq(normId('0501234567'), '0501234567', '8 phone');           n++;
  _eq(normId('03-1234567'), '031234567', '9 landline');         n++;
  _eq(normId('https://x.co'), '', '10 url');                    n++;
  _eq(normId('שלום עולם'), '', '11 hebrew phrase');             n++;
  _eq(normId('12'), '', '12 too-short');                        n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(normId('2026-08-24') == '20260824', 'assert-live guard');

  print('OK normId: $n asserts passed');
}
