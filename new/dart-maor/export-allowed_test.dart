// רתמת-הזהב · export-allowed — בדיוק דוגמאות-החוזה של new/atoms/export-allowed.test.mjs
// אותם קלטים→פלטים; אם עובר, Dart≡JS (חוק-4).
import 'export-allowed.dart';

void main() {
  // ok(exportAllowed(false) === true, 'לא-חסום ⇒ חייב true');
  assert(exportAllowed(false) == true, 'לא-חסום ⇒ חייב true');

  // ok(exportAllowed(true) === false, 'חסום ⇒ חייב false');
  assert(exportAllowed(true) == false, 'חסום ⇒ חייב false');

  // ok(exportAllowed(undefined) === true, 'חסר-דגל ⇒ חייב true'); — undefined⇒null ב-Dart
  assert(exportAllowed(null) == true, 'חסר-דגל ⇒ חייב true (חסר=מותר)');

  // ok(exportAllowed(null) === true, 'null ⇒ חייב true');
  assert(exportAllowed(null) == true, 'null ⇒ חייב true');

  // const r5 = exportAllowed(0); ok(r5 === true && typeof r5 === 'boolean', '0 ⇒ true בוליאני אמיתי');
  final r5 = exportAllowed(0);
  assert(r5 == true && r5 is bool, '0 ⇒ true בוליאני אמיתי');

  print('✓ export-allowed (Dart): 5 דוגמאות-חוזה — ירוק');
}
