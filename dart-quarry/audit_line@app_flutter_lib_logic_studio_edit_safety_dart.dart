// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · auditLine — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_safety.dart:484-488 (5 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String auditLine(BlockedEntry e) =>
    '⛔ ${_opTag(e.op)} · ${e.op.id} · ${e.reasonHe}';

/// The whole blocked list as audit lines (§10 תוספת-ב) — pure, dumpable to a future
/// `visual_log` (#107/#116). Empty when nothing was blocked.
