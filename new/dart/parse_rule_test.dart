// בדיקת-חוזה · parseRule — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/parse_rule_test.dart
import 'parse_rule.dart';

typedef _Cond = ({num v});
typedef _Rule = ({String trigger, _Cond condition, String action});

String? _trigger(String s) =>
    const {'order.new', 'order.stuck'}.contains(s) ? s : null;
String? _action(String s) => s == 'notify.manager' ? s : null;
_Cond? _cond(Object? raw) {
  if (raw is! Map) return null;
  final v = raw['value'];
  final n = v is num ? v : num.tryParse((v ?? '').toString());
  return n == null ? null : (v: n);
}

_Rule _make(String t, _Cond c, String a) => (trigger: t, condition: c, action: a);

_Rule? _run(String raw) => parseRule<String, String, _Cond, _Rule>(
      raw,
      matchTriggerId: _trigger,
      matchRuleActionId: _action,
      validateCondition: _cond,
      makeRule: _make,
    );

void _null(String raw, String label) {
  final r = _run(raw);
  if (r != null) throw StateError('FAIL [$label]: got=$r want=null');
}

void main() {
  var n = 0;

  _null('סתם פרוזה בלי שום דבר', '1 no-brace'); n++;
  _null('טקסט { שנפתח ולא נסגר', '2 unclosed'); n++;
  _null('} הפוך {', '3 reversed'); n++;
  _null('{לא json}', '4 malformed-catch'); n++;
  _null('{"a":1} רעש {"b":2}', '5 two-objects-catch'); n++;
  _null('{"trigger":"order.fake","action":"notify.manager","condition":{"value":2}}',
      '6 invented-trigger'); n++;
  _null('{"action":"notify.manager","condition":{"value":2}}', '7 no-trigger'); n++;
  _null('{"trigger":"order.new","action":"delete.everything","condition":{"value":2}}',
      '8 invented-action'); n++;
  _null('{"trigger":"order.new","action":"notify.manager","condition":{"value":"abc"}}',
      '9 bad-condition'); n++;
  _null('{"trigger":"order.new","action":"notify.manager"}', '10 no-condition'); n++;

  // 11 — הצלחה מלאה + פרוזה סביב ה-JSON נחתכת (brace-extract, :311-315).
  final r11 = _run(
      'בטח! {"trigger":"order.stuck","condition":{"value":2},"action":"notify.manager"} בוצע');
  if (r11 == null ||
      r11.trigger != 'order.stuck' ||
      r11.condition.v != 2 ||
      r11.action != 'notify.manager') {
    throw StateError('FAIL [11 success]: $r11');
  }
  n++;

  _null('{"trigger":5,"condition":{"value":2},"action":"notify.manager"}',
      '12 non-string-trigger'); n++;

  // 13 — ערך-תנאי מחרוזתי מספרי עובר דרך השקע (החוזה של validateCondition).
  final r13 = _run(
      '{"trigger":"order.new","condition":{"value":"7"},"action":"notify.manager"}');
  if (r13 == null || r13.condition.v != 7) throw StateError('FAIL [13]: $r13');
  n++;

  assert(_run('{"trigger":"order.new","condition":{"value":1},"action":"notify.manager"}') != null,
      'assert-live guard');

  print('OK parseRule: $n asserts passed');
}
