// בדיקת-חוזה · wfStageLabel — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/wf_stage_label_test.dart
import 'wf_stage_label.dart';

// שקע-wfStageKey אמיתי (verbatim מיפוי-המקור) לצורך הבדיקה.
String _key(WfStage s) => switch (s) {
      WfStage.intake => 'intake',
      WfStage.prep => 'prep',
      WfStage.ready => 'ready',
      WfStage.dispatch => 'dispatch',
      WfStage.done => 'done',
    };

// שקע-termOf שחושף את שני הארגומנטים (key שנבנה + fallback).
String _echo(Object? cfg, String key, String fallback) => 'K:$key|F:$fallback';
// שקע-termOf שתמיד מחזיר את ה-fallback (כמו ארגון ללא-מונח).
String _fallbackOnly(Object? cfg, String key, String fallback) => fallback;

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;
  const cfg = <String, String>{}; // cfg שקוף — אינו בשימוש פנימי.

  // key שנבנה + fallback (echo).
  _eq(wfStageLabel(cfg, WfStage.intake, termOf: _echo, wfStageKey: _key),
      'K:workflow.stage.intake|F:חדש', '1 intake echo'); n++;
  _eq(wfStageLabel(cfg, WfStage.prep, termOf: _echo, wfStageKey: _key),
      'K:workflow.stage.prep|F:בהכנה', '2 prep echo'); n++;
  _eq(wfStageLabel(cfg, WfStage.dispatch, termOf: _echo, wfStageKey: _key),
      'K:workflow.stage.dispatch|F:מסירה', '3 dispatch echo'); n++;

  // מסלול-fallback: termOf שמחזיר את הערך הניטרלי.
  _eq(wfStageLabel(cfg, WfStage.ready, termOf: _fallbackOnly, wfStageKey: _key),
      'מוכן', '4 ready fallback'); n++;
  _eq(wfStageLabel(cfg, WfStage.done, termOf: _fallbackOnly, wfStageKey: _key),
      'הושלם', '5 done fallback'); n++;

  // מונח-ארגון קבוע.
  _eq(wfStageLabel(cfg, WfStage.intake, termOf: (c, k, f) => 'X', wfStageKey: _key),
      'X', '6 org term'); n++;

  assert(
      wfStageLabel(cfg, WfStage.intake, termOf: _fallbackOnly, wfStageKey: _key) == 'חדש',
      'assert-live guard');

  print('OK wfStageLabel: $n asserts passed');
}
