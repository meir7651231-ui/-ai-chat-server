// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _isPipeProductE — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:1198-1207 (10 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool _isPipeProductE(LipskeyCatalogProduct p) {
  final t = p.productType ?? '';
  return t == 'צינור' || t == 'צנרת' || t == 'גמיש' || t == 'מאריך';
}

const _kDrainageFamily = {'PVC', 'PP', 'רב-שכבתי', 'ceramic'};

/// A real catalog pipe whose compression end matches [dn] and whose material is
/// compatible with [mats]. Null when no catalog pipe fits (e.g. supply lines —
/// HDPE/PEX pipe is bought by the metre, not stocked as a SKU).
