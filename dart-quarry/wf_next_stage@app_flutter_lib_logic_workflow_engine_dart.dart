// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · wfNextStage — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/workflow_engine.dart:70-135 (66 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): wfStageIndex, copyWith
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
WfStage? wfNextStage(WfStage s) {
  final i = wfStageIndex(s);
  return i < kWfStages.length - 1 ? kWfStages[i + 1] : null;
}

/// פריט-שורה במקרה-workflow (dedup לפי שם-מנורמל; כמות אופציונלית).
class WfName {
  const WfName({required this.id, required this.name, this.units, this.done = false});
  final String id;
  final String name;
  final int? units; // null = לא-נספר
  final bool done;
}

class WfLog {
  const WfLog({required this.date, required this.units, this.name});
  final String date;
  final int units;
  final String? name;
}

/// מקרה-workflow יחיד — immutable; `copyWith` לשינויים.
class WfCase {
  const WfCase({
    this.stage = WfStage.intake,
    this.note = '',
    this.dispatchPushed = false,
    this.nextTouch = '',
    this.nextTouchTime = '',
    this.lastTouch = '',
    this.names = const [],
    this.log = const [],
  });

  final WfStage stage;
  final String note;
  final bool dispatchPushed; // נקבע בלחיצה-1 של מסירה; מתאפס ב-revert-לפני-מסירה
  final String nextTouch; // 'YYYY-MM-DD' — מגע-הבא המתוזמן
  final String nextTouchTime; // 'HH:MM'
  final String lastTouch; // מוטבע כמעט בכל מוטציה — מקור "טופל-היום"
  final List<WfName> names;
  final List<WfLog> log;

  WfCase copyWith({
    WfStage? stage,
    String? note,
    bool? dispatchPushed,
    String? nextTouch,
    String? nextTouchTime,
    String? lastTouch,
    List<WfName>? names,
    List<WfLog>? log,
  }) =>
      WfCase(
        stage: stage ?? this.stage,
        note: note ?? this.note,
        dispatchPushed: dispatchPushed ?? this.dispatchPushed,
        nextTouch: nextTouch ?? this.nextTouch,
        nextTouchTime: nextTouchTime ?? this.nextTouchTime,
        lastTouch: lastTouch ?? this.lastTouch,
        names: names ?? this.names,
        log: log ?? this.log,
      );
}

/// כמות מצטברת של כל השמות.
