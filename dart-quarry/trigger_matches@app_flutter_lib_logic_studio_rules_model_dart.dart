// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _triggerMatches — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/rules_model.dart:385-400 (16 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool _triggerMatches(String trigger, Order order) {
  switch (trigger) {
    case kTriggerOrderNew:
      return order.stage == 'new';
    case kTriggerOrderStuck:
      return order.isOpen; // "stuck" = open (the ageDays condition refines it).
    case kTriggerOrderOpen:
      return order.isOpen;
    case kTriggerOrderDelivered:
      return order.stage == 'delivered';
  }
  return false;
}

/// Evaluate a condition [c] against one [order]. READ-ONLY. An unknown field / op
/// reads a 0 value / returns false (fail-closed).
