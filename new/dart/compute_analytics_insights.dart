// ⚛️ אטום-Dart (דרגת-חוזה) · computeAnalyticsInsights
// תפקיד: בניית רשימת תובנות-אנליטיקה (Insight) מרשימת-הזמנות — ספירה/סכום/ממוצע/פתוחות-מול-סופקו,
//        חיסכון-אפשרי, וניצול-תקציב. משמש מסך ה-AI-Hub.
// מוצא: buildsmart/app_flutter/lib/logic/ai_hub_logic.dart:346-394 (‏computeAnalyticsInsights; חוק-4).
// טוהר: פונקציית top-level עצמאית, אפס import (dart:core בלבד).
// אחים-שסוקטו: `fMoney(int)` (עיצוב-סכום) ⇒ שקע `fMoney` · `aiAlternatives()` (חלופות-זולות) ⇒
//        שקע `aiAlternatives` (חוק-3). אחים-שהוטבעו: הטיפוסים `Insight`(ic/title/sub) ו-`Order`
//        (sum/isOpen) כ-records inline (טיפוס-שכן ⇒ inline).
// אחים-שהוסקו-כשקע: `kBudgetTotal`/`kBudgetSpent` — const-י-תקציב שערכם **לא הופיע בטיוטה**;
//        לפי חוק-6 (קונפיגורציה=הזרקה) הומרו לפרמטרים-בשם (במקור היו const; ה-`const budgetLeft`
//        הפך ל-`final`, אותה התנהגות). אם קיים ערך-מקור אמיתי — מוזרק בחיווט-הקופסה, לא באטום.
//
// קלט:  orders         — ההזמנות: `({int sum, bool isOpen})`.
//       fMoney         — שקע: עיצוב-סכום למחרוזת.
//       aiAlternatives — שקע: החלופות, כל אחת עם `save` (int).
//       kBudgetTotal   — סך-התקציב (int, מוזרק). kBudgetSpent — הנוצל (int, מוזרק).
// פלט:  List<Insight> (record ic/title/sub) בסדר-הבנייה.

/// Analytics insight list from orders: counts/sum/avg, open-vs-delivered, possible
/// savings, budget utilisation. `fMoney`/`aiAlternatives`/budget consts injected.
/// Verbatim behaviour of ai_hub_logic.dart:346-394.
List<({String ic, String title, String sub})> computeAnalyticsInsights(
  List<({int sum, bool isOpen})> orders, {required String Function(String) term, 
  required String Function(int) fMoney,
  required List<({int save})> Function() aiAlternatives,
  required int kBudgetTotal,
  required int kBudgetSpent,
}) {
  final out = <({String ic, String title, String sub})>[];

  final orderCount = orders.length;
  final totalSpend = orders.fold<int>(0, (s, o) => s + o.sum);
  final openCount = orders.where((o) => o.isOpen).length;
  final deliveredCount = orderCount - openCount;

  if (orderCount > 0) {
    out.add((
      ic: '📦',
      title: '$orderCount הזמנות · ${fMoney(totalSpend)} סה״כ רכש',
      sub: term('mtvk-mnva-hhzmnvt-hmshvtf'),
    ));
    final avg = (totalSpend / orderCount).round();
    out
      ..add((
        ic: '💵',
        title: 'שווי הזמנה ממוצע: ${fMoney(avg)}',
        sub: term('mmvtsa-al-pny-kl-hhzmnvt'),
      ))
      ..add((
        ic: '🚚',
        title: '$openCount הזמנות פתוחות · $deliveredCount סופקו',
        sub: term('lpy-shlb-hhzmnh-hnvkchy'),
      ));
  }

  final savings = aiAlternatives().fold<int>(0, (s, a) => s + a.save);
  if (savings > 0) {
    out.add((
      ic: '💰',
      title: 'חיסכון אפשרי: ${fMoney(savings)}',
      sub: term('mabr-lmvtgym-zvlym-yvtr-bavtv-mvtsr'),
    ));
  }

  final budgetPctValue =
      kBudgetTotal > 0 ? (kBudgetSpent / kBudgetTotal * 100).round() : 0;
  final budgetLeft = kBudgetTotal - kBudgetSpent;
  out.add((
    ic: '📊',
    title: 'ניצול תקציב: $budgetPctValue%',
    sub: 'נותרו ${fMoney(budgetLeft)} מתוך ${fMoney(kBudgetTotal)}',
  ));

  return out;
}
