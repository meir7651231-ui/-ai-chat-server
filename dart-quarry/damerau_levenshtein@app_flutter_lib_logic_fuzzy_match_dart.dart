// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · damerauLevenshtein — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/fuzzy_match.dart:16-57 (42 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): filled, generate, codeUnitAt, fuzzyTolerance
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
int damerauLevenshtein(String a, String b) {
  if (a == b) return 0;
  if (a.isEmpty) return b.length;
  if (b.isEmpty) return a.length;
  final n = a.length;
  final m = b.length;
  var prev2 = List<int>.filled(m + 1, 0); // שורה i-2 (לחילוף)
  var prev = List<int>.generate(m + 1, (j) => j); // שורה i-1
  var cur = List<int>.filled(m + 1, 0);
  for (var i = 1; i <= n; i++) {
    cur[0] = i;
    for (var j = 1; j <= m; j++) {
      final cost = a.codeUnitAt(i - 1) == b.codeUnitAt(j - 1) ? 0 : 1;
      var v = _min3(
        cur[j - 1] + 1, // הוספה
        prev[j] + 1, // מחיקה
        prev[j - 1] + cost, // החלפה
      );
      // חילוף שני תווים שכנים (transposition).
      if (i > 1 &&
          j > 1 &&
          a.codeUnitAt(i - 1) == b.codeUnitAt(j - 2) &&
          a.codeUnitAt(i - 2) == b.codeUnitAt(j - 1)) {
        final t = prev2[j - 2] + 1;
        if (t < v) v = t;
      }
      cur[j] = v;
    }
    final tmp = prev2;
    prev2 = prev;
    prev = cur;
    cur = tmp;
  }
  return prev[m];
}

/// סף-הסובלנות של Maor: `floor(len/3) + 1` — מרחק-העריכה המרבי שעדיין נחשב
/// התאמה, פר-אורך-המחרוזת-המנורמלת של השאילתה.
int fuzzyTolerance(int len) => (len ~/ 3) + 1;

/// האם [candidate] תואם-בקירוב את [query]? נרמול-עברי משותף על שניהם, ואז:
/// התאמת-מצע (contains) = תמיד תואם (מרחק 0); אחרת מרחק-עריכה ≤ סף. ריק=לא-תואם.
