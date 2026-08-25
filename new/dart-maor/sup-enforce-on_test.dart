// בדיקת-חוזה (רתמת-זהב) · supEnforceOn — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/sup-enforce-on.test.mjs
// (אותם קלטים→פלטים). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/sup-enforce-on_test.dart  ⇒ exit 0
import 'sup-enforce-on.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — דוגמה 1: הדלקה מפורשת בלבד — {supporterEnforce:true} ⇒ true —
  _eq(supEnforceOn({'supporterEnforce': true}), true, 'true מפורש ⇒ דלוק');
  n++;

  // — דוגמה 2: מפתח חסר ⇒ כבוי (off-by-default, הפוך מדגל-פיצ'ר) — {} ⇒ false —
  _eq(supEnforceOn(<String, dynamic>{}), false, 'חסר ⇒ כבוי');
  n++;

  // — דוגמה 3: כיבוי מפורש — {supporterEnforce:false} ⇒ false —
  _eq(supEnforceOn({'supporterEnforce': false}), false, 'false ⇒ כבוי');
  n++;

  // — דוגמה 4: truthy שאינו true נדחה (=== קפדני) — {supporterEnforce:1} ⇒ false —
  _eq(supEnforceOn({'supporterEnforce': 1}), false, '1 ⇒ כבוי');
  n++;

  // — דוגמה 5: מחרוזת אינה הדלקה — {supporterEnforce:'true'} ⇒ false —
  _eq(supEnforceOn({'supporterEnforce': 'true'}), false, "'true' ⇒ כבוי");
  n++;

  // קצה נוסף (כיסוי חוק-2): null-מפורש מתלכד עם מפתח-חסר לאותה תוצאה, כמו ב-JS.
  _eq(supEnforceOn({'supporterEnforce': null}), false, 'null מפורש ⇒ כבוי');
  n++;

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(supEnforceOn({'supporterEnforce': true}), 'assert-live guard');

  print('OK supEnforceOn: $n asserts passed — 5 דוגמאות-חוזה ירוק (off-by-default; רק true מפורש)');
}
