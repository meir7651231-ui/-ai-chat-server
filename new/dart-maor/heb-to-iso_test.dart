// רתמת-זהב · heb-to-iso — assert-ים = 7 דוגמאות-החוזה של בדיקת-ה-JS (זהות ביט-אחר-ביט,
// אותם קלטים→פלטים). מייבאת אך ורק את האטום-שלה (חוק-4).
//
// השקעים ממומשים כאן במקום Intl (ל-Dart-core אין לוח-hebrew): monthEnOf = טבלת 14
// החודשים הזהה למקור; hebToIsoEn = ולידציית-הטווח הנאמנה של המקור + לוח-המרה שערכיו
// הם פלטי-Intl-en-u-ca-hebrew האמיתיים של בדיקת-ה-JS (אותה שיטה כמו heb-annual-eq_test
// / heb-parts-of-iso_test — הזרקת-רצפים-אמיתיים). צירוף-שאינו-קיים-בשנה ⇒ אין-במפה ⇒ null.
// אם עובר ⇒ Dart ≡ JS.
// הרצה: dart run --enable-asserts new/dart-maor/heb-to-iso_test.dart  ⇒ exit 0
import 'heb-to-iso.dart';

// ─── שקע monthEnOf — טבלת 14 החודשים (זהה למקור); לא-מוכר ⇒ null (כמו ?.[0] ?? null) ───
const List<List<String>> _months = [
  ['Tishri', 'תשרי'], ['Heshvan', 'חשוון'], ['Kislev', 'כסלו'], ['Tevet', 'טבת'],
  ['Shevat', 'שבט'], ['Adar', 'אדר'], ['Adar I', 'אדר א׳'], ['Adar II', 'אדר ב׳'],
  ['Nisan', 'ניסן'], ['Iyar', 'אייר'], ['Sivan', 'סיוון'], ['Tamuz', 'תמוז'],
  ['Av', 'אב'], ['Elul', 'אלול'],
];
String? _monthEnOf(String he) {
  for (final m in _months) {
    if (m[1] == he) return m[0];
  }
  return null;
}

// ─── שקע hebToIsoEn — ולידציית-הטווח של המקור + לוח-המרה מפלטי-Intl אמיתיים ───
// לוח-ההמרה: (יום|חודש-Intl|שנה) ⇒ ISO, ערכים = פלטי Intl-en-u-ca-hebrew (Node 22)
// של בדיקת-ה-JS. צירוף שלא קיים בשנה זו (אדר א׳ בשנה פשוטה · 30 בחודש-חסר) אינו במפה ⇒ null.
const Map<String, String> _cal = {
  '23|Av|5786': '2026-08-06',      // כ״ג אב תשפ״ו
  '1|Tishri|5786': '2025-09-23',   // ראש-השנה
  '15|Adar I|5784': '2024-02-24',  // שנה מעוברת — אדר א׳ קיים
  '30|Heshvan|5785': '2024-12-01', // חשוון מלא
};
String? _hebToIsoEn(int day, String monthEn, int hebYear) {
  // ולידציית-טווח נאמנה למקור (Number.isInteger + 1≤day≤30 · 4000≤year≤7000).
  if (day < 1 || day > 30) return null;
  if (hebYear < 4000 || hebYear > 7000) return null;
  return _cal['$day|$monthEn|$hebYear']; // חסר ⇒ null (הצירוף לא קיים בשנה)
}

// wiring כמו conv במקור-ה-JS.
String? conv(int day, String monthHe, int hebYear) =>
    hebToIso(day, monthHe, hebYear, _monthEnOf, _hebToIsoEn);

void main() {
  var n = 0;

  // 1) כ״ג אב תשפ״ו
  assert(conv(23, 'אב', 5786) == '2026-08-06', "✗ 23 אב 5786 ≠ '2026-08-06'");
  n++;
  // 2) ראש-השנה — השנה מתחילה בסתיו הקודם
  assert(conv(1, 'תשרי', 5786) == '2025-09-23', "✗ 1 תשרי 5786 ≠ '2025-09-23'");
  n++;
  // 3) שנה מעוברת — אדר א׳ קיים
  assert(conv(15, 'אדר א׳', 5784) == '2024-02-24', "✗ 15 אדר א׳ 5784 ≠ '2024-02-24'");
  n++;
  // 4) שנה פשוטה — אין אדר א׳
  assert(conv(15, 'אדר א׳', 5786) == null, '✗ 15 אדר א׳ 5786 לא null');
  n++;
  // 5) חשוון מלא מול חסר
  assert(conv(30, 'חשוון', 5785) == '2024-12-01', "✗ 30 חשוון 5785 ≠ '2024-12-01'");
  n++;
  assert(conv(30, 'חשוון', 5786) == null, '✗ 30 חשוון 5786 (שנה חסרה) לא null');
  n++;
  // 6) תווית-חודש לא-מוכרת — נעצר לפני השקע
  assert(conv(10, 'שטות', 5786) == null, '✗ חודש לא-מוכר לא null');
  n++;
  // 7) ולידציית-טווח בשקע
  assert(conv(31, 'אב', 5786) == null, '✗ יום 31 לא null');
  n++;
  assert(conv(1, 'אב', 3000) == null, '✗ שנה 3000 לא null');
  n++;

  print('✓ heb-to-iso (Dart): $n דוגמאות-חוזה — ירוק');
}
