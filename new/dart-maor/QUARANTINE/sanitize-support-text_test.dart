// בדיקת-חוזה (רתמת-זהב) · sanitizeSupportText — מייבאת אך ורק את האטום-שלה (חוק-4).
// מתרגמת אחד-לאחד את new/atoms/sanitize-support-text.test.mjs (6 דוגמאות-החוזה)
// + דוגמאות-החוזה מ-sanitize-support-text.contract.md. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/sanitize-support-text_test.dart ⇒ exit 0
import 'sanitize-support-text.dart';

void _eq(dynamic got, dynamic want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  // 1) קיצוץ שני הקצוות
  _eq(sanitizeSupportText('  שלום  '), 'שלום', '1 קיצוץ-קצוות'); n++;

  // 2) חסר ⇒ '' (null; ב-JS גם undefined — ב-Dart שניהם null)
  _eq(sanitizeSupportText(null), '', '2a null => ""'); n++;
  _eq(sanitizeSupportText(null, 2000), '', '2b undefined => ""'); n++;

  // 3) רווחים-בלבד ⇒ ''
  _eq(sanitizeSupportText('   '), '', '3 רווחים-בלבד => ""'); n++;

  // 4) פנימי נשמר, סופי מקוצץ (כולל \n)
  _eq(sanitizeSupportText('א \n ב'), 'א \n ב', '4a רווח/שורה פנימיים נשמרים'); n++;
  _eq(sanitizeSupportText('אב\n\n'), 'אב', '4b \\n סופי מקוצץ'); n++;

  // 5) חיתוך לברירת-המחדל 2000
  _eq((sanitizeSupportText('x' * 2500) as String).length, 2000, '5a 2500 => 2000'); n++;
  _eq((sanitizeSupportText('x' * 2000) as String).length, 2000, '5b 2000 בדיוק נשמר'); n++;

  // 6) קיצוץ לפני חיתוך + שקע מוזרק
  _eq(sanitizeSupportText(' אבגד', 3), 'אבג', '6 סדר קיצוץ→חיתוך (max=3)'); n++;

  // — קצוות-slice של JS (חוק-5: substring סלחן) —
  _eq(sanitizeSupportText('אבגד', -1), 'אבג', '7a max שלילי = מהסוף (JS slice)'); n++;
  _eq(sanitizeSupportText('אבגד', -99), '', '7b שלילי-עמוק => ""'); n++;
  _eq(sanitizeSupportText('אב', 99), 'אב', '7c max>len נחתך ל-len'); n++;
  _eq(sanitizeSupportText('אבגד', 0), '', '7d max=0 => ""'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(sanitizeSupportText('  שלום  ') == 'שלום', 'assert-live guard');

  print('OK sanitizeSupportText: $n asserts passed');
}
