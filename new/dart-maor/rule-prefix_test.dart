// בדיקת-חוזה (רתמת-זהב) · rulePrefix — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה + בדיקת-ה-JS זהות ביט-אחר-ביט למקור new/atoms/rule-prefix.test.mjs:
//   rulePrefix('כה','כהנ') === 80 · rulePrefix('הנ','כהנ') === null
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/rule-prefix_test.dart  ⇒ exit 0
import 'rule-prefix.dart';

void _eq(int? got, int? want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — שתי דוגמאות בדיקת-ה-JS verbatim (rule-prefix.test.mjs) —
  _eq(rulePrefix('כה', 'כהנ'), 80, "1 'כה' קידומת של 'כהנ' -> 80");   n++;
  _eq(rulePrefix('הנ', 'כהנ'), null, "2 'הנ' לא-קידומת -> null");      n++;

  // — קצוות שקולי-JS (startsWith זהה בשתי השפות) —
  _eq(rulePrefix('', 'כהנ'), 80, '3 שאילתה-ריקה: JS/Dart startsWith(\'\') -> true -> 80'); n++;
  _eq(rulePrefix('כהנ', 'כהנ'), 80, '4 מונח==שאילתה -> 80');           n++;
  _eq(rulePrefix('כהנא', 'כהנ'), null, '5 שאילתה ארוכה מהמונח -> null'); n++;
  _eq(rulePrefix('', ''), 80, '6 שתיהן ריקות -> 80');                   n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(rulePrefix('כה', 'כהנ') == 80, 'assert-live guard');

  print('OK rulePrefix: $n asserts passed');
}
