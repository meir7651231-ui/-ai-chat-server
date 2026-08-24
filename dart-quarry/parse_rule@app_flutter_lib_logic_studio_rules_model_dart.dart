// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · parseRule — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/rules_model.dart:308-343 (36 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): lastIndexOf, substring, jsonDecode, toString, matchTriggerId, matchRuleActionId
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
Rule? parseRule(String raw) {
  final text = raw.trim();
  // Brace-extract the outermost object (a rule is a single JSON object).
  final start = text.indexOf('{');
  if (start < 0) return null; // no JSON at all → prose.
  final end = text.lastIndexOf('}');
  if (end <= start) return null; // opened, never closed → drop.
  final candidate = text.substring(start, end + 1);
  try {
    final decoded = jsonDecode(candidate);
    if (decoded is! Map) return null;
    final m = decoded.map((k, v) => MapEntry(k.toString(), v));

    // TOKEN 1 — trigger must be a REAL closed-set id, else drop.
    final trigger = matchTriggerId((m['trigger'] ?? '').toString());
    if (trigger == null) return null;

    // TOKEN 2 — action must be a REAL closed-set id, else drop. (A mutating action
    // is legal here — it is DEFERRED at execution, not dropped at parse.)
    final action = matchRuleActionId((m['action'] ?? '').toString());
    if (action == null) return null;

    // TOKEN 3/4/5 — the condition (field · op · value), all-or-nothing.
    final condition = _validateCondition(m['condition']);
    if (condition == null) return null;

    return Rule(trigger: trigger, condition: condition, action: action);
  } catch (_) {
    // Malformed / non-JSON → drop, NEVER throw (parseConfigEdit's terminal catch).
    return null;
  }
}

/// Validate ONE condition entry against the closed sets, returning the RESOLVED
/// condition or `null` (drop). All-or-nothing: an invented field, an invented op,
/// or a non-numeric value drops the whole rule.
