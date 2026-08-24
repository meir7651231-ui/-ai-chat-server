// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · toJson — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/rules_model.dart:230-307 (78 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): fromJson, identical, hash, ruleActionIsMutating
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  Map<String, dynamic> toJson() =>
      <String, dynamic>{'field': field, 'op': op, 'value': value};

  factory RuleCondition.fromJson(Map<String, dynamic> j) => RuleCondition(
        field: j['field'] as String,
        op: j['op'] as String,
        value: j['value'] as num,
      );

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is RuleCondition &&
          other.field == field &&
          other.op == op &&
          other.value == value;

  @override
  int get hashCode => Object.hash(field, op, value);
}

/// One automation rule: `trigger → condition → action`, every slot CLOSED-SET (§6).
/// Phase-1: READ-ONLY ADVISORY — a rule COUNTS + SURFACES; it never mutates.
@immutable
class Rule {
  const Rule({
    required this.trigger,
    required this.condition,
    required this.action,
  });

  /// One of [kRuleTriggerIds].
  final String trigger;

  final RuleCondition condition;

  /// One of [kRuleActionIds]. A `mutating:true` action is DEFERRED (§4).
  final String action;

  /// True when this rule's action is mutating (deferred behind the confirm-gate).
  bool get isMutating => ruleActionIsMutating(action);

  Map<String, dynamic> toJson() => <String, dynamic>{
        'trigger': trigger,
        'condition': condition.toJson(),
        'action': action,
      };

  factory Rule.fromJson(Map<String, dynamic> j) => Rule(
        trigger: j['trigger'] as String,
        condition:
            RuleCondition.fromJson((j['condition'] as Map).cast<String, dynamic>()),
        action: j['action'] as String,
      );

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Rule &&
          other.trigger == trigger &&
          other.condition == condition &&
          other.action == action;

  @override
  int get hashCode => Object.hash(trigger, condition, action);
}

// ─── parseRule — the TOTAL parser (mirror of `parseConfigEdit`) ────────────────

/// Parse + VALIDATE a rules reply into a trusted [Rule], or `null` (drop). TOTAL:
/// any failure — non-JSON, malformed, an invented trigger / condition-field / op /
/// action, a non-numeric value — yields `null`, NEVER a throw and NEVER an
/// un-grounded rule. Mirrors `parseConfigEdit` (edit_intent.dart:117): brace-extract
/// the outermost `{`…`}`, `jsonDecode` inside a `try`, validate EVERY token against
/// its closed set via a matcher (null → drop), terminal `catch (_) → null`.
///
/// The model NAMES closed tokens; this Dart grounds them — the anti-hallucination
/// seam for the rules path (the same guarantee the config editor gives).
