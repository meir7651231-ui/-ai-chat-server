// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · scopeLabel — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_prompt.dart:189-201 (13 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): substring
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String scopeLabel(String scope) {
  if (scope == kScopeAll) return 'מתוך: כל האלמנטים';
  if (scope.startsWith(kScopeScreenPrefix)) {
    return 'מתוך: מרחב «${scope.substring(kScopeScreenPrefix.length)}»';
  }
  if (scope.startsWith(kScopeSinglePrefix)) {
    return 'מתוך: האלמנט «${scope.substring(kScopeSinglePrefix.length)}»';
  }
  return 'מתוך: (טווח לא מזוהה)'; // defensive — an unrecognised scope
}

/// A one-line Hebrew description of a Stage-A scope token (for the `token = תיאור`
/// list). Broadcast / per-namespace only — the closed set [studioScopeTokens] emits.
