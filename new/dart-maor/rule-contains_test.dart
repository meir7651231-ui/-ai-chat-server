// בדיקת-חוזה (רתמת-זהב) · ruleContains — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/rule-contains.test.mjs:
//   ruleContains('הנ','כהנ') === 62 · ruleContains('ה','כהנ') === null
// ‏+ קצוות-נאמנות (חוק-4): שאילתה באורך 1 לא-תופסת גם כשמוכלת; מכיל-את-עצמו; לא-מוכל ⇒ null.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/rule-contains_test.dart  ⇒ exit 0
import 'rule-contains.dart';

void _eq(int? got, int? want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — שתי דוגמאות בדיקת-ה-JS verbatim (rule-contains.test.mjs) —
  _eq(ruleContains('הנ', 'כהנ'), 62, "1 'הנ' in 'כהנ' -> 62");   n++;
  _eq(ruleContains('ה', 'כהנ'), null, "2 'ה' len<2 -> null");    n++;

  // — קצוות-נאמנות (אותה סמנטיקה ב-JS: includes + length>=2) —
  _eq(ruleContains('כהנ', 'כהנ'), 62, '3 term equals query -> 62'); n++;
  _eq(ruleContains('הכ', 'כהנ'), null, '4 not contained -> null');  n++;
  _eq(ruleContains('', 'כהנ'), null, '5 empty query -> null');      n++;
  _eq(ruleContains('הנ', ''), null, '6 empty term -> null');        n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(ruleContains('הנ', 'כהנ') == 62, 'assert-live guard');

  print('OK ruleContains: $n asserts passed');
}
