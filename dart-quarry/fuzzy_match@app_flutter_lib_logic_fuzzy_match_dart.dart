// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · fuzzyMatch — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/fuzzy_match.dart:58-67 (10 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): normSearch, contains, damerauLevenshtein, fuzzyTolerance
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool fuzzyMatch(String query, String candidate) {
  final q = normSearch(query);
  final c = normSearch(candidate);
  if (q.isEmpty || c.isEmpty) return false;
  if (c.contains(q)) return true;
  return damerauLevenshtein(q, c) <= fuzzyTolerance(q.length);
}

/// התאמה מודעת-מילים לשמות: המחרוזת-השלמה תואמת ([fuzzyMatch]) — או כל **מילה**
/// בתוכה (כך שגיאת-הקלדה במילה-אחת פוגעת בשם רב-מילים: 'כוהן' → 'יוסי כהן').
