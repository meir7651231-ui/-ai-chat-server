// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _lipskeyCategoryToId — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/domain/seeds/plumbing_trade_seed.dart:91-96 (6 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
Map<String, String> _lipskeyCategoryToId() {
  if (_lipskeyCategoryToIdCache == null) _buildCategoryResolvers();
  return _lipskeyCategoryToIdCache!;
}

/// `SmartProduct.key` → category id (built from the catalog tree, computed once).
