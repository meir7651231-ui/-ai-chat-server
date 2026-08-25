// בדיקת-חוזה (רתמת-זהב) · monthKey — מייבאת אך ורק את האטום-שלה (חוק-4).
// 12 דוגמאות-ה-Golden זהות ביט-אחר-ביט למקור-ה-JS new/atoms/month-key.test.mjs
// (הקלטות-Golden מהרצת קוד-המקור; כאן מפוענחות מה-JSON לערכי-מחרוזת).
// הפלטים מחרוזות ⇒ השוואת-מחרוזת ישירה (כלל-8 על מערכים אינו רלוונטי כאן).
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/month-key_test.dart  ⇒ exit 0
import 'month-key.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  // — 12 דוגמאות-ה-Golden verbatim (month-key.test.mjs / month-key.contract.md) —
  _eq(monthKey(''), '', '1 ריק');                                          n++;
  _eq(monthKey('אבג'), 'אבג', '2 עברית קצרה');                             n++;
  _eq(monthKey('כהן לוי'), 'כהן לוי', '3 שם דו-מילתי (7 יחידות בדיוק)');   n++;
  _eq(monthKey('abc'), 'abc', '4 לטינית קצרה');                            n++;
  _eq(monthKey('a@b.com'), 'a@b.com', '5 אימייל (7 יחידות בדיוק)');        n++;
  _eq(monthKey('2026-08-24'), '2026-08', '6 תאריך ISO');                   n++;
  _eq(monthKey('2026-08-24T12:00:00'), '2026-08', '7 תאריך ISO עם שעה');   n++;
  _eq(monthKey('0501234567'), '0501234', '8 טלפון נייד');                  n++;
  _eq(monthKey('03-1234567'), '03-1234', '9 טלפון קווי');                  n++;
  _eq(monthKey('https://x.co'), 'https:/', '10 URL');                      n++;
  _eq(monthKey('שלום עולם'), 'שלום עו', '11 עברית ארוכה (קיצוץ ל-7)');     n++;
  _eq(monthKey('12'), '12', '12 מחרוזת קצרה');                             n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(monthKey('2026-08-24') == '2026-08', 'assert-live guard');

  print('OK monthKey: $n asserts passed');
}
