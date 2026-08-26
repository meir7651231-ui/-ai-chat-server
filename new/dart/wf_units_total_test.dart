// בדיקת-חוזה · wfUnitsTotal — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/wf_units_total_test.dart
import 'wf_units_total.dart';

WfName _u(int? units) => WfName(id: 'i', name: 'n', units: units);

void _eq(int got, int want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  _eq(wfUnitsTotal(const WfCase()), 0, '1 default empty');                         n++;
  _eq(wfUnitsTotal(WfCase(names: [_u(3)])), 3, '2 single');                        n++;
  _eq(wfUnitsTotal(WfCase(names: [_u(3), _u(5)])), 8, '3 sum');                    n++;
  _eq(wfUnitsTotal(WfCase(names: [_u(3), _u(null), _u(5)])), 8, '4 null=0');       n++;
  _eq(wfUnitsTotal(WfCase(names: [_u(null), _u(null)])), 0, '5 all null');         n++;
  _eq(wfUnitsTotal(WfCase(names: [_u(0), _u(0), _u(7)])), 7, '6 zeros + seven');   n++;

  assert(wfUnitsTotal(WfCase(names: [_u(3), _u(5)])) == 8, 'assert-live guard');

  print('OK wfUnitsTotal: $n asserts passed');
}
