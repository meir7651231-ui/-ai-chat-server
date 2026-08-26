// ⚛️ אטום-Dart (דרגת-חוזה) · estimatePrice
// מוצא: buildsmart/app_flutter/lib/logic/price_estimate.dart:90-109 (‏estimatePrice; חוק-4).
// טוהר: פונקציית top-level עצמאית, אפס import. שני שכנים הוטבעו verbatim (חוק-1):
//        (1) ה-const-האחות `_categoryPriceILS` (‏price_estimate.dart:12-72) — טבלת-דאטה,
//            הוטבעה כ-const פרטי `_` verbatim (grep יחיד — הטיוטה חסרת-ערכים).
//        (2) הטיפוס-השכן-הקטן `PriceEstimate` (‏price_estimate.dart:74-85) — הוטבע inline
//            verbatim (מחלקה 3-שדות).
//        הקלט `List<LipskeyCatalogProduct>` הפך גנרי `List<T>`, והשדה `p.categoryHe` הפך
//        שקע-ריאדר `categoryHe` (חוק-3/6: טיפוס-שכן-גדול לא נגרר).
//
// קלט:  items      — רשימת-מוצרים (גנרית T).
//       categoryHe — שקע: T ⇒ שם-קטגוריה (במקור p.categoryHe).
// פלט:  PriceEstimate(totalILS, itemCount, lowConfidence).

/// Sum approximate NIS price per catalog category. Verbatim behaviour of
/// price_estimate.dart:90-109 with the price table inlined and `categoryHe` injected.
class PriceEstimate {
  const PriceEstimate({
    required this.totalILS,
    required this.itemCount,
    required this.lowConfidence,
  });
  final int totalILS;
  final int itemCount;

  /// True when more than half the items had no category match — total is a
  /// very rough lower bound and the UI should label it accordingly.
  final bool lowConfidence;
}

// price_estimate.dart:12-72 — הוטבע verbatim (grep יחיד; הטיוטה חסרת-ערכים).
const Map<String, int> _categoryPriceILS = {
  // Brass / supply fittings (small, threaded)
  'אביזרי נחושת': 18,
  'אביזרי תבריג': 15,
  'אביזרי ברזים': 12,
  // HDPE / NTM compression — plastic, sized by DN
  'מחברי HDPE': 14,
  'מחברי NTM': 20,
  // Drainage pipes & sockets
  'צינורות אפורות': 28,
  'צינורות PP': 42,
  'צינורות גמישים': 55,
  'צינורות רב שכבתי': 65,
  'אביזרי שקע-תקע': 22,
  'ברכיים': 18,
  'סיפונים': 35,
  'מסעפים וחיבורי אסלה': 45,
  // Valves
  'ברזי מעבר': 65,
  'ברזי ניל': 45,
  'ברזי גן': 55,
  'ברזי דלי': 35,
  // Faucets — finished products
  'ברזי כיור': 280,
  'ברזי מטבח': 420,
  'ברזי קיר': 190,
  'ברזי אמבטיה': 520,
  'ברזי מקלחת': 390,
  // Shower system
  'ראשי מקלחת': 180,
  'מזלפי יד': 110,
  'זרועות דוש': 45,
  'צינורות מקלחת': 40,
  'אביזרי מקלחת': 28,
  'מערכות אמבטיה': 950,
  'ערכות רחצה': 1200,
  // Toilets & cisterns
  'אסלות וכיורים': 480,
  'מושבי אסלה': 150,
  'אביזרי אסלה': 55,
  'מערכות שטיפה': 320,
  'מנגנונים': 210,
  'חלקים סניטריים': 85,
  // Drainage points
  'מחסומים גלויים': 70,
  'מחסומי רצפה': 110,
  'מאספי רצפה': 160,
  'מאספים וקולטים': 140,
  'תעלות ניקוז': 250,
  'מכסים ורשתות': 85,
  'כיסויים': 50,
  'ניקוז גג': 190,
  'אביזרי ביוב': 65,
  'זקיף אסלה': 35,
  // Manifolds & water points
  'מחלקים': 480,
  'נקודות מים': 120,
  'אטמים ופקקים': 8,
  // Catch-all / Hot-water synthetic SKUs
  'מתאמי תבריג': 14,
};

PriceEstimate estimatePrice<T>(
  List<T> items, {
  required String Function(T) categoryHe,
}) {
  if (items.isEmpty) {
    return const PriceEstimate(totalILS: 0, itemCount: 0, lowConfidence: true);
  }
  var total = 0;
  var matched = 0;
  for (final p in items) {
    final v = _categoryPriceILS[categoryHe(p)];
    if (v != null) {
      total += v;
      matched++;
    } else {
      total += 25; // generic fallback so unmatched items still register
    }
  }
  final lowConf = matched < items.length / 2;
  return PriceEstimate(
      totalILS: total, itemCount: items.length, lowConfidence: lowConf);
}
