// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · ruleSummaryHe — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/rules_model.dart:460-469 (10 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): triggerLabelHe, fieldLabelHe, actionLabelHe, advisoryHe
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String ruleSummaryHe(Rule r) {
  final op = kRuleOpLabelsHe[r.condition.op] ?? r.condition.op;
  return '${triggerLabelHe(r.trigger)} · '
      '${fieldLabelHe(r.condition.field)} $op ${r.condition.value} · '
      '${actionLabelHe(r.action)}';
}

/// The §9 advisory line: "כרגע N הזמנות תואמות".
String advisoryHe(int matches) => 'כרגע $matches הזמנות תואמות';

