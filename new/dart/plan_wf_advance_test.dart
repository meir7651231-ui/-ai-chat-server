import '../dart-data/plan_wf_advance-terms.dart' as td_plan_wf_advance;
// בדיקת-חוזה · planWfAdvance — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/plan_wf_advance_test.dart
// הדוגמאות = טבלת-החוזה (plan_wf_advance.contract.md), מעוגנות ל-workflow_engine.dart:192-233.
import 'plan_wf_advance.dart';

// ── שקעי-בדיקה: ה-fallbacks הניטרליים של המקור (workflow_engine.dart:52-66) ──
String _feat(Object? cfg) => 'מעקב טיפול'; // :64
String _item(Object? cfg) => 'פריט'; // :65
String _unit(Object? cfg) => 'כמות'; // :66
String _stage(Object? cfg, WfStage s) => switch (s) {
      WfStage.intake => 'חדש',
      WfStage.prep => 'בהכנה',
      WfStage.ready => 'מוכן',
      WfStage.dispatch => 'מסירה',
      WfStage.done => 'הושלם',
    }; // :52-58

// ה-guard המקורי (workflow_engine.dart:149-161) — השקע actionVisible.
bool _visible(WfCase a) {
  switch (a.stage) {
    case WfStage.done:
      return false;
    case WfStage.intake:
      return a.names.isNotEmpty;
    case WfStage.ready:
      return a.names.any((n) => n.units != null);
    case WfStage.prep:
    case WfStage.dispatch:
      return true;
  }
}

// סך-יחידות (workflow_engine.dart:136-137) — השקע unitsTotal.
int _total(WfCase a) => a.names.fold(0, (t, x) => t + (x.units ?? 0));

WfAdvancePlan? _plan(WfCase a) => planWfAdvance(
      const <String, String>{},
      'דוד',
      a,
      actionVisible: _visible,
      featureLabel: _feat,
      itemLabel: _item,
      unitLabel: _unit,
      stageLabel: _stage,
      unitsTotal: _total,
     term: (k)=>td_plan_wf_advance.kTerms[k]!);

void _eq(Object? got, Object? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  // 1) intake בלי שמות ⇒ null (‏guard).
  _eq(_plan(const WfCase(stage: WfStage.intake)), null, '1 intake empty ⇒ null'); n++;

  // 2) intake עם 2 שמות ⇒ prep + כותרת-ספירה + toast-נרשמו.
  const two = WfCase(stage: WfStage.intake, names: [
    WfName(id: 'a', name: 'ראובן'),
    WfName(id: 'b', name: 'שמעון'),
  ]);
  final p2 = _plan(two)!;
  _eq(p2.patch.stage, WfStage.prep, '2 patch stage'); n++;
  _eq(p2.event!.title, 'מעקב טיפול: בהכנה — דוד (2 פריט)', '2 event title'); n++;
  _eq(p2.event!.done, false, '2 event done'); n++;
  _eq(p2.toast, 'נרשמו 2 — נכנס ללוח: בהכנה', '2 toast'); n++;

  // 3) prep ⇒ ready · event done=true.
  final p3 = _plan(const WfCase(stage: WfStage.prep))!;
  _eq(p3.patch.stage, WfStage.ready, '3 patch stage'); n++;
  _eq(p3.event!.title, 'מעקב טיפול: בהכנה ✓ — דוד', '3 event title'); n++;
  _eq(p3.event!.done, true, '3 event done'); n++;
  _eq(p3.toast, 'אושר — עכשיו: מוכן', '3 toast'); n++;

  // 4) ready עם units 3+4 ⇒ dispatch · הכותרת נושאת את הסך 7.
  const ready = WfCase(stage: WfStage.ready, names: [
    WfName(id: 'a', name: 'ראובן', units: 3),
    WfName(id: 'b', name: 'שמעון', units: 4),
  ]);
  final p4 = _plan(ready)!;
  _eq(p4.patch.stage, WfStage.dispatch, '4 patch stage'); n++;
  _eq(p4.event!.title, 'מעקב טיפול: מסירה — דוד (7 כמות)', '4 event title'); n++;
  _eq(p4.event!.done, false, '4 event done'); n++;
  _eq(p4.toast, 'נרשם — נכנס ללוח: מסירה', '4 toast'); n++;

  // 5) ready בלי אף units ⇒ null (‏guard: ready דורש כמות כלשהי).
  _eq(
      _plan(const WfCase(stage: WfStage.ready, names: [WfName(id: 'a', name: 'ראובן')])),
      null,
      '5 ready no units ⇒ null'); n++;

  // 6) dispatch לחיצה-1 ⇒ dispatchPushed=true, נשאר ב-dispatch.
  final p6 = _plan(const WfCase(stage: WfStage.dispatch))!;
  _eq(p6.patch.dispatchPushed, true, '6 pushed'); n++;
  _eq(p6.patch.stage, WfStage.dispatch, '6 stage stays'); n++;
  _eq(p6.event!.title, 'מעקב טיפול: מסירה — דוד', '6 event title'); n++;
  _eq(p6.event!.done, false, '6 event done'); n++;
  _eq(p6.toast, 'נמסר — נרשם בלוח היומי', '6 toast'); n++;

  // 7) dispatch לחיצה-2 (כבר-נדחף) ⇒ done.
  final p7 = _plan(const WfCase(stage: WfStage.dispatch, dispatchPushed: true))!;
  _eq(p7.patch.stage, WfStage.done, '7 patch stage'); n++;
  _eq(p7.event!.title, 'מעקב טיפול: הושלם — דוד', '7 event title'); n++;
  _eq(p7.event!.done, true, '7 event done'); n++;
  _eq(p7.toast, 'הטיפול הושלם ✓', '7 toast'); n++;

  // 8) done ⇒ null (‏workflow_engine.dart:230-231).
  _eq(_plan(const WfCase(stage: WfStage.done)), null, '8 done ⇒ null'); n++;

  // 9) קצה: ה-patch נבנה ב-copyWith ⇒ שאר שדות-המקרה נשמרים.
  final p9 = _plan(const WfCase(stage: WfStage.prep, note: 'הערה', nextTouch: '2026-08-28'))!;
  _eq(p9.patch.note, 'הערה', '9 note preserved'); n++;
  _eq(p9.patch.nextTouch, '2026-08-28', '9 nextTouch preserved'); n++;

  // 10) קצה: השקע actionVisible מכריע — false ⇒ null גם ב-prep (:193 קודם ל-switch).
  final p10 = planWfAdvance(
    const <String, String>{},
    'דוד',
    const WfCase(stage: WfStage.prep),
    actionVisible: (_) => false,
    featureLabel: _feat,
    itemLabel: _item,
    unitLabel: _unit,
    stageLabel: _stage,
    unitsTotal: _total,
   term: (k)=>td_plan_wf_advance.kTerms[k]!);
  _eq(p10, null, '10 socket guard ⇒ null'); n++;

  assert(_plan(const WfCase(stage: WfStage.done)) == null, 'assert-live guard');

  print('OK planWfAdvance: $n asserts passed');
}
