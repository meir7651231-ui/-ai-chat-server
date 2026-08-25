// בדיקת-חוזה (רתמת-זהב) · ruleTypo — מייבאת אך ורק את האטום-שלה (חוק-4).
// מתרגמת את בדיקת-ה-JS ‏(new/atoms/rule-typo.test.mjs) ואת דוגמאות-החוזה
// ‏(rule-typo.contract.md: פלט 52/48/44 או null) — כולל שקע-distance זהה-אלגוריתם
// ‏(Levenshtein חד-מערך עם p, פורט שורה-בשורה מהבדיקה-המקורית).
// כל הערכים-הצפויים ננעלו בהרצת המקור-ה-JS עצמו (node) — Dart≡JS ביט-אחר-ביט.
// הפלט סקלרי (int/null) ⇒ כלל-8 (השוואת-מערכים אורך+איבר-איבר) לא-רלוונטי כאן.
// הרצה: dart run --enable-asserts new/dart-maor/rule-typo_test.dart  ⇒ exit 0
import 'rule-typo.dart';

// שקע-distance של הבדיקה — פורט ישיר של dist מ-rule-typo.test.mjs
// (‏!la/!lb של JS ⇒ ==0 מפורש; a[i-1]===b[j-1] ⇒ השוואת תת-מחרוזת-של-תו, BMP-זהה).
int _dist(String a, String b) {
  final la = a.length, lb = b.length;
  if (la == 0) return lb;
  if (lb == 0) return la;
  final dp = List<int>.generate(lb + 1, (j) => j);
  for (var i = 1; i <= la; i++) {
    var p = dp[0];
    dp[0] = i;
    for (var j = 1; j <= lb; j++) {
      final t = dp[j];
      var m = dp[j] + 1;
      if (dp[j - 1] + 1 < m) m = dp[j - 1] + 1;
      final s = p + (a[i - 1] == b[j - 1] ? 0 : 1);
      if (s < m) m = s;
      dp[j] = m;
      p = t;
    }
  }
  return dp[lb];
}

void _eq(dynamic got, dynamic want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — שלוש דוגמאות בדיקת-ה-JS verbatim (rule-typo.test.mjs) —
  _eq(ruleTypo('golstein', 'goldstein', _dist), 48, '1 d=1, term>=6 -> 48'); n++;
  _eq(ruleTypo('כהנ', 'כהנ', _dist), 52, '2 d=0 -> 52');                    n++;
  _eq(ruleTypo('אבג', 'זחט', _dist), null, '3 d=3 > max -> null');           n++;

  // — השלמת דוגמאות-החוזה (52/48/44 + קצוות), ננעל מול הרצת המקור ב-node —
  _eq(ruleTypo('goldstien', 'goldstein', _dist), 44, '4 d=2, term>=6 -> 44'); n++;
  _eq(ruleTypo('ab', 'abcdef', _dist), null, '5 query<3 -> null');            n++;
  _eq(ruleTypo('1234', '1234', _dist), null, '6 all-digits -> null');         n++;
  _eq(ruleTypo('abc', 'abx', _dist), 48, '7 d=1, term<6 (max=1) -> 48');      n++;
  _eq(ruleTypo('abc', 'ayz', _dist), null, '8 d=2 > max=1 -> null');          n++;
  _eq(ruleTypo('abcd', 'abcdef', _dist), 44, '9 d=2, term=6 (max=2) -> 44');  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(ruleTypo('כהנ', 'כהנ', _dist) == 52, 'assert-live guard');

  print('OK ruleTypo: $n asserts passed');
}
