// ⚛️ אטום-Dart (דרגת-חוזה) · manifoldOutlets
// תפקיד: מונה מוצאים-מקבילים של מחלק-הפצה אמיתי (‏"מחלק"/"מחלקים") לפי המפרט-המאומת;
//        מסעף (‏tee) עם 3+ קצוות אך אינו-מחלק ⇒ 0 (סיווג לפי טקסונומיה, לא ספירת-קצוות).
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:1471-1487 (‏manifoldOutlets; חוק-4).
// אחים שהוטבעו/סוקטו:
//   • `LipskeyCatalogProduct p` (טיפוס-מוצר גדול) — נסרקים ממנו רק 3 שדות; הוטבע כרשומה
//     `({String productType, String categoryHe, String sku})` (חוק-2, מינימום-הנדרש verbatim).
//   • `kVerifiedSpecs` (מפת-מפרטים גדולה) — קופלה לשקע-נתון `specs` (חוק-3); ערך = רשומה
//     `({List<({String size})> ends})` — רק השדה `ends` ותת-השדה `size` נסרקים במקור.
// טוהר: dart:core בלבד; אפס import, אפס state, אפס טיפוסי-catalog.

/// מספר-המוצאים של מחלק אמיתי: 0 אם אינו-מחלק (‏productType!='מחלק' ∧ categoryHe!='מחלקים'),
/// 0 אם אין-מפרט/פחות-מ-3-קצוות, אחרת ספירת-הגודל-הנפוצה-ביותר אם ≥2 (אחרת 0).
/// verbatim install_engine.dart:1471-1487 (‏p ⇒ רשומה, kVerifiedSpecs ⇒ שקע specs).
int manifoldOutlets(
  ({String productType, String categoryHe, String sku}) p, {
  required Map<String, ({List<({String size})> ends})> specs,
}) {
  // Only a real distribution manifold ("מחלק") exposes parallel outlets. A tee /
  // מסעף also has 3+ same-size ends but is a single branch off a run, not a
  // multi-outlet manifold — classify by the catalog taxonomy, not raw end-count
  // (e.g. 116565 "מסעף 45° תבריג כפול" has 3×DN50 ends but must NOT be a manifold).
  if (p.productType != 'מחלק' && p.categoryHe != 'מחלקים') return 0;
  final spec = specs[p.sku];
  if (spec == null || spec.ends.length < 3) return 0;
  final counts = <String, int>{};
  for (final e in spec.ends) {
    counts[e.size] = (counts[e.size] ?? 0) + 1;
  }
  final maxc = counts.values.fold(0, (a, b) => a > b ? a : b);
  return maxc >= 2 ? maxc : 0;
}
