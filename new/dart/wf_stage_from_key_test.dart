// בדיקת-חוזה · wfStageFromKey — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/wf_stage_from_key_test.dart
import 'wf_stage_from_key.dart';

void _eq(WfStage? got, WfStage? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  _eq(wfStageFromKey('intake'), WfStage.intake, '1 intake');       n++;
  _eq(wfStageFromKey('prep'), WfStage.prep, '2 prep');             n++;
  _eq(wfStageFromKey('ready'), WfStage.ready, '3 ready');          n++;
  _eq(wfStageFromKey('dispatch'), WfStage.dispatch, '4 dispatch'); n++;
  _eq(wfStageFromKey('done'), WfStage.done, '5 done');             n++;

  // עדשה-עוינת: מפתח לא-מוכר ⇒ null.
  _eq(wfStageFromKey(''), null, '6 empty');            n++;
  _eq(wfStageFromKey('INTAKE'), null, '7 uppercase');  n++;
  _eq(wfStageFromKey(' intake'), null, '8 leading ws'); n++;
  _eq(wfStageFromKey('foo'), null, '9 unknown');       n++;

  assert(wfStageFromKey('intake') == WfStage.intake, 'assert-live guard');

  print('OK wfStageFromKey: $n asserts passed');
}
