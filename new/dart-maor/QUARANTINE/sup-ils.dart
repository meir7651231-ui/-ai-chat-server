// ⚛️ אטום-Dart (דרגת-חוזה) · supIls — סה"כ ₪ של תומכת כולל היסטוריה (הכרעת-בעלים 9.8 "לכולל").
// מוצא: maor/src/components/supporters/lib.ts:106-110 · המקור: new/atoms/sup-ils.mjs.
// חוזה: new/atoms/sup-ils.contract.md.
// טוהר: פונקציית top-level עצמאית, אפס import (רק שפה/סטנדרט: dart:core). חוק-4 —
//        התנהגות זהה-ביט למקור-ה-JS (המקור קדוש). טהור, אפס שקעים (אין לוח-עברי/Intl).
// המקור (שורה אחת):
//   (sp.ils || 0) + (sp.hist ?? []).reduce((a, h) => a + (h.c === '$' ? 0 : h.a), 0)
//
// הערות-המרה (מקור→Dart — הנקודות שהטיוטה-האוטומטית פספסה):
//  • הטיוטה תרגמה `sp.ils || 0` ל-`?? 0` — סטייה! `||` של JS נופל ל-0 גם על
//    0/NaN/''/false, לא רק null/undefined ⇒ `_jsTruthy` (חוק-7 truthiness).
//  • גישת-שדה `h.a`/`h.c`: מפתח-חסר ⇒ undefined (≠null!) ⇒ סנטינל `_undef` דרך
//    `_prop` עם `containsKey` (חוק-2). ההבדל נצפה: `0 + undefined = NaN` אבל
//    `0 + null = 0` — שורת-hist עם a:null נספרת 0, שורה בלי a בכלל ⇒ NaN.
//  • `a + x` = ה-`+` של JS: אחד-האגפים מחרוזת ⇒ שרשור (`_jsStr`, חוק-12 — שלם-בטוח
//    מודפס עשרוני); אחרת ToNumber על שניהם (`_jsToNumber`: null→0, undefined→NaN,
//    bool→1/0, מחרוזת→trim-ES (חוק-16) + פרסור כולל hex/Infinity, ריק→0, רע→NaN).
//  • `h.c === '$'` — שוויון-קפדני: רק המחרוזת '$' מחריגה; `_undef`/null/אחר ⇒ נספר.
//  • `sp.hist ?? []` — ה-`??` תופס null וגם undefined; מפתח-חסר ב-Dart ⇒ null ⇒
//    `?? const []` שקול-ביט. hist שאינו מערך ⇒ JS זורק TypeError על reduce ⇒ גם כאן.
//  • אין מיון/מפות-פלט ⇒ חוקים 1/14 לא-רלוונטיים; אין אינדקסים ⇒ חוק-15 מכוסה
//    דרך `_jsToNumber` בארגומנטים.

/// סנטינל ל-`undefined` של JS (נבדל מ-null; כלל-המרה 2).
const Object _undef = _Undef();

class _Undef {
  const _Undef();
}

/// גישת-שדה בסגנון JS: מפה עם המפתח ⇒ הערך; מפתח-חסר / לא-Map ⇒ `_undef`.
Object? _prop(Object? o, String k) {
  if (o is Map && o.containsKey(k)) return o[k];
  return _undef;
}

/// אמת-JS (`||`): undefined/null=false · bool=עצמו · num=לא-0-ולא-NaN · String=לא-ריק · אחר=true.
bool _jsTruthy(Object? v) {
  if (identical(v, _undef) || v == null) return false;
  if (v is bool) return v;
  if (v is num) return v != 0 && !v.isNaN;
  if (v is String) return v.isNotEmpty;
  return true;
}

/// קבוצת-הרווחים של ECMAScript ל-trim של ToNumber (חוק-16: בלי U+0085/U+180E).
bool _isEsWhitespace(int c) =>
    c == 0x09 || c == 0x0A || c == 0x0B || c == 0x0C || c == 0x0D ||
    c == 0x20 || c == 0xA0 || c == 0xFEFF ||
    c == 0x1680 || (c >= 0x2000 && c <= 0x200A) ||
    c == 0x2028 || c == 0x2029 || c == 0x202F || c == 0x205F || c == 0x3000;

String _esTrim(String s) {
  var start = 0;
  var end = s.length;
  while (start < end && _isEsWhitespace(s.codeUnitAt(start))) start++;
  while (end > start && _isEsWhitespace(s.codeUnitAt(end - 1))) end--;
  return s.substring(start, end);
}

/// ToNumber של JS: undefined→NaN · null→0 · bool→1/0 · num→עצמו ·
/// מחרוזת→trim-ES ואז: ריק→0, hex/octal/binary-ליטרל, Infinity, אחרת פרסור-עשרוני או NaN.
num _jsToNumber(Object? v) {
  if (identical(v, _undef)) return double.nan;
  if (v == null) return 0;
  if (v is bool) return v ? 1 : 0;
  if (v is num) return v;
  if (v is String) {
    final t = _esTrim(v);
    if (t.isEmpty) return 0;
    if (t == 'Infinity' || t == '+Infinity') return double.infinity;
    if (t == '-Infinity') return double.negativeInfinity;
    if (t.length > 2 && t.codeUnitAt(0) == 0x30) {
      final p = t[1];
      if (p == 'x' || p == 'X') return int.tryParse(t.substring(2), radix: 16) ?? double.nan;
      if (p == 'o' || p == 'O') return int.tryParse(t.substring(2), radix: 8) ?? double.nan;
      if (p == 'b' || p == 'B') return int.tryParse(t.substring(2), radix: 2) ?? double.nan;
    }
    return num.tryParse(t) ?? double.nan; // חוק-10: אף-פעם לא parse-שזורק
  }
  return double.nan; // אובייקט/מערך — מחוץ-לתחום-החוזה (ToPrimitive מלא לא-נדרש)
}

/// String(v) בהקשר-שרשור של JS (חוק-12: שלם-בטוח ⇒ עשרוני, לא פריסת-double).
String _jsStr(Object? v) {
  if (identical(v, _undef)) return 'undefined';
  if (v == null) return 'null';
  if (v is String) return v;
  if (v is bool) return v ? 'true' : 'false';
  if (v is num) {
    if (v is int) return v.toString();
    final d = v.toDouble();
    if (d.isNaN) return 'NaN';
    if (d.isInfinite) return d.isNegative ? '-Infinity' : 'Infinity';
    if (d == d.truncateToDouble() && d.abs() < 9007199254740992.0) {
      return d.toInt().toString(); // שלם-בטוח (|v|<2^53) ⇒ עשרוני בלי ".0"
    }
    return d.toString();
  }
  return v.toString();
}

/// ה-`+` של JS: אחד-האגפים מחרוזת ⇒ שרשור-מחרוזות; אחרת חיבור-ToNumber.
dynamic _jsAdd(Object? a, Object? b) {
  if (a is String || b is String) return _jsStr(a) + _jsStr(b);
  return _jsToNumber(a) + _jsToNumber(b);
}

/// סה"כ ₪ של תומכת כולל היסטוריה — המונה-השמור ils (קבלות-בלבד) + סכימת שורות-hist
/// שאינן דולריות (רק c==='$' מוחרג; c חסר ⇒ נספר כשקלי). פורט מילולי של
/// new/atoms/sup-ils.mjs (`supIls`) — נגזרת טהורה, אפס שקעים.
dynamic supIls(dynamic sp) {
  final ilsRaw = _prop(sp, 'ils');
  final Object? ils = _jsTruthy(ilsRaw) ? ilsRaw : 0; // (sp.ils || 0)
  final histRaw = _prop(sp, 'hist');
  final Object? hist =
      (identical(histRaw, _undef) || histRaw == null) ? const [] : histRaw; // ?? []
  if (hist is! List) {
    // ב-JS: .reduce על לא-מערך ⇒ TypeError. מחוץ-לתחום-החוזה — משתקף כזריקה.
    throw ArgumentError('sp.hist is not an array');
  }
  Object? acc = 0;
  for (final h in hist) {
    final c = _prop(h, 'c');
    final Object? term = (c is String && c == '\$') ? 0 : _prop(h, 'a');
    acc = _jsAdd(acc, term); // a + (h.c === '$' ? 0 : h.a)
  }
  return _jsAdd(ils, acc);
}
