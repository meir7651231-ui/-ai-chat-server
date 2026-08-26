// רתמת-זהב · cockpit-days-since — asserts = דוגמאות-החוזה של בדיקת-ה-JS (זהים: אותם קלטים→פלטים).
// עובר ⇒ Dart≡JS≡Node. (Infinity = double.infinity; ב-JS-golden הוצג "null" — אותו ערך.)
import 'cockpit-days-since.dart';

void main() {
  assert(cockpitDaysSince('', '') == double.infinity);
  assert(cockpitDaysSince('2026-08-26', '2026-08-26') == 0);
  assert(cockpitDaysSince('2026-08-20', '2026-08-26') == 6);
  assert(cockpitDaysSince('2026-08-27', '2026-08-26') == -1);
  assert(cockpitDaysSince('2026-07-26', '2026-08-26') == 31);
  assert(cockpitDaysSince('bad', '2026-08-26') == double.infinity);
  assert(cockpitDaysSince('2026-08-26', '') == double.infinity);
  assert(cockpitDaysSince('2024-02-28', '2024-03-01') == 2);
  assert(cockpitDaysSince('2026-02-28', '2026-03-01') == 1);
  assert(cockpitDaysSince('2025-12-31', '2026-01-01') == 1);
  print('✓ cockpit-days-since Dart: 10 asserts — Dart≡JS');
}
