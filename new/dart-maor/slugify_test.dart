import '../dart-data-maor/slugify.dart';
// בדיקת-חוזה (רתמת-זהב) · slugify — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/slugify.test.mjs
// (6 דוגמאות מחייבות מ-slugify.contract.md). כל התוצאות מחרוזות — אין
// השוואת-מערכים (כלל-8 היה מחייב אורך+איבר-איבר). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/slugify_test.dart  ⇒ exit 0
import 'slugify.dart';

void _eq(dynamic got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  // 1) תעתיק עברית + רווח ⇒ מקף
  _eq(slugify('מאור החסד', <String>[], heb2lat: kHeb2lat), 'mavr-hchsd', '1 תעתיק עברי');
  n++;

  // 2) תווים לא-לטיניים קורסים למקף אחד
  _eq(slugify('Café! 123', <String>[], heb2lat: kHeb2lat), 'caf-123', '2 ניקוי תווים');
  n++;

  // 3) קצר מ-2 ⇒ 'org'
  _eq(slugify('א', <String>[], heb2lat: kHeb2lat), 'org', '3 ברירת-מחדל לקצר');
  n++;

  // 4) ייחודיות מול תפוסים
  _eq(slugify('maor', <String>['maor'], heb2lat: kHeb2lat), 'maor-2', '4a סיומת -2');
  n++;
  _eq(slugify('maor', <String>['maor', 'maor-2'], heb2lat: kHeb2lat), 'maor-3', '4b סיומת -3');
  n++;

  // 5) קיצוץ ל-30
  _eq(slugify('a' * 35, <String>[], heb2lat: kHeb2lat), 'a' * 30, '5 קיצוץ-30');
  n++;

  // 6) קיצוץ שנחת על מקף ⇒ גיזום מקפי-סוף
  _eq(slugify('${'a' * 29} b', <String>[], heb2lat: kHeb2lat), 'a' * 29, '6 גיזום מקף-סוף אחרי קיצוץ');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(slugify('מאור החסד', <String>[], heb2lat: kHeb2lat) == 'mavr-hchsd', 'assert-live guard');

  print('OK slugify: $n asserts passed');
}
