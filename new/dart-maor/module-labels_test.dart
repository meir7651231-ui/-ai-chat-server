// רתמת-הזהב · module-labels — בדיוק דוגמת-החוזה מ-new/atoms/module-labels.test.mjs.
// המקור הוא אטום-קבוע (צילום-ערך): ההתחייבות = MODULE_LABELS זהה-ביט לצילום ה-JS
// (JSON.stringify order-sensitive ⇒ אותם מפתחות, אותו סדר, אותם ערכים, אותה כמות).
// אם עובר, Dart ≡ JS. הרצה: dart run --enable-asserts module-labels_test.dart
import 'module-labels.dart';

void main() {
  // הצילום מ-new/atoms/module-labels.test.mjs (SNAP.MODULE_LABELS) — סדר + זוגות.
  const expectedKeys = [
    'families',
    'courses',
    'calendar',
    'diary',
    'supporters',
    'reports',
    'tzedaka',
    'shop',
    'shop7',
  ];
  const expectedVals = [
    'משפחות',
    'חוגים',
    'לוח שנה',
    'יומן חדרים',
    'תורמים',
    'דוחות',
    'קופות צדקה',
    'חנות',
    'חלוקה',
  ];

  final keys = MODULE_LABELS.keys.toList();
  // כמות זהה (אין מפתח עודף/חסר)
  assert(keys.length == expectedKeys.length, 'כמות מפתחות סטתה מהצילום');
  // סדר-הכנסה זהה + ערך זהה לכל מפתח (JSON.stringify רגיש-לסדר)
  for (var i = 0; i < expectedKeys.length; i++) {
    assert(keys[i] == expectedKeys[i], 'מפתח[$i] סטה מהצילום: ${keys[i]}');
    assert(MODULE_LABELS[expectedKeys[i]] == expectedVals[i],
        'ערך[${expectedKeys[i]}] סטה מהצילום');
  }

  print('✓ module-labels (Dart): צילום-ערך תואם — ירוק');
}
