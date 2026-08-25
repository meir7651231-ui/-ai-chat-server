// רתמת-זהב · mat-cost-total — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות ביט-אחר-ביט).
// מייבאת אך ורק את האטום-שלה (חוק-4). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/mat-cost-total_test.dart  ⇒ exit 0
import 'mat-cost-total.dart';

void main() {
  final eqBasic = matCostTotal({
    'mat': [
      {'qty': 2, 'cost': 50},
      {'qty': 3, 'cost': 10},
    ],
  });
  assert(eqBasic == 130, '✗ סכימה בסיסית ⇒ $eqBasic ≠ 130');

  assert(matCostTotal({}) == 0, '✗ בלי mat ≠ 0');

  assert(matCostTotal({'mat': []}) == 0, '✗ mat ריק ≠ 0');

  final eqStr = matCostTotal({
    'mat': [
      {'qty': '2.5', 'cost': '4'},
    ],
  });
  assert(eqStr == 10, '✗ מחרוזות מספריות ⇒ $eqStr ≠ 10');

  final eqJunk = matCostTotal({
    'mat': [
      {'qty': 'אבג', 'cost': 100},
    ],
  });
  assert(eqJunk == 0, '✗ כמות-זבל ⇒ $eqJunk ≠ 0');

  final eqMissing = matCostTotal({
    'mat': [
      {'qty': 3},
    ],
  });
  assert(eqMissing == 0, '✗ מחיר חסר ⇒ $eqMissing ≠ 0');

  final eqBroken = matCostTotal({
    'mat': [
      {'qty': 1, 'cost': 80},
      {'qty': null, 'cost': 20},
    ],
  });
  assert(eqBroken == 80, '✗ שורה שבורה מדולגת ⇒ $eqBroken ≠ 80');

  print('✓ mat-cost-total (Dart): 7 דוגמאות-חוזה — ירוק');
}
