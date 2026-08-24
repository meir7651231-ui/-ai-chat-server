// בדיקת-חוזה (רתמת-זהב) · faviconDataUri — מייבאת אך ורק את האטום-שלה (חוק-4).
// 12 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/favicon-data-uri.test.mjs.
// אם עובר ⇒ Dart≡JS (כולל עברית %D7, רווחים %20, %3A/%2F/%40).
// הרצה: dart run --enable-asserts new/dart-maor/favicon-data-uri_test.dart  ⇒ exit 0
import 'favicon-data-uri.dart';

// קידומת/סיומת ה-SVG המקודדות — קבועות בכל הקלטות; ה"אמצע" = הקידוד של הקלט.
const _pre =
    "data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20100%20100'%3E%3Ctext%20x%3D'50'%20y%3D'52'%20font-size%3D'72'%20text-anchor%3D'middle'%20dominant-baseline%3D'central'%3E";
const _post = "%3C%2Ftext%3E%3C%2Fsvg%3E";

String _want(String mid) => _pre + mid + _post;

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]:\n  got =$got\n  want=$want');
  }
}

void main() {
  var n = 0;

  _eq(faviconDataUri(''), _want(''), '1 ""'); n++;
  _eq(faviconDataUri('אבג'), _want('%D7%90%D7%91%D7%92'), '2 אבג'); n++;
  _eq(faviconDataUri('כהן לוי'),
      _want('%D7%9B%D7%94%D7%9F%20%D7%9C%D7%95%D7%99'), '3 כהן לוי'); n++;
  _eq(faviconDataUri('abc'), _want('abc'), '4 abc'); n++;
  _eq(faviconDataUri('a@b.com'), _want('a%40b.com'), '5 a@b.com'); n++;
  _eq(faviconDataUri('2026-08-24'), _want('2026-08-24'), '6 date'); n++;
  _eq(faviconDataUri('2026-08-24T12:00:00'),
      _want('2026-08-24T12%3A00%3A00'), '7 datetime'); n++;
  _eq(faviconDataUri('0501234567'), _want('0501234567'), '8 phone'); n++;
  _eq(faviconDataUri('03-1234567'), _want('03-1234567'), '9 phone2'); n++;
  _eq(faviconDataUri('https://x.co'), _want('https%3A%2F%2Fx.co'), '10 url'); n++;
  _eq(faviconDataUri('שלום עולם'),
      _want('%D7%A9%D7%9C%D7%95%D7%9D%20%D7%A2%D7%95%D7%9C%D7%9D'),
      '11 שלום עולם'); n++;
  _eq(faviconDataUri('12'), _want('12'), '12 12'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(faviconDataUri('abc') == _want('abc'), 'assert-live guard');

  print('OK faviconDataUri: $n asserts passed');
}
