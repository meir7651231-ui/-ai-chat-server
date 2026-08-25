import 'module-on.dart';

/// רתמת-זהב: אותן 5 דוגמאות-חוזה בדיוק מ-new/atoms/module-on.test.mjs.
/// אם עובר — Dart ≡ JS (חוק-4). ‏undefined של JS ממופה ל-null במילון (חוק-2).
void main() {
  var f = 0;
  void eq(bool a, bool b, String msg) {
    if (a != b) {
      print('✗ $msg ⇒ $a');
      f = 1;
    }
  }

  // 1) רק false מכבה
  eq(moduleOn({'modules': {'families': false}}, 'families'), false,
      '1 false מפורש לא כיבה');

  // 2) מפתח חסר = פעיל
  eq(moduleOn({'modules': {}}, 'families'), true, '2 מפתח חסר לא פעיל');

  // 3) true מפורש = פעיל
  eq(moduleOn({'modules': {'shop': true}}, 'shop'), true, '3 true מפורש לא פעיל');

  // 4) כיבוי-שכן לא מדביק
  eq(moduleOn({'modules': {'shop': false}}, 'tzedaka'), true,
      '4 כיבוי-שכן הדביק');

  // 5) undefined ≠ false (ב-Dart: null-מפורש במילון)
  eq(moduleOn({'modules': {'courses': null}}, 'courses'), true,
      '5 undefined כיבה בטעות');

  if (f != 0) throw StateError('module-on: סטייה מהמקור');
  print('✓ module-on: 5 דוגמאות-חוזה — ירוק');
}
