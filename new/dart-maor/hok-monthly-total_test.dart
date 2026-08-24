// רתמת-זהב · hok-monthly-total — 5 דוגמאות-החוזה, זהות ל-new/atoms/hok-monthly-total.test.mjs.
// עובר ⇒ Dart ≡ JS. הרצה: dart run --enable-asserts hok-monthly-total_test.dart
import 'hok-monthly-total.dart';

void main() {
  // 1) בלי todayIso — לפי הדגל; דולר בשער 3.7
  final list1 = [
    {'hok': {'active': true, 'amount': 100, 'cur': '₪'}},
    {'hok': {'active': true, 'amount': 10, 'cur': '\$'}},
    {'hok': {'active': false, 'amount': 500, 'cur': '₪'}},
  ];
  assert(hokMonthlyTotal(list1, 3.7) == 137, 'דוגמה 1 ≠ 137');

  // 2) עיגול הסכום הכולל
  assert(
      hokMonthlyTotal([
            {'hok': {'active': true, 'amount': 10, 'cur': '\$'}}
          ], 3.685) ==
          37,
      '36.85 לא עוגל ל-37');

  // 3) cur חסר ⇒ ש"ח
  assert(
      hokMonthlyTotal([
            {'hok': {'active': true, 'amount': 80}}
          ], 3.7) ==
          80,
      'cur חסר ≠ 80');

  // 4) ריק / כולם-כבויים
  assert(hokMonthlyTotal([], 3.7) == 0, '[] ≠ 0');
  assert(
      hokMonthlyTotal([
            {'hok': {'active': false, 'amount': 90, 'cur': '₪'}}
          ], 3.7) ==
          0,
      'כולם-כבויים ≠ 0');

  // 5) עם todayIso — השקע מנכה הו"ק שפגה; בלעדיו — לא נקרא
  bool sock(dynamic sp, dynamic t) => (sp['hok'] as Map)['kevaId'] != 'פג';
  final list5 = [
    {'hok': {'active': true, 'amount': 200, 'cur': '₪', 'kevaId': 'פג'}},
    {'hok': {'active': true, 'amount': 50, 'cur': '₪'}},
  ];
  assert(hokMonthlyTotal(list5, 3.7, '2026-08-24', sock) == 50,
      'עם todayIso ≠ 50 (הפגה לא נוכתה)');
  assert(hokMonthlyTotal(list5, 3.7) == 250, 'בלי todayIso ≠ 250');

  // והוכחה שהשקע לא נקרא בלי todayIso:
  var called = 0;
  hokMonthlyTotal(list5, 3.7, null, (sp, t) {
    called++;
    return true;
  });
  assert(called == 0, 'השקע נקרא למרות שאין todayIso');

  print('✓ hok-monthly-total (Dart): 5 דוגמאות-חוזה — ירוק');
}
