// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · estimatePrice — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/price_estimate.dart:90-109 (20 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
PriceEstimate estimatePrice(List<LipskeyCatalogProduct> items) {
  if (items.isEmpty) {
    return const PriceEstimate(totalILS: 0, itemCount: 0, lowConfidence: true);
  }
  var total = 0;
  var matched = 0;
  for (final p in items) {
    final v = _categoryPriceILS[p.categoryHe];
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

