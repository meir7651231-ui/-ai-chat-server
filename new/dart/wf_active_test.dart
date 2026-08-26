// בדיקת-חוזה · wfActive — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/wf_active_test.dart
import 'wf_active.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  _eq(wfActive(null), false, '1 null');                                              n++;
  _eq(wfActive(const WfCase()), false, '2 default inactive');                        n++;
  _eq(wfActive(const WfCase(stage: WfStage.prep)), true, '3 not-intake');            n++;
  _eq(wfActive(const WfCase(names: [WfName(id: 'a', name: 'x')])), true, '4 names'); n++;
  _eq(wfActive(const WfCase(lastTouch: '2026-08-01')), true, '5 lastTouch');         n++;
  _eq(wfActive(const WfCase(log: [WfLog(date: '2026-08-01', units: 1)])), true, '6 log'); n++;
  _eq(wfActive(const WfCase(stage: WfStage.done)), true, '7 done');                  n++;

  assert(wfActive(const WfCase()) == false, 'assert-live guard');

  print('OK wfActive: $n asserts passed');
}
