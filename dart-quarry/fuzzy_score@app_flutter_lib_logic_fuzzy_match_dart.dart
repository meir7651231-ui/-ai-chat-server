// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · fuzzyScore — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/fuzzy_match.dart:78-88 (11 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): normSearch, contains, damerauLevenshtein, fuzzyTolerance
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
int fuzzyScore(String query, String candidate) {
  final q = normSearch(query);
  final c = normSearch(candidate);
  if (q.isEmpty || c.isEmpty) return -1;
  if (c.contains(q)) return 0;
  final d = damerauLevenshtein(q, c);
  return d <= fuzzyTolerance(q.length) ? d : -1;
}

int _min3(int a, int b, int c) => a < b ? (a < c ? a : c) : (b < c ? b : c);

