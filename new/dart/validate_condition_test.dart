// בדיקת-חוזה · validateCondition — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/validate_condition_test.dart
import 'validate_condition.dart';

typedef _Cond = ({String field, String op, num value});

String? _field(String s) => const {'age', 'total'}.contains(s) ? s : null;
String? _op(String s) => const {'gt', 'lt'}.contains(s) ? s : null;
_Cond _make(String f, String o, num v) => (field: f, op: o, value: v);

_Cond? _run(Object? raw) => validateCondition<String, String, _Cond>(
      raw,
      matchConditionField: _field,
      matchRuleOp: _op,
      makeCondition: _make,
    );

void _null(Object? raw, String label) {
  final r = _run(raw);
  if (r != null) throw StateError('FAIL [$label]: got=$r want=null');
}

void main() {
  var n = 0;

  _null('x', '1 not-map'); n++;
  _null(null, '2 null'); n++;
  _null({'op': 'gt', 'value': 5}, '3 no-field'); n++;
  _null({'field': 'zzz', 'op': 'gt', 'value': 5}, '4 bad-field'); n++;
  _null({'field': 'age', 'value': 5}, '5 no-op'); n++;

  final r6 = _run({'field': 'age', 'op': 'gt', 'value': 5});
  if (r6 == null || r6.field != 'age' || r6.op != 'gt' || r6.value != 5) {
    throw StateError('FAIL [6]: $r6');
  }
  n++;

  final r7 = _run({'field': 'age', 'op': 'gt', 'value': '7'});
  if (r7 == null || r7.value != 7) throw StateError('FAIL [7 parse]: $r7'); n++;

  _null({'field': 'age', 'op': 'gt', 'value': 'abc'}, '8 non-numeric'); n++;
  _null({'field': 'age', 'op': 'gt'}, '9 no-value'); n++;

  final r10 = _run({'field': 'total', 'op': 'lt', 'value': 3.5});
  if (r10 == null || r10.value != 3.5) throw StateError('FAIL [10 double]: $r10'); n++;

  assert(_run({'field': 'age', 'op': 'gt', 'value': 5}) != null, 'assert-live guard');

  print('OK validateCondition: $n asserts passed');
}
