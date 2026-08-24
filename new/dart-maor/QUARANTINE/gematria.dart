// ⚛️ אטום-Dart (דרגת-חוזה) · gem — גימטריה (מספר⇒אותיות עבריות)
// מוצא: maor/src/lib/hebrew.ts (חוק-4 — התנהגות זהה למקור-ה-JS, לא-משופרת).
//        המקור: new/atoms/gematria.mjs · חוזה: new/atoms/gematria.contract.md
// טוהר: פונקציית top-level עצמאית, אפס import (רק dart:core; אין צורך ב-dart:math).
//
// תפקיד: המרת מספר חיובי לייצוג-אותיות עברי (גימטריה) עם גרש/גרשיים, כולל
//        טו/טז (הימנעות מצירופי-שם), עד 999.
// קלט:  n — num (שלם/עשרוני/NaN/Infinity). מעל 999 (מאות≥10) המאות נבלעות ל-''.
// פלט:  String — הגימטריה; קלט לא-חוקי (לא-סופי / ≤0 אחרי רצפה) ⇒ ''.
//
// הערות-המרה (מקור-JS → Dart), נקודות שהמנוע היה מפספס:
//  1. truthiness: ב-JS `H[Math.floor(n/100)] || ''` נותן '' גם כשהאינדקס חורג
//     (undefined) וגם כש-H[0]==='' (falsy). ב-Dart: בדיקת-גבול מפורשת + H[0]=''
//     ממילא ''. שקול-ביט.
//  2. Math.floor(+n) על NaN/Infinity נותן ערך לא-סופי ⇒ Number.isFinite=false ⇒ ''.
//     ב-Dart `.floor()` על NaN/Infinity זורק — לכן מגן isNaN/isInfinite לפני .floor().
//  3. אינדוּקס-מערך: `~/` (חלוקה-שלמה) במקום Math.floor(a/b); `%` זהה לחיוביים.
//  4. אורך/חיתוך: JS String.length וה-slice הם על code-units של UTF-16; אותיות-עברית
//     והגרש/גרשיים כולם ב-BMP (code-unit יחיד), ולכן String.length ו-substring
//     ב-Dart (גם UTF-16) שקולים ביט-אחר-ביט.
//  5. מוטביליות: `s` הוא var (מצטבר); הטבלאות U/T/H הן final const.

/// Hebrew gematria of a positive number (verbatim behaviour of the JS source
/// new/atoms/gematria.mjs). Non-finite or non-positive input yields `''`.
String gem(num n) {
  // Math.floor(+n) + Number.isFinite guard: NaN/Infinity ⇒ '' (ולא זורק .floor()).
  if (n.isNaN || n.isInfinite) return '';
  final int nn = n.floor();
  if (nn <= 0) return '';

  const List<String> u = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
  const List<String> t = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
  const List<String> h = ['', 'ק', 'ר', 'ש', 'ת', 'תק', 'תר', 'תש', 'תת', 'תתק'];

  final int hi = nn ~/ 100;
  var s = hi < h.length ? h[hi] : ''; // H[..] || '' — כולל חריגת-גבול וגם H[0]==''
  final int r = nn % 100;
  if (r == 15) {
    s += 'טו';
  } else if (r == 16) {
    s += 'טז';
  } else {
    s += t[r ~/ 10] + u[r % 10];
  }
  return s.length == 1
      ? '$s׳'
      : s.substring(0, s.length - 1) + '״' + s.substring(s.length - 1);
}
