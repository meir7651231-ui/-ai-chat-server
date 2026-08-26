import '../dart-data-maor/rule-plural-terms.dart';
// בדיקת-חוזה (רתמת-זהב) · rulePlural — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/rule-plural.test.mjs:
//   rulePlural('חוגימ','חוג', term: (k)=>kTerms[k]!) === 70 · rulePlural('חוג','חוגימ', term: (k)=>kTerms[k]!) === null
// ‏+ קצוות-נאמנות (חוק-4): סיומת 'ות' · startsWith (מונח ארוך-מהגזע) · אורך 4 עם
// סיומת ⇒ null · אורך 5 בלי סיומת ⇒ null · מונח-ריק ⇒ null · מונח שאינו-הגזע ⇒ null.
// הפלט int?/null — אין השוואת-מערכים (כלל-8 לא-רלוונטי כאן).
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/rule-plural_test.dart  ⇒ exit 0
import 'rule-plural.dart';

void _eq(int? got, int? want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — שתי דוגמאות בדיקת-ה-JS verbatim (rule-plural.test.mjs) —
  _eq(rulePlural('חוגימ', 'חוג', term: (k)=>kTerms[k]!), 70, "1 'חוגימ' vs 'חוג' -> 70");        n++;
  _eq(rulePlural('חוג', 'חוגימ', term: (k)=>kTerms[k]!), null, "2 'חוג' len<5 -> null");         n++;

  // — קצוות-נאמנות (אותה סמנטיקה ב-JS: length>=5 + endsWith + slice(0,-2)) —
  _eq(rulePlural('תרומות', 'תרומ', term: (k)=>kTerms[k]!), 70, "3 suffix 'ות' -> 70");           n++;
  _eq(rulePlural('חוגימ', 'חוגים', term: (k)=>kTerms[k]!), 70, '4 term startsWith stem -> 70');  n++;
  _eq(rulePlural('שבימ', 'שב', term: (k)=>kTerms[k]!), null, '5 len 4 with suffix -> null');     n++;
  _eq(rulePlural('חוגינ', 'חוג', term: (k)=>kTerms[k]!), null, '6 no plural suffix -> null');    n++;
  _eq(rulePlural('חוגימ', 'חו', term: (k)=>kTerms[k]!), null, '7 term not the stem -> null');    n++;
  _eq(rulePlural('חוגימ', '', term: (k)=>kTerms[k]!), null, '8 empty term -> null');             n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(rulePlural('חוגימ', 'חוג', term: (k)=>kTerms[k]!) == 70, 'assert-live guard');

  print('OK rulePlural: $n asserts passed');
}
