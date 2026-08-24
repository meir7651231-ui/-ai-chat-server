// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · matchConditionField — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/rules_model.dart:201-229 (29 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): matchRuleOp, matchRuleActionId
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String? matchConditionField(String reply) =>
    _matchClosed(kRuleConditionFields, reply);

/// Ground [reply] to a REAL operator, or `null` (drop).
String? matchRuleOp(String reply) => _matchClosed(kRuleOps, reply);

/// Ground [reply] to a REAL action id, or `null` (drop).
String? matchRuleActionId(String reply) => _matchClosed(kRuleActionIds, reply);

// ─── the model ────────────────────────────────────────────────────────────────

/// A single condition: `field <op> value`, every slot from a CLOSED set (§6).
@immutable
class RuleCondition {
  const RuleCondition({
    required this.field,
    required this.op,
    required this.value,
  });

  /// One of [kRuleConditionFields].
  final String field;

  /// One of [kRuleOps].
  final String op;

  /// The numeric threshold (`ageDays > 2`, `sum >= 1000`, …).
  final num value;

