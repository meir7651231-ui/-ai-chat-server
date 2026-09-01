// גולד heb-month-he — מקביל ל-new/atoms/heb-month-he.test.mjs + מקרה-ההסגר.
import '../dart-data-maor/heb-month-he-sockets.dart' as sk_hmh;
import 'heb-month-he.dart';

void _eq(String got, String want, String msg) {
  if (got != want) {
    throw AssertionError('✗ $msg: got "$got" want "$want"');
  }
}

void main() {
  // 4 הדוגמאות מהמקור (.test.mjs)
  _eq(hebMonthHe(DateTime(2026, 8, 24), sk_hmh.hebMonthHe_monthNames), 'אלול', 'אלול');
  _eq(hebMonthHe(DateTime(2026, 4, 2), sk_hmh.hebMonthHe_monthNames), 'ניסן', 'ניסן');
  if (!hebMonthHe(DateTime(2024, 3, 24), sk_hmh.hebMonthHe_monthNames).startsWith('אדר ב')) {
    throw AssertionError('✗ אדר-ב: got "${hebMonthHe(DateTime(2024, 3, 24), sk_hmh.hebMonthHe_monthNames)}"');
  }
  _eq(hebMonthHe(null, sk_hmh.hebMonthHe_monthNames), '', 'שבור'); // Date('שבור')⇒NaN⇒'' ⇔ null

  // מקרה-ההסגר: ערב-ר"ה, 29 אלול 5784 = 2024-10-02 (צהריים במקור).
  // הבאג נתן 'תשרי'. הצפוי (JS Intl) = 'אלול'.
  _eq(hebMonthHe(DateTime(2024, 10, 2), sk_hmh.hebMonthHe_monthNames), 'אלול', 'ערב-ר"ה 2024-10-02');
  // היום הבא = ר"ה 5785 = 1 תשרי.
  _eq(hebMonthHe(DateTime(2024, 10, 3), sk_hmh.hebMonthHe_monthNames), 'תשרי', 'ר"ה 2024-10-03');

  print('✓ heb-month-he: 6 בדיקות (כולל גבול-ההסגר) — ירוק');
}
