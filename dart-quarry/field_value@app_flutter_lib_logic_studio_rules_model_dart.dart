// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _fieldValue — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/rules_model.dart:420-435 (16 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): difference
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
num _fieldValue(String field, Order order, DateTime now) {
  switch (field) {
    case kFieldAgeDays:
      final created = order.createdAt;
      return created == null ? 0 : now.difference(created).inDays;
    case kFieldSum:
      return order.sum;
    case kFieldItems:
      return order.items;
  }
  return 0;
}

// ─── Hebrew helpers for the screen (§2/§9) ────────────────────────────────────

/// The Hebrew label for a trigger id (or the raw id if unknown).
