// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · auditTrail — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_safety.dart:489-495 (7 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): auditLine, renderAuditTrail
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
List<String> auditTrail(SafetyVerdict verdict) =>
    [for (final e in verdict.blocked) auditLine(e)];

/// The audit trail joined into one newline-delimited block (convenience over
/// [auditTrail]). Pure — the caller decides where/whether to persist it.
String renderAuditTrail(SafetyVerdict verdict) => auditTrail(verdict).join('\n');

