// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · computeAnalyticsInsights — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/ai_hub_logic.dart:346-394 (49 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): where, fMoney, aiAlternatives
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
List<Insight> computeAnalyticsInsights(List<Order> orders) {
  final out = <Insight>[];

  final orderCount = orders.length;
  final totalSpend = orders.fold<int>(0, (s, o) => s + o.sum);
  final openCount = orders.where((o) => o.isOpen).length;
  final deliveredCount = orderCount - openCount;

  if (orderCount > 0) {
    out.add(Insight(
      ic: '📦',
      title: '$orderCount הזמנות · ${fMoney(totalSpend)} סה״כ רכש',
      sub: 'מתוך מנוע ההזמנות המשותף',
    ));
    final avg = (totalSpend / orderCount).round();
    out
      ..add(Insight(
        ic: '💵',
        title: 'שווי הזמנה ממוצע: ${fMoney(avg)}',
        sub: 'ממוצע על פני כל ההזמנות',
      ))
      ..add(Insight(
        ic: '🚚',
        title: '$openCount הזמנות פתוחות · $deliveredCount סופקו',
        sub: 'לפי שלב ההזמנה הנוכחי',
      ));
  }

  final savings = aiAlternatives().fold<int>(0, (s, a) => s + a.save);
  if (savings > 0) {
    out.add(Insight(
      ic: '💰',
      title: 'חיסכון אפשרי: ${fMoney(savings)}',
      sub: 'מעבר למותגים זולים יותר באותו מוצר',
    ));
  }

  final budgetPctValue =
      kBudgetTotal > 0 ? (kBudgetSpent / kBudgetTotal * 100).round() : 0;
  const budgetLeft = kBudgetTotal - kBudgetSpent;
  out.add(Insight(
    ic: '📊',
    title: 'ניצול תקציב: $budgetPctValue%',
    sub: 'נותרו ${fMoney(budgetLeft)} מתוך ${fMoney(kBudgetTotal)}',
  ));

  return out;
}

