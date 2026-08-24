// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · configOpsFromJson — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/config_op.dart:116-128 (13 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): configOpFromJson
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
List<ConfigOp> configOpsFromJson(Object? raw) {
  if (raw is! List) return const [];
  final out = <ConfigOp>[];
  for (final e in raw) {
    final op = configOpFromJson(e);
    if (op != null) out.add(op);
  }
  return out;
}

/// VALUE equality for two ops (the sealed classes use identity `==`; this is the
/// step-69 "value-based compare" for undo/diff tests). Reuses `CfgStyle`/`CfgAction`
/// value `==` for the nested payloads.
