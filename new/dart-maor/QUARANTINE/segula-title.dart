// חוט · segula-title — כותרת-תצוגה לתזכורת-סגולה. חוזה: segula-title.contract.md
// המרה מ-JS (new/atoms/segula-title.mjs) — התנהגות זהה-לחלוטין למקור (חוק-4).
// אפס-import (dart-core בלבד). מוצא: maor/src/components/supporters/lib.ts:338-342.
//
// סמנטיקת-JS משומרת:
//   r.final ?  ⇒ truthiness של JS (חוק-7): false/0/NaN/''/null-או-undefined ⇒ שקר.
//   name || '' ⇒ אותה truthiness — ריק/undefined ⇒ מחרוזת ריקה (דוגמאות-החוזה 3–4).
//   שרשור + על מספר ⇒ ToString של JS (חוק-12): 1 ⇒ '1' (לא '1.0' של double-Dart).
//   r = אובייקט {day, final} ⇒ ‏Map ב-Dart; מפתח-חסר = undefined של JS ⇒ 'undefined' (חוק-2).

String segulaTitle(dynamic name, dynamic r, dynamic target) {
  final dynamic rFinal = (r is Map && r.containsKey('final')) ? r['final'] : null;
  final dynamic rDay =
      (r is Map) ? (r.containsKey('day') ? r['day'] : _undef) : null;
  return (_truthy(rFinal) ? '🎯 סיום סגולה' : '🕯 סגולה') +
      ' — ' +
      (_truthy(name) ? _jsStr(name) : '') +
      ' · יום ' +
      _jsStr(rDay) +
      '/' +
      _jsStr(target);
}

/// סמן-undefined מקומי (חוק-2): מפתח-חסר ב-Map ≠ null-מפורש.
const Object _undef = #_undefined;

/// עוזר מקומי: truthiness של JS (חוק-7) — false על null/undefined/false/0/NaN/''.
bool _truthy(dynamic v) {
  if (v == null || identical(v, _undef)) return false;
  if (v is bool) return v;
  if (v is num) return v != 0 && !v.isNaN;
  if (v is String) return v.isNotEmpty;
  return true; // אובייקט/מערך/פונקציה — תמיד אמת ב-JS
}

/// עוזר מקומי: ToString של JS לשרשור-+ (חוק-12, טווח-האטום):
/// שלם-בטוח ⇒ עשרוני בלי ".0"; ‏NaN/±Infinity כלשונם; null⇒'null'; מפתח-חסר⇒'undefined'.
String _jsStr(dynamic v) {
  if (identical(v, _undef)) return 'undefined';
  if (v == null) return 'null';
  if (v is num) {
    if (v.isNaN) return 'NaN';
    if (v == double.infinity) return 'Infinity';
    if (v == double.negativeInfinity) return '-Infinity';
    if (v is double && v == v.truncateToDouble() && v.abs() < 9007199254740992.0) {
      final i = v.truncate();
      // ‏-0.0 ⇒ '0' כמו JS String(-0)
      return i == 0 ? '0' : i.toString();
    }
    return v.toString();
  }
  return '$v';
}
