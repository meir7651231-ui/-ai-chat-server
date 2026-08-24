// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · configOpsToJson — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/config_op.dart:110-115 (6 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): configOpToJson
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
List<Map<String, dynamic>> configOpsToJson(List<ConfigOp> ops) =>
    [for (final op in ops) configOpToJson(op)];

/// Deserialise a batch, DROPPING anything unrecognised (never throws, never a
/// half-built op) — mirrors the closed-set discipline: a stored draft with a
/// future/foreign op simply loses that entry instead of corrupting the load.
