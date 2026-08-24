// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _conditionMatches — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/rules_model.dart:401-419 (19 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool _conditionMatches(RuleCondition c, Order order, DateTime now) {
  final v = _fieldValue(c.field, order, now);
  switch (c.op) {
    case '>':
      return v > c.value;
    case '>=':
      return v >= c.value;
    case '<':
      return v < c.value;
    case '<=':
      return v <= c.value;
    case '=':
      return v == c.value;
  }
  return false;
}

/// The numeric value of [field] on [order] (READ-ONLY). `ageDays` is `now-createdAt`
/// in days (a null seed `createdAt` reads 0); `sum`/`items` are the order fields.
