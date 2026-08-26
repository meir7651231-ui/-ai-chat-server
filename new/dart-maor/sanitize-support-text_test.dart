// בדיקת-חוזה · sanitizeSupportText — 6 דוגמאות-החוזה מ-mjs + הסגר null↔undefined.
import 'sanitize-support-text.dart';

void main() {
  var f = 0;
  void ok(bool cond, String msg) {
    if (!cond) {
      // ignore: avoid_print
      print('✗ $msg');
      f = 1;
    }
  }

  // 1) קיצוץ שני הקצוות
  ok(sanitizeSupportText('  שלום  ') == 'שלום', 'קיצוץ-קצוות');
  // 2) חסר ⇒ ''
  ok(sanitizeSupportText(null) == '', 'null ≠ ""');
  // 3) רווחים-בלבד ⇒ ''
  ok(sanitizeSupportText('   ') == '', 'רווחים-בלבד ≠ ""');
  // 4) פנימי נשמר, סופי מקוצץ (כולל \n)
  ok(sanitizeSupportText('א \n ב') == 'א \n ב', 'רווח/שורה פנימיים לא נשמרו');
  ok(sanitizeSupportText('אב\n\n') == 'אב', '\\n סופי לא קוצץ');
  // 5) חיתוך לברירת-המחדל 2000
  ok((sanitizeSupportText('x' * 2500) as String).length == 2000, '2500 ⇒ 2000');
  ok((sanitizeSupportText('x' * 2000) as String).length == 2000, '2000 בדיוק נשמר');
  // 6) קיצוץ לפני חיתוך + שקע מוזרק
  ok(sanitizeSupportText(' אבגד', 3) == 'אבג', 'סדר קיצוץ→חיתוך (max=3)');

  // 7) 🩹 הסגר: supportMsgMax=null מפורש ⇒ slice(0,null)=0 ⇒ '' (לא עד-הסוף)
  ok(sanitizeSupportText('אבגד', null) == '', 'null מפורש ⇒ "" (כלל-2)');
  // 8) שלילי נספר-מהסוף (slice סלחן)
  ok(sanitizeSupportText('אבגד', -1) == 'אבג', 'max שלילי ⇒ len+end');
  // 9) שקע מעל-האורך ⇒ הכל
  ok(sanitizeSupportText('אבג', 99) == 'אבג', 'max>len ⇒ הכל');

  if (f != 0) {
    throw StateError('sanitize-support-text: כשל בדיקה');
  }
  // ignore: avoid_print
  print('✓ sanitize-support-text: 9 דוגמאות (חוזה + הסגר null) — ירוק');
}
