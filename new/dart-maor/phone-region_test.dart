// בדיקת-חוזה (רתמת-זהב) · phoneRegion — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/phone-region.test.mjs:
//   9 זוגות קלט⇒פלט + null⇒'il'. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/phone-region_test.dart  ⇒ exit 0
import 'phone-region.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  // — תשע דוגמאות-החוזה verbatim (phone-region.test.mjs, מערך C) —
  _eq(phoneRegion(''), 'il', "1 '' -> il");                          n++;
  _eq(phoneRegion('0521234567'), 'il', '2 0521234567 -> il');        n++;
  _eq(phoneRegion('050-123-4567'), 'il', '3 050-123-4567 -> il');    n++;
  _eq(phoneRegion('+972521234567'), 'il', '4 +972521234567 -> il');  n++;
  _eq(phoneRegion('00972521234567'), 'il', '5 00972521234567 -> il'); n++;
  _eq(phoneRegion('521234567'), 'il', '6 521234567 -> il');          n++;
  _eq(phoneRegion('+15551234567'), 'intl', '7 +15551234567 -> intl'); n++;
  _eq(phoneRegion('0015551234567'), 'intl', '8 0015551234567 -> intl'); n++;
  _eq(phoneRegion('1234567'), 'intl', '9 1234567 -> intl');          n++;

  // null ⇒ 'il' (מחקה `raw || ''` של JS; כלל-המרה 2/7).
  _eq(phoneRegion(null), 'il', '10 null -> il');                     n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(phoneRegion('+15551234567') == 'intl', 'assert-live guard');

  print('OK phoneRegion: $n asserts passed');
}
