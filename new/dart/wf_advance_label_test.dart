import '../dart-data/wf_advance_label-terms.dart';
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

  _eq(wfAdvanceLabel(cfg, const WfCase(stage: WfStage.intake), wfStageLabel: _label, term: (k)=>kTerms[k]!),
      'בהכנה ←', '1 intake'); n++;
  _eq(wfAdvanceLabel(cfg, const WfCase(stage: WfStage.prep), wfStageLabel: _label, term: (k)=>kTerms[k]!),
      '✓ אישור — בהכנה', '2 prep'); n++;
  _eq(wfAdvanceLabel(cfg, const WfCase(stage: WfStage.ready), wfStageLabel: _label, term: (k)=>kTerms[k]!),
      'מסירה ←', '3 ready'); n++;
  _eq(wfAdvanceLabel(cfg, const WfCase(stage: WfStage.dispatch, dispatchPushed: false), wfStageLabel: _label, term: (k)=>kTerms[k]!),
      '📞 דחיפה ללוח', '4 dispatch not pushed'); n++;
  _eq(wfAdvanceLabel(cfg, const WfCase(stage: WfStage.dispatch, dispatchPushed: true), wfStageLabel: _label, term: (k)=>kTerms[k]!),
      '✓ הושלם', '5 dispatch pushed'); n++;
  _eq(wfAdvanceLabel(cfg, const WfCase(stage: WfStage.done), wfStageLabel: _label, term: (k)=>kTerms[k]!),
      '', '6 done empty'); n++;

  assert(
      wfAdvanceLabel(cfg, const WfCase(stage: WfStage.done), wfStageLabel: _label, term: (k)=>kTerms[k]!) == '',
      'assert-live guard');

  print('OK wfAdvanceLabel: $n asserts passed');
}
