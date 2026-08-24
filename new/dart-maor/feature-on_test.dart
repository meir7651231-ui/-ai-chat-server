import 'feature-on.dart';

/// רתמת-זהב: אותן 7 דוגמאות-חוזה בדיוק מ-new/atoms/feature-on.test.mjs.
/// אם עובר — Dart ≡ JS (חוק-4).
void main() {
  const nav = ['families', 'courses'];
  bool on(Map<String, dynamic> cfg, String k) => true;

  var f = 0;
  void eq(bool a, bool b, String msg) {
    if (a != b) {
      print('✗ $msg ⇒ $a');
      f = 1;
    }
  }

  // 1) מפתח חסר = פעיל
  eq(featureOn({'features': {}}, 'families.x', nav, on), true, 'מפתח חסר לא פעיל');

  // 2) הדגל עצמו כבוי
  eq(featureOn({'features': {'families.x': false}}, 'families.x', nav, on), false,
      'דגל כבוי לא כיבה');

  // 3) שרשור-אבות: שורש כבוי + אב-ביניים כבוי
  eq(featureOn({'features': {'families': false}}, 'families.x.y', nav, on), false,
      'אב-שורש כבוי לא שורשר');
  eq(featureOn({'features': {'a.b': false}}, 'a.b.c', nav, on), false,
      'אב-ביניים כבוי לא שורשר');

  // 4) מודול-ניווט כבוי מכבה הכול
  eq(featureOn({'features': {}}, 'families.x', nav, (cfg, k) => false), false,
      'מודול כבוי לא כיבה');

  // 5) קידומת שאינה מודול-ניווט — moduleOn לא נשאל
  var asked = 0;
  eq(
      featureOn({'features': {}}, 'core.export', nav, (cfg, k) {
        asked++;
        return false;
      }),
      true,
      'core כובה בטעות');
  eq(asked == 0, true, 'moduleOn נשאל על קידומת שאינה מודול');

  // 6) cfg בלי features בכלל — סלחני
  eq(featureOn({}, 'families.x', nav, on), true, 'cfg ריק קרס/שגוי');

  // 7) true מפורש אינו שונה מחסר
  eq(featureOn({'features': {'families.x': true}}, 'families.x.y', nav, on), true,
      'true מפורש כיבה בטעות');

  if (f != 0) throw StateError('feature-on: סטייה מהמקור');
  print('✓ feature-on: 7 דוגמאות-חוזה — ירוק');
}
