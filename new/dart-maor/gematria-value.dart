// ⚛️ אטום-Dart (דרגת-חוזה) · gemValue — גימטריה הפוכה (אותיות עבריות⇒מספר, ערך מילה)
// מוצא: new/atoms/gematria-value.mjs (חוק-4 — התנהגות זהה למקור-ה-JS) · חוזה: new/atoms/gematria-value.contract.md
// טוהר: פונקציית top-level עצמאית, אפס import (רק dart:core).
//
// תפקיד: סכום ערכי-האותיות של מילה לפי טבלאות-הגימטריה ושקעיהן (U אחדות · T עשרות ×T2.k7 · H מאות ×T2.k5 — אותם
//        שקעים של gem; המכפילים מהשקע, לא מהקוד). אות סופית (תו שאינו בטבלאות והתו הבא אחריו ביוניקוד כן) נספרת כבסיסה.
//        גרש/גרשיים/רווחים מדולגים. קלט: s — String. פלט: int? — הסכום; אין אף אות עברית ⇒ null.

/// Gematria value of a Hebrew word (verbatim behaviour of new/atoms/gematria-value.mjs).
int? gemValue(String s, List<String> U, List<String> T, List<String> H, Map<String, dynamic> T2) {
  int? valueOf(String ch) {
    var i = U.indexOf(ch);
    if (i > 0) return i;
    i = T.indexOf(ch);
    if (i > 0) return (T2['k7'] as num).toInt() * i;
    i = H.indexOf(ch);
    if (i > 0 && ch.length == 1) return (T2['k5'] as num).toInt() * i;
    return null;
  }
  var sum = 0;
  var any = false;
  for (final rune in s.runes) {
    final v = valueOf(String.fromCharCode(rune)) ?? valueOf(String.fromCharCode(rune + 1));   // צורה סופית ⇒ הבסיס = התו הבא
    if (v == null) continue;
    sum += v;
    any = true;
  }
  return any ? sum : null;
}
