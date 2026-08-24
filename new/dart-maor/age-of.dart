// ⚛️ אטום-Dart (דרגת-חוזה) · ageOf
// מוצא: maor · new/atoms/age-of.mjs (חוק-4 — התנהגות זהה-לחלוטין למקור-ה-JS, לא-משופרת).
// טוהר: פונקציית top-level עצמאית, אפס import (רק dart-core). השעון מוזרק כשקע `now`
//        (במקור-ה-JS היה כבר שקע; חוק-3 — חוט לא מחזיק שעון).
//
// תיקוני-פורט מול המקור (התנהגות משומרת ביט-אחר-ביט):
//   • truthiness  — JS `!birth` (null/מחרוזת-ריקה) ⇒ `birth == null || birth.isEmpty`.
//   • slice(0,10) — לא זורק על מחרוזת קצרה: `substring` מוגן-אורך.
//   • isNaN parse — `DateTime.tryParse` מחזיר null במקום זריקה (מקביל ל-NaN).
//   • getMonth    — JS getMonth 0-מבוסס, Dart .month 1-מבוסס; זהו **הפרש** month-month
//                   ⇒ הקיזוז מתבטל, אין תיקון-אינדקס נדרש.
//
// קלט:  birth — תאריך-לידה ISO (String?, נלקחים 10 התווים הראשונים) · now — שעון-מוזרק.
// פלט:  גיל בשנים מלאות (int), או null לריק/שבור.

/// גיל בשנים מלאות מתאריך-לידה ISO, בכלל-הצהריים (חסין אזורי-זמן).
int? ageOf(String? birth, DateTime now) {
  if (birth == null || birth.isEmpty) return null;
  final head = birth.length <= 10 ? birth : birth.substring(0, 10);
  final d = DateTime.tryParse('${head}T12:00:00');
  if (d == null) return null;
  final n = now;
  var a = n.year - d.year;
  final md = n.month - d.month;
  if (md < 0 || (md == 0 && n.day < d.day)) a--;
  return a;
}
