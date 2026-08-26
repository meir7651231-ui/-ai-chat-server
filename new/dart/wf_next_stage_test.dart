// בדיקת-חוזה · wfNextStage — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/wf_next_stage_test.dart
import 'wf_next_stage.dart';

void _eq(WfStage? got, WfStage? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  _eq(wfNextStage(WfStage.intake), WfStage.prep, '1 intake->prep');        n++;
  _eq(wfNextStage(WfStage.prep), WfStage.ready, '2 prep->ready');          n++;
  _eq(wfNextStage(WfStage.ready), WfStage.dispatch, '3 ready->dispatch');  n++;
  _eq(wfNextStage(WfStage.dispatch), WfStage.done, '4 dispatch->done');    n++;
  _eq(wfNextStage(WfStage.done), null, '5 done->null');                    n++;

  // שרשור הרצף: מ-intake ועד done ב-4 צעדים, ואז null.
  WfStage? cur = WfStage.intake;
  var steps = 0;
  while (cur != null) {
    final nx = wfNextStage(cur);
    if (nx == null) break;
    cur = nx;
    steps++;
    if (steps > 10) throw StateError('FAIL: sequence did not terminate');
  }
  if (steps != 4) throw StateError('FAIL chain: expected 4 steps got $steps');
  if (cur != WfStage.done) throw StateError('FAIL chain: ended at $cur');
  n++;

  assert(wfNextStage(WfStage.done) == null, 'assert-live guard');

  print('OK wfNextStage: $n asserts passed');
}
