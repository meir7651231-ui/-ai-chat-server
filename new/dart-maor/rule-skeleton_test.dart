// בדיקת-חוזה (רתמת-זהב) · ruleSkeleton — מייבאת אך ורק את האטום-שלה (חוק-4).
// מתרגמת verbatim את בדיקת-ה-JS new/atoms/rule-skeleton.test.mjs +
// דוגמאות/גבולות-החוזה (rule-skeleton.contract.md): שאילתה ≥3, לא-מספר, שלד ≥2.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/rule-skeleton_test.dart  ⇒ exit 0
import 'rule-skeleton.dart';

void _eq(dynamic got, dynamic want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — שלוש דוגמאות בדיקת-ה-JS verbatim (rule-skeleton.test.mjs) —
  _eq(ruleSkeleton('דויד', 'דוד'), 58, "1 'דויד'~'דוד' -> 58");        n++;
  _eq(ruleSkeleton('דנה', 'דוד'), null, "2 'דנה'!='דוד' -> null");     n++;
  _eq(ruleSkeleton('123', 'דוד'), null, '3 all-digits -> null');       n++;

  // — גבולות-החוזה —
  // שאילתה קצרה מ-3 ⇒ null (גם כשהשלד היה שווה)
  _eq(ruleSkeleton('דו', 'ד'), null, '4 len<3 -> null');               n++;
  // כולה-ספרות ארוכה ⇒ null (ה-regex ^\d+$ תופס כל אורך)
  _eq(ruleSkeleton('4567', '4567'), null, '5 digits len4 -> null');    n++;
  // ספרות+אות ⇒ לא-כולה-ספרות; שלד שווה ⇒ 58
  _eq(ruleSkeleton('12א', '12א'), 58, '6 digits+letter equal -> 58');  n++;
  // שלד קצר מ-2 ⇒ null: 'יוסי' ⇒ שלד 'ס' (אורך 1) גם מול שלד זהה
  _eq(ruleSkeleton('יוסי', 'סי'), null, "7 skeleton 'ס' len1 -> null"); n++;
  // שלד ≥2 ושווה, כשהמונח עצמו קצר: 'שלום'⇒'שלם' מול 'שלם'⇒'שלם' ⇒ 58
  _eq(ruleSkeleton('שלום', 'שלם'), 58, "8 'שלום'~'שלם' -> 58");        n++;
  // הכיוון ההפוך: מונח עם י/ו והשאילתה בלעדיהן
  _eq(ruleSkeleton('דוד', 'דויד'), 58, "9 'דוד'~'דויד' -> 58");        n++;
  // שלדים שונים ⇒ null
  _eq(ruleSkeleton('ראובן', 'ראבן '), null, '10 diff skeleton -> null'); n++;
  // מונח ריק: שלד-שאילתה ≥2 מול '' ⇒ null (לא-שווה)
  _eq(ruleSkeleton('שלמה', ''), null, '11 empty term -> null');        n++;
  // זהות מלאה בלי י/ו כלל ⇒ 58
  _eq(ruleSkeleton('רחל', 'רחל'), 58, "12 'רחל'=='רחל' -> 58");        n++;
  // ספרות-לא-ASCII (٤٥٦ ערביות): JS ‎/^\d+$/‎ בלי דגל-u לא תופס ⇒ ממשיך;
  // שלד '٤٥٦' שווה ⇒ 58 (זהה-ביט ל-JS, אומת מול node)
  _eq(ruleSkeleton('٤٥٦', '٤٥٦'), 58, '13 arabic-indic digits -> 58'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(ruleSkeleton('דויד', 'דוד') == 58, 'assert-live guard');

  print('OK ruleSkeleton: $n asserts passed');
}
