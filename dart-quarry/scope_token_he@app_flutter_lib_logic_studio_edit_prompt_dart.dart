// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _scopeTokenHe — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_prompt.dart:202-212 (11 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): substring
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String _scopeTokenHe(String token) {
  if (token == kScopeAll) return 'כל האלמנטים';
  if (token.startsWith(kScopeScreenPrefix)) {
    return 'מרחב «${token.substring(kScopeScreenPrefix.length)}»';
  }
  return token;
}

/// Stage-A PROMPT — hands the model the closed scope-token set (`token = תיאור`,
/// the compact idiom) + the capped utterance, and demands ONE token or AMBIGUOUS.
/// Pure string; no gateway round-trip.
