// בדיקת-אטום · ruleToJson — מוכיחה בדיוק את דוגמאות rule_to_json.contract.md.
// DoD (דיבר-12): dart run --enable-asserts new/dart/rule_to_json_test.dart
//                ⇒ exit 0 + "OK ruleToJson: N asserts passed".
// מייבאת אך-ורק את האטום-שלה (חוק-4).
import 'rule_to_json.dart';

// השוואה-עמוקה מקומית (רתמת-בדיקה, לא אטום-שכן; תקדים connection_schema_to_json).
bool _deepEq(Object? a, Object? b) {
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k) || !_deepEq(a[k], b[k])) return false;
    }
    return true;
  }
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!_deepEq(a[i], b[i])) return false;
    }
    return true;
  }
  return a == b;
}

// סדר-מפתחות = סדר-המקור (מפות-מילוליות ב-Dart משמרות סדר-הכנסה).
bool _keyOrder(Map<String, dynamic> m, List<String> expected) {
  final ks = m.keys.toList();
  if (ks.length != expected.length) return false;
  for (var i = 0; i < ks.length; i++) {
    if (ks[i] != expected[i]) return false;
  }
  return true;
}

bool _throws(void Function() f) {
  try {
    f();
    return false;
  } catch (_) {
    return true;
  }
}

var _n = 0;
void _ok(bool cond, String what) {
  assert(cond, 'FAIL: $what');
  _n++;
}

void main() {
  // ── #1 · RuleCondition.toJson (:230-231) — בדיוק 3 מפתחות בסדר-המקור ───────
  const c1 = RuleCondition(field: 'ageDays', op: '>', value: 2);
  _ok(_deepEq(c1.toJson(), {'field': 'ageDays', 'op': '>', 'value': 2}),
      '#1 RuleCondition.toJson');
  _ok(_keyOrder(c1.toJson(), ['field', 'op', 'value']), '#1 key order');
  _ok(c1.toJson()['value'] is int, '#1 int value נשאר int');

  // ── #2 · double נשמר (value הוא num — :227-228) ────────────────────────────
  const c2 = RuleCondition(field: 'sum', op: '>=', value: 1000.5);
  _ok(_deepEq(c2.toJson(), {'field': 'sum', 'op': '>=', 'value': 1000.5}),
      '#2 double value');
  _ok(c2.toJson()['value'] is double, '#2 double נשאר double');

  // ── #3 · Rule.toJson (:272-276) — 3 מפתחות, condition מקונן (:274) ─────────
  const r3 = Rule(trigger: 'order.stuck', condition: c1, action: 'notify.manager');
  _ok(
      _deepEq(r3.toJson(), {
        'trigger': 'order.stuck',
        'condition': {'field': 'ageDays', 'op': '>', 'value': 2},
        'action': 'notify.manager',
      }),
      '#3 Rule.toJson קינון-condition');
  _ok(_keyOrder(r3.toJson(), ['trigger', 'condition', 'action']),
      '#3 key order');

  // ── #4 · RuleCondition round-trip (:233-237) ───────────────────────────────
  final c4 = RuleCondition.fromJson(c1.toJson());
  _ok(c4 == c1, '#4 fromJson(toJson(c)) == c');
  _ok(RuleCondition.fromJson(c2.toJson()) == c2, '#4 round-trip double');

  // ── #5 · Rule round-trip (:278-283) — גם condition כ-Map<dynamic,dynamic> ──
  final r5 = Rule.fromJson(r3.toJson());
  _ok(r5 == r3, '#5 fromJson(toJson(r)) == r');
  final dynMap = <String, dynamic>{
    'trigger': 'order.stuck',
    'condition': <dynamic, dynamic>{'field': 'ageDays', 'op': '>', 'value': 2},
    'action': 'notify.manager',
  };
  _ok(Rule.fromJson(dynMap) == r3,
      '#5 condition כ-Map<dynamic,dynamic> עובר cast (:281)');

  // ── #6 · fromJson קשיח — value חסר ⇒ זורק (cast verbatim :236) ─────────────
  _ok(_throws(() => RuleCondition.fromJson({'field': 'sum', 'op': '<'})),
      '#6 value חסר ⇒ throw');
  _ok(
      _throws(() =>
          RuleCondition.fromJson({'field': 'sum', 'op': '<', 'value': 'טקסט'})),
      '#6 value לא-מספרי ⇒ throw');

  // ── #7 · Rule.fromJson — condition לא-Map ⇒ זורק (:281) ────────────────────
  _ok(
      _throws(() => Rule.fromJson(
          {'trigger': 't', 'condition': 'לא-מפה', 'action': 'a'})),
      '#7 condition לא-Map ⇒ throw');

  // ── #8 · שוויון-ערכי + hashCode (:239-248, :285-294) ──────────────────────
  const c8 = RuleCondition(field: 'ageDays', op: '>', value: 2);
  _ok(c8 == c1 && c8.hashCode == c1.hashCode, '#8 שווי-שדות ⇒ == + hash שווה');
  const c8b = RuleCondition(field: 'ageDays', op: '>=', value: 2);
  _ok(c8 != c8b, '#8 שינוי-op ⇒ !=');
  const r8 = Rule(trigger: 'order.stuck', condition: c8, action: 'notify.manager');
  _ok(r8 == r3 && r8.hashCode == r3.hashCode, '#8 Rule שווי-שדות ⇒ ==');
  const r8b =
      Rule(trigger: 'order.new', condition: c8, action: 'notify.manager');
  _ok(r8 != r8b, '#8 שינוי-trigger ⇒ !=');
  _ok(identical(r3, r3) && r3 == r3, '#8 identical קיצור-דרך');

  print('OK ruleToJson: $_n asserts passed');
}
