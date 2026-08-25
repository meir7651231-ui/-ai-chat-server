// ⚛️ אטום-Dart (דרגת-חוזה) · taskIdentity — זהות-עובד/ת קנונית למשימות.
// מוצא: maor/src/lib/worktasks.ts:9-14 · המקור: new/atoms/task-identity.mjs —
//        `const e = (email ?? '').trim().toLowerCase(); return e || 'מקומי';`
// טוהר: פונקציות top-level עצמאיות, אפס import (רק dart-core). חוק-4 — זהה-ביט למקור-ה-JS.
//
// תפקיד: מנרמל כתובת-אימייל לזהות אחידה (גזום+אותיות-קטנות); ריק/חסר ⇒ 'מקומי'
//        (עובד/ת ללא-ענן — המשימות נרשמות מקומית).
// קלט: email — מחרוזת או null (undefined/null ב-JS ⇒ '' דרך ??). פלט: String תמיד.
//
// הערות-המרה (מקור→Dart):
// • חוק-7 (truthiness): `e || 'מקומי'` ב-JS = מחרוזת-ריקה כוזבת ⇒ כאן `e.isEmpty`
//   מפורש (הטיוטה האוטומטית `e ?? 'מקומי'` הייתה באג — '' אינו null).
// • חוק-16 (trim): ‏_trimJs גוזם את קבוצת-ES בלבד — ‏U+0085 (NEL) **לא** נגזם
//   (Dart.trim גוזם אותו — נמדד: 'x'.trim() ב-Dart ⇒ 'x' עם NEL בקצוות, ב-JS נשאר).
// • חוק-13 (toLowerCase): ‏_toLowerJs = Dart.toLowerCase + טבלת-חריגים שנמדדו:
//   ‏İ U+0130 ⇒ 'i'+U+0307 (Dart משמיט את הנקודה) · צ'רוקי U+13A0–U+13EF ⇒ +0x97D0,
//   ‏U+13F0–U+13F5 ⇒ +8 (Dart משאיר כמו-שהוא). מעבר לחריגים אלה Dart≡JS בטווחים שנבדקו.
// • קלט שאינו מחרוזת ⇒ JS זורק TypeError על ‎.trim ⇒ כאן cast ל-String זורק TypeError.
// אין locale/תאריכים/מספרים/מוטביליות.

/// Canonical worker identity for tasks: trimmed, lower-cased email; empty/null
/// falls back to 'מקומי' (local, cloudless worker). Bit-identical to the JS
/// source `taskIdentity` (ES trim set, JS full lower-case mapping, `||` falsy).
String taskIdentity(dynamic email) {
  final String e = _toLowerJs(_trimJs((email ?? '') as String));
  return e.isEmpty ? 'מקומי' : e; // '' כוזב ב-JS ⇒ ברירת-המחדל
}

/// קבוצת-הרווחים של ES (WhiteSpace ∪ LineTerminator) — בלי U+0085 ובלי U+180E.
bool _isEsWhitespace(int c) =>
    c == 0x09 ||
    c == 0x0A ||
    c == 0x0B ||
    c == 0x0C ||
    c == 0x0D ||
    c == 0x20 ||
    c == 0xA0 ||
    c == 0x1680 ||
    (c >= 0x2000 && c <= 0x200A) ||
    c == 0x2028 ||
    c == 0x2029 ||
    c == 0x202F ||
    c == 0x205F ||
    c == 0x3000 ||
    c == 0xFEFF;

/// trim נאמן-ל-ES (חוק-16): גוזם רק את קבוצת-ES, לא את התוספות של Dart.
String _trimJs(String s) {
  var start = 0;
  var end = s.length;
  while (start < end && _isEsWhitespace(s.codeUnitAt(start))) {
    start++;
  }
  while (end > start && _isEsWhitespace(s.codeUnitAt(end - 1))) {
    end--;
  }
  return (start == 0 && end == s.length) ? s : s.substring(start, end);
}

bool _isLowerException(int c) => c == 0x0130 || (c >= 0x13A0 && c <= 0x13F5);

/// toLowerCase נאמן-ל-JS (חוק-13): Dart.toLowerCase + חריגים שנמדדו (İ, צ'רוקי).
String _toLowerJs(String s) {
  var hasExc = false;
  for (var i = 0; i < s.length; i++) {
    if (_isLowerException(s.codeUnitAt(i))) {
      hasExc = true;
      break;
    }
  }
  if (!hasExc) return s.toLowerCase();
  final sb = StringBuffer();
  var i = 0;
  while (i < s.length) {
    final c = s.codeUnitAt(i);
    if (c == 0x0130) {
      sb.write('i̇'); // İ ⇒ i + combining-dot-above (מיפוי-מלא של JS)
      i++;
    } else if (c >= 0x13A0 && c <= 0x13EF) {
      sb.writeCharCode(c + 0x97D0); // צ'רוקי גדולות ⇒ קטנות U+AB70–U+ABBF
      i++;
    } else if (c >= 0x13F0 && c <= 0x13F5) {
      sb.writeCharCode(c + 8); // צ'רוקי U+13F0–U+13F5 ⇒ U+13F8–U+13FD
      i++;
    } else {
      var j = i;
      while (j < s.length && !_isLowerException(s.codeUnitAt(j))) {
        j++;
      }
      sb.write(s.substring(i, j).toLowerCase());
      i = j;
    }
  }
  return sb.toString();
}
