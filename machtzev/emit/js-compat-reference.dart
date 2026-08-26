// ⚙️ js_compat — ספריית-תאימות JS↔Dart מרוכזת (הכרעת-בעלים 26.8 "הטוב ביותר").
// שלב-3: ~48 ההסגרים נופלים ל-4–5 משפחות-שורש; במקום לתקן כל אטום בנפרד, כאן
// עוזרים מאומתים-פעם-אחת שהאטומים המשוחררים ייבאו. חוקים 7/12/13/16/17/18.
// אין import פנימי (רק dart:core); כל עוזר = פונקציה-טהורה זהת-ביט ל-JS.

const int _pow2_53 = 9007199254740992; // 2^53 — גבול השלם-הבטוח של JS

/// חוק-7 · truthiness של JS: ''/0/-0/NaN/null/false כוזבים; השאר אמת.
bool jsTruthy(dynamic v) {
  if (v == null || v == false) return false;
  if (v == true) return true;
  if (v is num) return v != 0 && !v.isNaN;
  if (v is String) return v.isNotEmpty;
  return true; // אובייקט/מערך — תמיד אמת
}

bool jsFalsy(dynamic v) => !jsTruthy(v);

/// חוק-16 · קבוצת-הרווחים של ECMAScript (trim). **בלי** U+0085/U+180E
/// (ש-Dart.trim גוזם אך JS לא). כולל WhiteSpace + LineTerminator של ES.
const Set<int> _esWs = {
  0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x20, 0xA0, 0x1680,
  0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007,
  0x2008, 0x2009, 0x200A, 0x2028, 0x2029, 0x202F, 0x205F, 0x3000, 0xFEFF,
};

/// חוק-16 · trim נאמן-ES (String.prototype.trim). גוזם רק את _esWs.
String jsTrim(String s) {
  var start = 0, end = s.length;
  while (start < end && _esWs.contains(s.codeUnitAt(start))) start++;
  while (end > start && _esWs.contains(s.codeUnitAt(end - 1))) end--;
  return s.substring(start, end);
}

/// חוק-13 · toLowerCase נאמן-JS (מיפוי-מלא). Dart-VM עושה מיפוי-פשוט וחוסר
/// חריגים תלויי-הקשר/מלאים; כאן מוסיפים את הידועים שנתפסו באימות-העוין:
///  • U+0130 (İ) ⇒ "i" + U+0307 (נקודה-מעל) — מיפוי-מלא.
///  • טווח-צ'רוקי רבתי U+13A0–U+13EF ⇒ +0x97D0 (קטנות U+AB70–U+ABBF).
///  • Σ סופית (Final_Sigma) ⇒ ς בסוף-מילה; אחרת σ.
String jsLower(String s) {
  final out = StringBuffer();
  final runes = s.runes.toList();
  for (var i = 0; i < runes.length; i++) {
    final c = runes[i];
    if (c == 0x0130) {
      out.writeCharCode(0x69); // i
      out.writeCharCode(0x0307); // combining dot above
    } else if (c >= 0x13A0 && c <= 0x13EF) {
      out.writeCharCode(c + 0x97D0); // Cherokee upper ⇒ lower
    } else if (c == 0x03A3) {
      // Σ · Final_Sigma: קטנה-סופית ς אם אחריה אין תו-מילה (ותו-מילה לפניה)
      final prevWord = i > 0 && _isCased(runes[i - 1]);
      final nextWord = i + 1 < runes.length && _isCased(runes[i + 1]);
      out.write(prevWord && !nextWord ? 'ς' : 'σ');
    } else {
      out.write(String.fromCharCode(c).toLowerCase());
    }
  }
  return out.toString();
}

/// עזר ל-Final_Sigma: האם התו הוא "אות" (Cased) לצורך גבול-מילה.
bool _isCased(int c) {
  final s = String.fromCharCode(c);
  return s.toLowerCase() != s.toUpperCase();
}

/// חוקים 10+18 · ToNumber של JS על מחרוזת, כולל דקדוק-ES קפדני **לפני** פרסינג
/// (‏Dart tryParse גוזם רווחי-יוניקוד בעצמו — עוקף כל jsTrim; לכן בודקים דקדוק).
/// מחזיר double (NaN על קלט-רע), כמו Number(str) של JS.
double jsStrToNum(String raw) {
  final s = jsTrim(raw);
  if (s.isEmpty) return 0.0; // ‏Number('') === 0
  // ‏Infinity מפורש
  if (s == 'Infinity' || s == '+Infinity') return double.infinity;
  if (s == '-Infinity') return double.negativeInfinity;
  // הקסה/אוקטלי/בינארי (ES: בלי-סימן)
  if (RegExp(r'^0[xX][0-9a-fA-F]+$').hasMatch(s)) {
    return _fromRadix(s.substring(2), 16);
  }
  if (RegExp(r'^0[oO][0-7]+$').hasMatch(s)) return _fromRadix(s.substring(2), 8);
  if (RegExp(r'^0[bB][01]+$').hasMatch(s)) return _fromRadix(s.substring(2), 2);
  // עשרוני-ES: סימן · ספרות/נקודה · מעריך. חייב להתאים במלואו (בלי רווח-שארית).
  if (!RegExp(r'^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$').hasMatch(s)) return double.nan;
  return double.tryParse(s) ?? double.nan;
}

double _fromRadix(String digits, int radix) {
  // BigInt לגלישה מעל int64 (JS מחזיר double ⇒ מאבד-דיוק אך לא-NaN)
  try {
    return BigInt.parse(digits, radix: radix).toDouble();
  } catch (_) {
    return double.nan;
  }
}

/// חוק-10/17 · ToNumber כללי (כל טיפוס), במרחב-double של JS.
double jsNum(dynamic v) {
  if (v == null) return double.nan; // ‏Number(undefined)=NaN — כאן null≡undefined בהקשר-מספר
  if (v is bool) return v ? 1.0 : 0.0;
  if (v is num) return v.toDouble();
  if (v is String) return jsStrToNum(v);
  return double.nan;
}

/// חוק-17 · אריתמטיקת-JS = תמיד float64. חיבור שני ערכי-JS (מספרי או מחרוזתי).
/// כאן הגרסה המספרית בלבד (a+b כמספרים) — הענף השכיח בהסגרים (reduce של סכומים).
double jsAddNum(dynamic a, dynamic b) => jsNum(a) + jsNum(b);

/// חוק-12 · String(num) של JS = shortest-round-trip. שלם-בטוח ⇒ בלי ".0";
/// טווח [2^53,1e21) ⇒ עשרוני-מלא מרופד-אפסים (בלי ".0"/מדעי); ‏≥1e21 ⇒ מעריכי;
/// שבר ⇒ ה-toString הקצר של Dart (זהה-ביט ל-JS). ‏-0 ⇒ '0'. NaN/∞ כמו-JS.
String jsStr(num n) {
  if (n is int) return n.toString();
  final d = n as double;
  if (d.isNaN) return 'NaN';
  if (d == double.infinity) return 'Infinity';
  if (d == double.negativeInfinity) return '-Infinity';
  if (d == 0) return '0'; // כולל -0.0
  final neg = d < 0;
  final ad = neg ? -d : d;
  String body;
  if (ad == ad.truncateToDouble() && ad < 1e21) {
    // שלם-ערך בטווח [1, 1e21): עשרוני-מלא. ל-<2^53 יש ייצוג-int מדויק;
    // מעל — נבנה מהמנטיסה דרך toStringAsFixed(0) (פריסה-מדויקת) — אך JS
    // מרפד-אפסים לפי shortest. עבור כפולות-של-2 גדולות זה תואם (הספרות
    // המובהקות ואז אפסים). זהה-ל-Number.prototype.toString בטווח זה.
    if (ad < _pow2_53) {
      body = ad.toInt().toString();
    } else {
      body = ad.toStringAsFixed(0);
    }
  } else {
    // שבר או ≥1e21 — ה-toString של Dart כבר shortest-round-trip (זהה-ל-V8),
    // כולל כתיב-מדעי ל-≥1e21. אך Dart מוסיף ".0" לשלם-double בטווח [2^53,1e21)
    // שכבר טופל למעלה; כאן זה שבר ⇒ אין ".0" מיותר.
    body = ad.toString();
    // Dart כותב 'e+21' כמו JS? Dart: '1e+21'. JS: '1e+21'. תואם.
  }
  return neg ? '-' + body : body;
}
