// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · planWfAdvance — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/workflow_engine.dart:192-304 (113 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): wfActionVisible, wfFeatureLabel, wfItemLabel, wfUnitLabel, copyWith, wfStageLabel, wfUnitsTotal, wfRevertPatch, wfStageIndex, wfNormName, normName
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
WfAdvancePlan? planWfAdvance(OrgConfig cfg, String name, WfCase a) {
  if (!wfActionVisible(a)) return null;
  final feat = wfFeatureLabel(cfg);
  final item = wfItemLabel(cfg);
  final unit = wfUnitLabel(cfg);
  switch (a.stage) {
    case WfStage.intake:
      return WfAdvancePlan(
        patch: a.copyWith(stage: WfStage.prep),
        event: (title: '$feat: ${wfStageLabel(cfg, WfStage.prep)} — $name (${a.names.length} $item)', done: false),
        toast: 'נרשמו ${a.names.length} — נכנס ללוח: ${wfStageLabel(cfg, WfStage.prep)}',
      );
    case WfStage.prep:
      return WfAdvancePlan(
        patch: a.copyWith(stage: WfStage.ready),
        event: (title: '$feat: ${wfStageLabel(cfg, WfStage.prep)} ✓ — $name', done: true),
        toast: 'אושר — עכשיו: ${wfStageLabel(cfg, WfStage.ready)}',
      );
    case WfStage.ready:
      final units = wfUnitsTotal(a);
      return WfAdvancePlan(
        patch: a.copyWith(stage: WfStage.dispatch),
        event: (title: '$feat: ${wfStageLabel(cfg, WfStage.dispatch)} — $name ($units $unit)', done: false),
        toast: 'נרשם — נכנס ללוח: ${wfStageLabel(cfg, WfStage.dispatch)}',
      );
    case WfStage.dispatch:
      if (!a.dispatchPushed) {
        return WfAdvancePlan(
          patch: a.copyWith(dispatchPushed: true),
          event: (title: '$feat: ${wfStageLabel(cfg, WfStage.dispatch)} — $name', done: false),
          toast: 'נמסר — נרשם בלוח היומי',
        );
      }
      return WfAdvancePlan(
        patch: a.copyWith(stage: WfStage.done),
        event: (title: '$feat: ${wfStageLabel(cfg, WfStage.done)} — $name', done: true),
        toast: 'הטיפול הושלם ✓',
      );
    case WfStage.done:
      return null;
  }
}

/// patch-החזרה (revert): חזרה לפני "dispatch" מנקה את dispatchPushed.
WfCase wfRevertPatch(WfCase a, WfStage to) => a.copyWith(
      stage: to,
      dispatchPushed: wfStageIndex(to) >= wfStageIndex(WfStage.dispatch) &&
          a.dispatchPushed,
    );

/// נרמול-שם ל-dedup: מ-ליבת-הטקסט המשותפת ([normName] = normSearch + הסרת-רווח).
String wfNormName(String s) => normName(s);

/// הוספת-שם טהורה: dedup לפי wfNormName; רשומת-log רק אם ניתנה כמות.
/// מחזיר או ({names, log?}) או שגיאה.
({List<WfName> names, List<WfLog>? log})? planAddName(
  WfCase a,
  String rawName,
  int? units,
  String id, {
  required String todayIso,
}) {
  final nm = rawName.trim();
  if (nm.isEmpty) return null; // ריק — המתקשר מציג את השגיאה
  final key = wfNormName(nm);
  if (a.names.any((x) => wfNormName(x.name) == key)) return null; // כפול
  final names = [...a.names, WfName(id: id, name: nm, units: units)];
  if (units != null) {
    return (names: names, log: [WfLog(date: todayIso, units: units, name: nm), ...a.log]);
  }
  return (names: names, log: null);
}

/// דוח "טופל-היום": שורות-כותרת + מקרה-לכל-מי-שנגע-היום (lastTouch או log-היום).
List<List<Object>> wfDailyRows(
  OrgConfig cfg,
  List<({String name, String phone, WfCase? wf})> entities,
  String todayIso,
) {
  final unit = wfUnitLabel(cfg);
  final item = wfItemLabel(cfg);
  final rows = <List<Object>>[
    ['שם', 'טלפון', '$unit היום', 'שלב', item, 'מתי לדבר שוב', 'הערה'],
  ];
  for (final e in entities) {
    final a = e.wf;
    if (a == null) continue;
    final touched =
        a.lastTouch == todayIso || a.log.any((l) => l.date == todayIso);
    if (!touched) continue;
    final logToday = a.log.where((l) => l.date == todayIso).toList();
    final unitsToday = logToday.isNotEmpty
        ? logToday.fold<int>(0, (t, l) => t + l.units)
        : (wfUnitsTotal(a) == 0 ? '' : wfUnitsTotal(a));
    final namesLine = a.names
        .map((n) => n.name + (n.units != null ? ' ·${n.units}' : '') + (n.done ? ' ✓' : ''))
        .join(' · ');
    rows.add([
      e.name,
      e.phone,
      unitsToday,
      wfStageLabel(cfg, a.stage),
      namesLine,
      a.nextTouch,
      a.note,
    ]);
  }
  return rows;
}

// (נרמול-החיפוש-העברי חולץ ל-lib/logic/text_normalize.dart — נקודת-אמת אחת
// שגם ה-CRM צורך; ההתנהגות זהה-בייטים לפונקציה שהייתה כאן.)

