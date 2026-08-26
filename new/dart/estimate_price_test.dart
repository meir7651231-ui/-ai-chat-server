// בדיקת-חוזה · estimatePrice — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/estimate_price_test.dart
import 'estimate_price.dart';

void _check(PriceEstimate e, int total, int count, bool low, String label) {
  if (e.totalILS != total || e.itemCount != count || e.lowConfidence != low) {
    throw StateError('FAIL [$label]: got(total=${e.totalILS},count=${e.itemCount},'
        'low=${e.lowConfidence}) want(total=$total,count=$count,low=$low)');
  }
}

void main() {
  var n = 0;
  // המנוע נבדק עם **דאטה מוזרקת** (טבלה-זעירה + fallback) — מוכיח מנגנון, לא ערכי-אמת.
  const t = {'ברזי מטבח': 420, 'אביזרי נחושת': 18, 'אביזרי תבריג': 15};
  PriceEstimate est(List<String> cats) => estimatePrice<String>(cats,
      categoryHe: (c) => c, priceTable: t, fallbackIls: 25);

  _check(est(const []), 0, 0, true, '1 empty'); n++;
  _check(est(const ['ברזי מטבח']), 420, 1, false, '2 one matched'); n++;
  _check(est(const ['לא-קיים']), 25, 1, true, '3 fallback מוזרק'); n++;
  _check(est(const ['ברזי מטבח', 'לא-קיים']), 445, 2, false, '4 half matched'); n++;
  _check(est(const ['ברזי מטבח', 'x', 'y']), 470, 3, true, '5 minority matched'); n++;
  _check(est(const ['אביזרי נחושת', 'אביזרי תבריג']), 33, 2, false, '6 all matched'); n++;
  // מנגנון: fallback שונה ⇒ תוצאה שונה (מוכיח שה-fallback מוזרק, לא צרוב)
  _check(estimatePrice<String>(const ['zz'], categoryHe: (c) => c, priceTable: t, fallbackIls: 99), 99, 1, true, '7 fallback מוחלף'); n++;

  assert(est(const []).lowConfidence == true, 'assert-live guard');

  print('OK estimatePrice: $n asserts passed (מנוע-נקי · דאטה מוזרקת)');
}
