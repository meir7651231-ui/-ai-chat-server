// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _minBoreMmOf — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:852-874 (23 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): tryParse, replaceAll, toDouble
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
double? _minBoreMmOf(LipskeyCatalogProduct p) {
  final spec = kVerifiedSpecs[p.sku];
  if (spec == null) return null;
  double? min;
  for (final e in spec.ends) {
    double? mm;
    switch (e.type) {
      case EndType.hdpeCompression:
      case EndType.pexPress:
      case EndType.copperPress:
      case EndType.drainOpening:
        mm = double.tryParse(e.size);
      case EndType.bspMale:
      case EndType.bspFemale:
        final v = kBspInchToMm[e.size.replaceAll('"', '').trim()];
        mm = v?.toDouble();
    }
    if (mm == null) continue;
    if (min == null || mm < min) min = mm;
  }
  return min;
}

