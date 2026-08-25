// בדיקת-חוזה (רתמת-זהב) · ruleExact — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה + בדיקת-ה-JS זהות ביט-אחר-ביט למקור new/atoms/rule-exact.test.mjs:
//   ruleExact('כהנ','כהנ') === 100 · ruleExact('כה','כהנ') === null
// אם עובר ⇒ Dart≡JS. (אין מערכים בפלט ⇒ כלל-8 לא-נדרש כאן, אבל העוזר קיים לתבנית.)
// הרצה: dart run --enable-asserts new/dart-maor/rule-exact_test.dart  ⇒ exit 0
import 'rule-exact.dart';

void _eq(dynamic got, dynamic want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — בדיקת-ה-JS verbatim (rule-exact.test.mjs) —
  _eq(ruleExact('כהנ', 'כהנ'), 100, '1 exact match -> 100');       n++;
  _eq(ruleExact('כה', 'כהנ'), null, '2 no exact match -> null');   n++;

  // — קצוות באותה-משפחה (זהות-ערך על מחרוזות, בלי-כפייה) —
  _eq(ruleExact('', ''), 100, '3 empty == empty -> 100');           n++;
  _eq(ruleExact('כהנ', 'כה'), null, '4 reversed prefix -> null');   n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(ruleExact('a', 'a') == 100, 'assert-live guard');

  print('OK ruleExact: $n asserts passed');
}
