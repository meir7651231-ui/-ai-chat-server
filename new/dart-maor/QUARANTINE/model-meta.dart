// ⚛️ אטום-Dart (דרגת-חוזה) · modelMeta — תווית + צבעי מסלול-התמחור של חוג.
// מוצא: maor/src/components/courses/lib.ts:200-206 · המקור: new/atoms/model-meta.mjs.
// טוהר: פונקציה top-level עצמאית, אפס import (רק שפה/סטנדרט: dart:core). חוק-4 —
//        התנהגות זהה-ביט למקור-ה-JS (המקור קדוש). אפס-שקעים (אין לוח-עברי/locale).
//
// תפקיד: לפי c.model מחזיר {label, bg, c} — תווית עברית + צבע-רקע + צבע-טקסט (hex).
//        punch משבץ את c.size בתווית; כל מודל לא-מוכר/חסר ⇒ ברירת-המחדל 'מנוי חודשי'.
// קלט:  c — Map של חוג (model, ול-punch גם size). פלט: Map {label, bg, c}.
//
// הערות-המרה (מקור→Dart):
//  • גישת-שדה `c.model` ⇒ `c['model']` (הקלט מיוצג כ-Map, כמו אובייקט-JS).
//  • `=== 'punch'` (השוואה-קפדנית למחרוזת) ⇒ `== 'punch'` — שקול כאן: רק מחרוזת
//    זהה עוברת; כל טיפוס אחר (מספר/null/חסר) נופל לענף-ברירת-המחדל, כמו ב-JS.
//  • שרשור `'…' + c.size + '…'`: ב-JS המספר עובר coercion למחרוזת. ב-Dart מזוקק
//    לעוזר מקומי `_jsStr` שמחקה את ToString של JS: int כלשונו; double שלם-ערך
//    בלי '.0' (10.0⇒'10' כמו ב-JS); NaN/Infinity בכתיב-JS; מחרוזת כלשונה.
//  • חוק-2 (null מול undefined): מפתח `size` חסר ⇒ 'undefined' (כמו undefined ב-JS);
//    null מפורש ⇒ 'null'. ההבחנה דרך `containsKey`, לא דרך `== null`.
//  • אין מיון/תאריך/מודולו/truthiness-על-קלט — ארבעה ענפי-השוואה + שיבוץ בלבד.

/// Label + pricing-track colors for a course, verbatim port of
/// new/atoms/model-meta.mjs (`modelMeta`). Unknown model ⇒ 'מנוי חודשי'.
Map<String, dynamic> modelMeta(dynamic c) {
  if (c['model'] == 'punch') {
    return {
      'label': 'כרטיסייה · ' + _jsStr(c, 'size') + ' ניקובים',
      'bg': '#fdf1d4',
      'c': '#9a6414',
    };
  }
  if (c['model'] == 'half_year') {
    return {'label': 'מנוי חצי-שנתי', 'bg': '#e7edf5', 'c': '#3a5a86'};
  }
  if (c['model'] == 'year') {
    return {'label': 'מנוי שנתי', 'bg': '#efe7f3', 'c': '#7c3aed'};
  }
  return {'label': 'מנוי חודשי', 'bg': '#e4f5ea', 'c': '#12803c'};
}

/// JS-style string coercion of the map field [key] on [c] — mirrors what
/// `'' + c.size` yields in JS: missing key ⇒ 'undefined', explicit null ⇒
/// 'null' (rule 2), numbers via JS number-to-string (rule: 10.0 ⇒ '10').
String _jsStr(dynamic c, String key) {
  final bool present = c is Map ? c.containsKey(key) : false;
  if (!present) return 'undefined';
  final dynamic v = c[key];
  if (v == null) return 'null';
  if (v is num) return _jsNum(v);
  if (v is bool) return v ? 'true' : 'false';
  return v.toString();
}

/// JS Number→String: NaN/Infinity in JS spelling; integral doubles without
/// the Dart '.0' suffix; everything else via toString.
String _jsNum(num v) {
  if (v is double) {
    if (v.isNaN) return 'NaN';
    if (v == double.infinity) return 'Infinity';
    if (v == double.negativeInfinity) return '-Infinity';
    if (v == v.truncateToDouble()) {
      // JS prints integral doubles with no fraction (10.0 ⇒ '10'); ‎-0 ⇒ '0'.
      if (v == 0) return '0';
      return v.truncate().toString();
    }
  }
  return v.toString();
}
