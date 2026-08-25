// רתמת-זהב · time-hours-total — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות ביט-אחר-ביט).
// מייבאת אך ורק את האטום-שלה (חוק-4). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/time-hours-total_test.dart  ⇒ exit 0
import 'time-hours-total.dart';

void main() {
  final eqBasic = timeHoursTotal({
    'time': [
      {'hours': 2},
      {'hours': 3.5},
    ],
  });
  assert(eqBasic == 5.5, '✗ סכימה בסיסית ⇒ $eqBasic ≠ 5.5');

  assert(timeHoursTotal({'time': []}) == 0, '✗ time ריק ≠ 0');

  assert(timeHoursTotal({}) == 0, '✗ בלי time ≠ 0');

  final eqStr = timeHoursTotal({
    'time': [
      {'hours': '4'},
    ],
  });
  assert(eqStr == 4, '✗ מחרוזת מספרית ⇒ $eqStr ≠ 4');

  final eqJunk = timeHoursTotal({
    'time': [
      {'hours': 'שבור'},
      {'hours': 1},
    ],
  });
  assert(eqJunk == 1, '✗ שעות-זבל (NaN⇒0) ⇒ $eqJunk ≠ 1');

  final eqMissing = timeHoursTotal({
    'time': [
      {},
    ],
  });
  assert(eqMissing == 0, '✗ hours חסר ⇒ $eqMissing ≠ 0');

  print('✓ time-hours-total (Dart): 6 דוגמאות-חוזה — ירוק');
}
