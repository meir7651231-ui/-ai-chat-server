// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · fuzzyNameMatch — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/fuzzy_match.dart:68-77 (10 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): fuzzyMatch
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool fuzzyNameMatch(String query, String candidate) {
  if (fuzzyMatch(query, candidate)) return true;
  for (final word in candidate.split(RegExp(r'\s+'))) {
    if (word.isNotEmpty && fuzzyMatch(query, word)) return true;
  }
  return false;
}

/// ציון-קרבה (נמוך=טוב): 0 להתאמת-מצע, אחרת מרחק-העריכה. -1 = לא-תואם (מעל הסף)
/// — לסינון ומיון בשכבת-החיפוש.
