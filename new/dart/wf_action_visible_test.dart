// בדיקת-חוזה · wfActionVisible — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/wf_action_visible_test.dart
import 'wf_action_visible.dart';

const _named = WfName(id: 'a', name: 'x');
const _withUnits = WfName(id: 'b', name: 'y', units: 3);

void _eq(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  _eq(wfActionVisible(const WfCase(stage: WfStage.done, names: [_named])), false, '1 done'); n++;
  _eq(wfActionVisible(const WfCase(stage: WfStage.intake)), false, '2 intake empty');        n++;
  _eq(wfActionVisible(const WfCase(stage: WfStage.intake, names: [_named])), true, '3 intake named'); n++;
  _eq(wfActionVisible(const WfCase(stage: WfStage.ready)), false, '4 ready empty');           n++;
  _eq(wfActionVisible(const WfCase(stage: WfStage.ready, names: [_named])), false, '5 ready no units'); n++;
  _eq(wfActionVisible(const WfCase(stage: WfStage.ready, names: [_named, _withUnits])), true, '6 ready has units'); n++;
  _eq(wfActionVisible(const WfCase(stage: WfStage.prep)), true, '7 prep');                    n++;
  _eq(wfActionVisible(const WfCase(stage: WfStage.dispatch)), true, '8 dispatch');            n++;

  assert(wfActionVisible(const WfCase(stage: WfStage.done)) == false, 'assert-live guard');

  print('OK wfActionVisible: $n asserts passed');
}
