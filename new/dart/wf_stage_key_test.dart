// בדיקת-חוזה · wfStageKey — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/wf_stage_key_test.dart
import 'wf_stage_key.dart';

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  _eq(wfStageKey(WfStage.intake), 'intake', '1 intake');       n++;
  _eq(wfStageKey(WfStage.prep), 'prep', '2 prep');             n++;
  _eq(wfStageKey(WfStage.ready), 'ready', '3 ready');          n++;
  _eq(wfStageKey(WfStage.dispatch), 'dispatch', '4 dispatch'); n++;
  _eq(wfStageKey(WfStage.done), 'done', '5 done');             n++;

  // כיסוי כולל: כל ערך-enum ממופה למחרוזת לא-ריקה ייחודית.
  final seen = <String>{};
  for (final s in WfStage.values) {
    final k = wfStageKey(s);
    if (k.isEmpty) throw StateError('FAIL: empty key for $s');
    if (!seen.add(k)) throw StateError('FAIL: duplicate key "$k"');
    n++;
  }

  assert(wfStageKey(WfStage.intake) == 'intake', 'assert-live guard');

  print('OK wfStageKey: $n asserts passed');
}
