/// חוט · template-lines-to-names — שורות-תבנית (שם·כמות·מחיר) ⇒ פריטי-BOQ חדשים,
/// עם מזהים מסופק-המזהים המוזרק (nextId — שקע, פרמטר כבר במקור).
/// חוזה: template-lines-to-names.contract.md
/// המרה זהת-ביט מ-new/atoms/template-lines-to-names.mjs. אפס import של אטום אחר.

/// קבוצת-הרווחים של ES (חוק-16): WhiteSpace + LineTerminator של JS בלבד —
/// U+0085 ו-U+180E אינם נגזמים (בניגוד ל-String.trim של Dart).
bool _isJsWhitespace(int c) =>
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

/// trim בסמנטיקת-ES (חוק-16).
String _jsTrim(String s) {
  var start = 0;
  var end = s.length;
  while (start < end && _isJsWhitespace(s.codeUnitAt(start))) {
    start++;
  }
  while (end > start && _isJsWhitespace(s.codeUnitAt(end - 1))) {
    end--;
  }
  return s.substring(start, end);
}

/// truthiness של JS (חוק-7): '' / 0 / -0 / NaN / null / false ⇒ כוזב.
bool _truthy(dynamic v) {
  if (v == null) return false;
  if (v is bool) return v;
  if (v is num) return !(v == 0 || v.isNaN);
  if (v is String) return v.isNotEmpty;
  return true;
}

/// ToNumber של JS (חוקים 10+18): null⇒0, bool⇒0/1, מחרוזת לפי דקדוק-מספר-ES
/// (גזימת-ES, ריק⇒0, עשרוני/hex/oct/bin/Infinity), אחרת NaN. parse לא זורק.
num _toNum(dynamic v) {
  if (v == null) return 0;
  if (v is num) return v;
  if (v is bool) return v ? 1 : 0;
  if (v is String) {
    final t = _jsTrim(v);
    if (t.isEmpty) return 0;
    // סימן על ליטרל עשרוני/Infinity בלבד (לא על hex/oct/bin — כמו ב-ES).
    if (RegExp(r'^[+-]?Infinity$').hasMatch(t)) {
      return t.startsWith('-') ? double.negativeInfinity : double.infinity;
    }
    if (RegExp(r'^0[xX][0-9a-fA-F]+$').hasMatch(t)) {
      return int.parse(t.substring(2), radix: 16);
    }
    if (RegExp(r'^0[oO][0-7]+$').hasMatch(t)) {
      return int.parse(t.substring(2), radix: 8);
    }
    if (RegExp(r'^0[bB][01]+$').hasMatch(t)) {
      return int.parse(t.substring(2), radix: 2);
    }
    if (!RegExp(r'^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$').hasMatch(t)) {
      return double.nan;
    }
    return num.tryParse(t) ?? double.nan;
  }
  return double.nan;
}

/// שורות-תבנית ⇒ פריטי-BOQ: ‏qty→eyes (שבור⇒0) · ‏done:false · ‏rate רק
/// כשחיובי (מפתח-חסר, לא null — חוק-2) · ריקי-שם מסולקים · ‏i של nextId =
/// האינדקס אחרי הסינון.
List<dynamic> templateLinesToNames(dynamic lines, dynamic nextId) {
  final out = <dynamic>[];
  var i = 0;
  for (final l in (lines as List)) {
    final rawName = _truthy(l['name']) ? l['name'] : '';
    if (_jsTrim(rawName as String).isEmpty) continue;
    final n = _toNum(l['qty']);
    final eyes = (n.isNaN || n == 0) ? 0 : n; // ‏+l.qty || 0
    final item = <String, dynamic>{
      'id': nextId(i),
      'name': _jsTrim(rawName),
      'eyes': eyes,
      'done': false,
    };
    if (_toNum(l['rate']) > 0) item['rate'] = l['rate'];
    out.add(item);
    i++;
  }
  return out;
}
