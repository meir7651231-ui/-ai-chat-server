// ⚛️ אטום-Dart (דרגת-חוזה) · supDupFieldValue — ערך-השדה הנבחר במיזוג כפולי-תורמים.
// מוצא: maor/src/lib/dedup.ts:417-429 · המקור: new/atoms/sup-dup-field-value.mjs —
//   const edited = edit[def.key];
//   if (edited != null) return edited;
//   const idx = pick[def.key] ?? sups.findIndex((s) => def.get(s));
//   return def.get(sups[idx >= 0 ? idx : 0]);
// טוהר: פונקציות top-level, אפס import (רק dart-core); def.get חלק-מהקלט (אפס שקעים).
// הקדימות (חוזה): edit (גם ריק-מפורש) → pick (גם 0) → הראשונה-עם-ערך → sups[0].
//
// הערות-המרה (DART-PORTING-RULES):
//  • `edited != null` של JS תופס null וגם undefined באותה מידה ⇒ ‏`edit[key] != null`
//    על Map ב-Dart (מפתח-חסר ⇒ null) הוא זהה-ביט — כלל-2 (containsKey) לא נדרש כאן,
//    כי המקור עצמו לא מבחין null↔undefined (‎!=‎ רופף, לא ‎===‎).
//  • `pick[def.key] ?? …` — ‏?? של JS נופל רק על null/undefined ⇒ ‏?? של Dart זהה
//    (מפתח-חסר וגם null-מפורש נופלים ל-findIndex, בשתי השפות).
//  • findIndex: הפרדיקט נבחן ב-truthiness של JS (כלל-7) ⇒ ‏_truthy מפורש
//    ('' שקרי ⇒ "הראשונה עם ערך"; גם 0/NaN/false/null שקריים).
//  • כלל-15 (קוארציית-אינדקס/ארגומנט): ‏idx יכול להגיע מ-pick כמות-שהוא —
//    ‏`idx >= 0` משווה אחרי ToNumber (‏'1'>=0 אמת; 'abc'>=0 ⇒ NaN ⇒ שקר ⇒ 0),
//    ו-`sups[idx]` ניגש לפי מפתח-מחרוזת-קנוני (‏sups['1']≡sups[1]; ‏5.0≡5; ‏'01' ⇒
//    undefined). ⇒ עוזרים ‏_jsGe0 + ‏_atIdx נאמני-JS; מחוץ-לטווח ⇒ null (undefined),
//    ואז def.get(null) זורק — כפי ש-def.get(undefined) זורק ב-JS (שקילות-זריקה).
//  • כלל-16: ‏ToNumber של מחרוזת גוזם בקבוצת-הרווחים של ECMAScript בלבד (‏_jsTrim —
//    בלי U+0085/U+180E).

/// truthiness של JS (כלל-7): false · null/undefined · 0/-0/NaN · '' ⇒ שקרי; השאר אמת.
bool _truthy(dynamic v) {
  if (v == null || v == false) return false;
  if (v is num) return !(v == 0 || v.isNaN);
  if (v is String) return v.isNotEmpty;
  return true;
}

/// findIndex של JS על פרדיקט-truthy: האינדקס הראשון שבו get(s) אמת-JS; אין ⇒ ‎-1.
int _findIndexTruthy(dynamic sups, dynamic get) {
  final list = sups as List;
  for (var i = 0; i < list.length; i++) {
    if (_truthy(get(list[i]))) return i;
  }
  return -1;
}

/// קבוצת-הרווחים של ECMAScript (כלל-16) — בלי U+0085 (NEL) ובלי U+180E.
bool _esWs(int c) =>
    c == 0x09 || c == 0x0A || c == 0x0B || c == 0x0C || c == 0x0D ||
    c == 0x20 || c == 0xA0 || c == 0x1680 ||
    (c >= 0x2000 && c <= 0x200A) ||
    c == 0x2028 || c == 0x2029 || c == 0x202F || c == 0x205F ||
    c == 0x3000 || c == 0xFEFF;

String _jsTrim(String s) {
  var a = 0;
  var b = s.length;
  while (a < b && _esWs(s.codeUnitAt(a))) a++;
  while (b > a && _esWs(s.codeUnitAt(b - 1))) b--;
  return s.substring(a, b);
}

/// ToNumber-שקול של JS (כלל-15) לצורך ההשוואה `idx >= 0`.
/// מכסה: num · bool · null(⇒0) · מחרוזת (ES-trim, ''⇒0, עשרוני/מדעי, 0x-הקס,
/// Infinity). מחרוזת לא-מספרית ⇒ NaN. (ליטרלי 0o/0b של ES2015 לא ממופים —
/// לא מושגים כאן: pick מגיע מ-UI/JSON כאינדקסים.)
double _toNum(dynamic v) {
  if (v is num) return v.toDouble();
  if (v is bool) return v ? 1.0 : 0.0;
  if (v == null) return 0.0;
  if (v is String) {
    final t = _jsTrim(v);
    if (t.isEmpty) return 0.0;
    if (t == 'Infinity' || t == '+Infinity') return double.infinity;
    if (t == '-Infinity') return double.negativeInfinity;
    if (t.length > 2 && (t.startsWith('0x') || t.startsWith('0X'))) {
      final h = int.tryParse(t.substring(2), radix: 16);
      return h == null ? double.nan : h.toDouble();
    }
    return double.tryParse(t) ?? double.nan;
  }
  return double.nan;
}

/// `idx >= 0` של JS: השוואה אחרי ToNumber; NaN ⇒ שקר (⇒ נפילה לאינדקס 0).
bool _jsGe0(dynamic idx) {
  final n = _toNum(idx);
  return !n.isNaN && n >= 0;
}

/// `arr[idx]` של JS: מפתח-מחרוזת-קנוני. num שלם-בערכו ⇒ אינדקס (5.0≡5, ‎-0⇒0);
/// מחרוזת-אינדקס-קנונית ('1', לא '01'/' 1'/'1.0') ⇒ אינדקס; אחרת/מחוץ-לטווח ⇒
/// null (undefined של JS — לא זריקת-RangeError).
dynamic _atIdx(dynamic arr, dynamic idx) {
  final list = arr as List;
  int? i;
  if (idx is num) {
    if (idx.isFinite && idx == idx.truncateToDouble()) i = idx.toInt();
  } else if (idx is String) {
    final n = int.tryParse(idx);
    if (n != null && n.toString() == idx) i = n;
  }
  if (i == null || i < 0 || i >= list.length) return null;
  return list[i];
}

/// ערך-השדה הנבחר במיזוג כפולי-תורמים — התנהגות זהה-ביט למקור-ה-JS.
/// עריכה-ידנית גוברת (גם '' — מחיקה-מכוונת, ‎!= null); אחרת הבחירה (pick — גם 0);
/// אחרת הרשומה הראשונה שיש לה ערך (findIndex על def.get); אף אחת ⇒ sups[0].
dynamic supDupFieldValue(dynamic sups, dynamic def, dynamic pick, dynamic edit) {
  final edited = edit[def['key']];
  if (edited != null) return edited;
  final idx = pick[def['key']] ?? _findIndexTruthy(sups, def['get']);
  return def['get'](_atIdx(sups, _jsGe0(idx) ? idx : 0));
}
