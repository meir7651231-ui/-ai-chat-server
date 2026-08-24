// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _validateCondition — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/rules_model.dart:344-384 (41 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): toString, matchConditionField, matchRuleOp, tryParse, evalRuleAdvisory
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
RuleCondition? _validateCondition(Object? raw) {
  if (raw is! Map) return null;
  final c = raw.map((k, v) => MapEntry(k.toString(), v));
  final field = matchConditionField((c['field'] ?? '').toString());
  if (field == null) return null;
  final op = matchRuleOp((c['op'] ?? '').toString());
  if (op == null) return null;
  final rawValue = c['value'];
  final value =
      rawValue is num ? rawValue : num.tryParse((rawValue ?? '').toString());
  if (value == null) return null; // a non-numeric threshold → drop.
  return RuleCondition(field: field, op: op, value: value);
}

// ─── evalRuleAdvisory — the PURE READ-ONLY count (§9 · the invariant) ──────────

/// COUNT how many of [orders] currently match [rule] (trigger ∧ condition). PURE +
/// READ-ONLY (§4/§8/§9): it takes an IMMUTABLE list, reads fields, returns an `int`
/// — it holds NO notifier, calls NO setter, mutates NOTHING. The action is
/// IRRELEVANT to the count (even a mutating action only COUNTS in Phase-1 — the
/// mutation is deferred). [analytics] is reserved for future engine-level fields
/// (store/catalog conditions); [now] is injectable so tests are deterministic.
int evalRuleAdvisory(
  Rule rule, {
  required List<Order> orders,
  ManagerAnalytics? analytics,
  DateTime? now,
}) {
  final ref = now ?? DateTime.now();
  var count = 0;
  for (final o in orders) {
    if (_triggerMatches(rule.trigger, o) &&
        _conditionMatches(rule.condition, o, ref)) {
      count++;
    }
  }
  return count;
}

/// The base predicate for [trigger] over one [order]. An unknown trigger → false
/// (fail-closed). READ-ONLY — reads `stage` / `isOpen`, mutates nothing.
