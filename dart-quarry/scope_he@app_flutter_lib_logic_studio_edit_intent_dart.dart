// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · scopeHe — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_intent.dart:565-579 (15 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): substring
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String scopeHe(String token) {
  if (token == kScopeAll) return 'כל האלמנטים';
  if (token == kScopeActionable) return 'כל הכפתורים';
  if (token.startsWith(kScopeEveryPrefix)) {
    return 'כל «${token.substring(kScopeEveryPrefix.length)}»';
  }
  if (token.startsWith(kScopeScreenPrefix)) {
    return 'מסך «${token.substring(kScopeScreenPrefix.length)}»';
  }
  if (token.startsWith(kScopeSinglePrefix)) {
    return 'האלמנט «${token.substring(kScopeSinglePrefix.length)}»';
  }
  return '(טווח לא מזוהה)';
}

