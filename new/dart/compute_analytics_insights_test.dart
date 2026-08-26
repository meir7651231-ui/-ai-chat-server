// בדיקת-חוזה · computeAnalyticsInsights — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/compute_analytics_insights_test.dart
import 'compute_analytics_insights.dart';

String _money(int n) => '₪$n'; // שקע-בדיקה

typedef _Ins = ({String ic, String title, String sub});

void _eqIns(_Ins got, String ic, String title, String sub, String label) {
  if (got.ic != ic || got.title != title || got.sub != sub) {
    throw StateError('FAIL [$label]: got=$got');
  }
}

void main() {
  var n = 0;

  // — דוגמה A: ריק, תקציב אפס ⇒ רק 📊 —
  var r = computeAnalyticsInsights(
    const [],
    fMoney: _money,
    aiAlternatives: () => const [],
    kBudgetTotal: 0,
    kBudgetSpent: 0,
  );
  if (r.length != 1) throw StateError('FAIL [A len]: ${r.length}');
  _eqIns(r[0], '📊', 'ניצול תקציב: 0%', 'נותרו ₪0 מתוך ₪0', 'A budget');
  n++;

  // — דוגמה B: 2 הזמנות, חיסכון, תקציב —
  r = computeAnalyticsInsights(
    const [(sum: 100, isOpen: true), (sum: 200, isOpen: false)],
    fMoney: _money,
    aiAlternatives: () => const [(save: 50), (save: 30)],
    kBudgetTotal: 1000,
    kBudgetSpent: 250,
  );
  if (r.length != 5) throw StateError('FAIL [B len]: ${r.length}');
  _eqIns(r[0], '📦', '2 הזמנות · ₪300 סה״כ רכש', 'מתוך מנוע ההזמנות המשותף', 'B0');
  _eqIns(r[1], '💵', 'שווי הזמנה ממוצע: ₪150', 'ממוצע על פני כל ההזמנות', 'B1');
  _eqIns(r[2], '🚚', '1 הזמנות פתוחות · 1 סופקו', 'לפי שלב ההזמנה הנוכחי', 'B2');
  _eqIns(r[3], '💰', 'חיסכון אפשרי: ₪80', 'מעבר למותגים זולים יותר באותו מוצר', 'B3');
  _eqIns(r[4], '📊', 'ניצול תקציב: 25%', 'נותרו ₪750 מתוך ₪1000', 'B4');
  n += 5;

  // — דוגמה C: הזמנה אחת, בלי חיסכון, תקציב אפס ⇒ 4 פריטים (בלי 💰) —
  r = computeAnalyticsInsights(
    const [(sum: 10, isOpen: true)],
    fMoney: _money,
    aiAlternatives: () => const [],
    kBudgetTotal: 0,
    kBudgetSpent: 0,
  );
  if (r.length != 4) throw StateError('FAIL [C len]: ${r.length}');
  _eqIns(r[0], '📦', '1 הזמנות · ₪10 סה״כ רכש', 'מתוך מנוע ההזמנות המשותף', 'C0');
  _eqIns(r[2], '🚚', '1 הזמנות פתוחות · 0 סופקו', 'לפי שלב ההזמנה הנוכחי', 'C2');
  _eqIns(r[3], '📊', 'ניצול תקציב: 0%', 'נותרו ₪0 מתוך ₪0', 'C3');
  n += 3;

  assert(
      computeAnalyticsInsights(const [],
              fMoney: _money,
              aiAlternatives: () => const [],
              kBudgetTotal: 0,
              kBudgetSpent: 0)
          .length ==
      1, 'assert-live guard');

  print('OK computeAnalyticsInsights: $n asserts passed');
}
