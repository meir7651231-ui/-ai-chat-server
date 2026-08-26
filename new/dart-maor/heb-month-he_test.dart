// גולד heb-month-he — מקביל ל-new/atoms/heb-month-he.test.mjs + מקרה-ההסגר.
import 'heb-month-he.dart';

void _eq(String got, String want, String msg) {
  if (got != want) {
    throw AssertionError('✗ $msg: got "$got" want "$want"');
  }
}

void main() {
  // 4 הדוגמאות מהמקור (.test.mjs)
  _eq(hebMonthHe(DateTime(2026, 8, 24)), 'אלול', 'אלול');
  _eq(hebMonthHe(DateTime(2026, 4, 2)), 'ניסן', 'ניסן');
  if (!hebMonthHe(DateTime(2024, 3, 24)).startsWith('אדר ב')) {
    throw AssertionError('✗ אדר-ב: got "${hebMonthHe(DateTime(2024, 3, 24))}"');
  }
  _eq(hebMonthHe(null), '', 'שבור'); // Date('שבור')⇒NaN⇒'' ⇔ null

  // מקרה-ההסגר: ערב-ר"ה, 29 אלול 5784 = 2024-10-02 (צהריים במקור).
  // הבאג נתן 'תשרי'. הצפוי (JS Intl) = 'אלול'.
  _eq(hebMonthHe(DateTime(2024, 10, 2)), 'אלול', 'ערב-ר"ה 2024-10-02');
  // היום הבא = ר"ה 5785 = 1 תשרי.
  _eq(hebMonthHe(DateTime(2024, 10, 3)), 'תשרי', 'ר"ה 2024-10-03');

  print('✓ heb-month-he: 6 בדיקות (כולל גבול-ההסגר) — ירוק');
}
