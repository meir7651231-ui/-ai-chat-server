// רתמת-זהב · guide-intro-label — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// אותם 4 קלטים→פלטים כמו new/atoms/guide-intro-label.test.mjs. אם עובר, Dart≡JS.
import 'guide-intro-label.dart';

void main() {
  // דוגמה 1 · value — המחרוזת המלאה זהה למקור.
  assert(guideIntroLabel == 'לפני הכל:',
      '✗ value: $guideIntroLabel ≠ לפני הכל:');
  // דוגמה 2 · length — 9 code-units (עברית ב-BMP; זהה ל-JS `.length`).
  assert(guideIntroLabel.length == 9,
      '✗ length: ${guideIntroLabel.length} ≠ 9');
  // דוגמה 3 · endsWith ':' — מסתיים בנקודתיים.
  assert(guideIntroLabel.endsWith(':') == true,
      '✗ endsWith :: ${guideIntroLabel.endsWith(':')} ≠ true');
  // דוגמה 4 · startsWith 'לפני' — פותח במילה "לפני".
  assert(guideIntroLabel.startsWith('לפני') == true,
      '✗ startsWith לפני: ${guideIntroLabel.startsWith('לפני')} ≠ true');
  print('✓ guide-intro-label (Dart): 4 דוגמאות-חוזה — ירוק (נוסח-לגאסי שמור)');
}
