// ⚛️ אטום-Dart (דרגת-חוזה) · shekel — עיטוף סכום-שקלים לתצוגה (₪ + הפרדת-אלפים he-IL).
// מוצא: maor (חוט shekel) · המקור: new/atoms/shekel.mjs.
// טוהר: פונקציית top-level עצמאית, אפס import (רק שפה/סטנדרט: dart:core בלבד).
// חוק-4 — התנהגות זהה-ביט למקור-ה-JS (המקור קדוש).
//
// המקור (JS):  return '₪' + Math.round(n).toLocaleString('he-IL');
// תפקיד: מקבל ערך (מספר/מחרוזת), עוגן ל-Number בכללי-JS, מעגל (Math.round),
//        ומעצב עם פסיקי-אלפים בלוקאל he-IL. NaN ⇒ "₪NaN".
//
// הערות-המרה (מקור→Dart) — מה שמנוע-ה-AST פספס:
//  • `Math.round(n)` על מחרוזת = עיגון-JS ל-Number ואז round. מנוע-ה-AST נתן
//    `_round(n)` + זנב-native שבור — כאן מיושם עיגון-Number ידני (`_toNumber`).
//  • `.toLocaleString('he-IL')` (שקע-locale) → קיבוץ-אלפים ידני בפסיקים (`_formatHeIL`),
//    ללא intl/import — he-IL משתמש בפסיק כמפריד-אלפים ובספרות-ASCII (תואם "501,234,567").
//  • עיגון-JS: `Math.round(x) = floor(x + 0.5)` (חצי כלפי +∞; NaN⇒NaN; ±∞ נשמר).
//  • עיגון-Number: מחרוזת ריקה⇒0 · לא-מספרית⇒NaN · hex/oct/bin/Infinity נתמכים.
//  • מוטביליות: `final` בכל המקומות (אין הקצאה-מחדש).

/// עיטוף סכום לתצוגת-שקלים. Verbatim port of new/atoms/shekel.mjs (`shekel`):
/// `'₪' + Math.round(n).toLocaleString('he-IL')` — with JS-faithful Number
/// coercion, Math.round, and he-IL thousands grouping (NaN ⇒ "₪NaN").
String shekel(Object? n) {
  return '₪' + _formatHeIL(_jsRound(_toNumber(n)));
}

/// עיגון-JS: floor(x + 0.5). NaN⇒NaN, ±∞ נשמר (זהה ל-Math.round).
double _jsRound(double x) {
  if (x.isNaN || x.isInfinite) return x;
  return (x + 0.5).floorToDouble();
}

/// עיצוב he-IL של ערך שלם-לאחר-עיגול: NaN⇒"NaN", אחרת קיבוץ-אלפים בפסיקים.
String _formatHeIL(double value) {
  if (value.isNaN) return 'NaN';
  if (value.isInfinite) return value.isNegative ? '-∞' : '∞';
  final bool neg = value < 0;
  final String digits = value.abs().toStringAsFixed(0);
  final String grouped = _groupThousands(digits);
  return neg ? '-' + grouped : grouped;
}

/// קיבוץ ספרות-שלם בקבוצות-שלוש בפסיק (מפריד-האלפים של he-IL).
String _groupThousands(String digits) {
  final StringBuffer buf = StringBuffer();
  final int len = digits.length;
  for (int i = 0; i < len; i++) {
    if (i > 0 && (len - i) % 3 == 0) buf.write(',');
    buf.write(digits[i]);
  }
  return buf.toString();
}

/// עיגון ערך ל-Number בכללי-JS (`Number(v)`): num כמו-שהוא, bool⇒1/0,
/// מחרוזת מגוזרת: ריקה⇒0 · Infinity · hex/oct/bin · אחרת double · כשל⇒NaN.
double _toNumber(Object? v) {
  if (v == null) return double.nan;
  if (v is num) return v.toDouble();
  if (v is bool) return v ? 1.0 : 0.0;
  if (v is String) {
    final String s = v.trim();
    if (s.isEmpty) return 0.0;
    if (s == 'Infinity' || s == '+Infinity') return double.infinity;
    if (s == '-Infinity') return double.negativeInfinity;
    final String lower = s.toLowerCase();
    try {
      if (lower.startsWith('0x')) return int.parse(s.substring(2), radix: 16).toDouble();
      if (lower.startsWith('0o')) return int.parse(s.substring(2), radix: 8).toDouble();
      if (lower.startsWith('0b')) return int.parse(s.substring(2), radix: 2).toDouble();
    } catch (_) {
      return double.nan;
    }
    final double? d = double.tryParse(s);
    return d ?? double.nan;
  }
  return double.nan;
}
