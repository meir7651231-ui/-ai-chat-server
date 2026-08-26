// בדיקת-חוזה · wfAdvanceLabel — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/wf_advance_label_test.dart
import 'wf_advance_label.dart';

// שקע-wfStageLabel: מחזיר את התווית הניטרלית פר-שלב (verbatim fallback-map).
String _label(Object? cfg, WfStage s) => switch (s) {
      WfStage.intake => 'חדש',
      WfStage.prep => 'בהכנה',
      WfStage.ready => 'מוכן',
      WfStage.dispatch => 'מסירה',
      WfStage.done => 'הושלם',
    };

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;
  const cfg = <String, String>{};

  _eq(wfAdvanceLabel(cfg, const WfCase(stage: WfStage.intake), wfStageLabel: _label),
      'בהכנה ←', '1 intake'); n++;
  _eq(wfAdvanceLabel(cfg, const WfCase(stage: WfStage.prep), wfStageLabel: _label),
      '✓ אישור — בהכנה', '2 prep'); n++;
  _eq(wfAdvanceLabel(cfg, const WfCase(stage: WfStage.ready), wfStageLabel: _label),
      'מסירה ←', '3 ready'); n++;
  _eq(wfAdvanceLabel(cfg, const WfCase(stage: WfStage.dispatch, dispatchPushed: false), wfStageLabel: _label),
      '📞 דחיפה ללוח', '4 dispatch not pushed'); n++;
  _eq(wfAdvanceLabel(cfg, const WfCase(stage: WfStage.dispatch, dispatchPushed: true), wfStageLabel: _label),
      '✓ הושלם', '5 dispatch pushed'); n++;
  _eq(wfAdvanceLabel(cfg, const WfCase(stage: WfStage.done), wfStageLabel: _label),
      '', '6 done empty'); n++;

  assert(
      wfAdvanceLabel(cfg, const WfCase(stage: WfStage.done), wfStageLabel: _label) == '',
      'assert-live guard');

  print('OK wfAdvanceLabel: $n asserts passed');
}
