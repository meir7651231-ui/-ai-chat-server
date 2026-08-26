// בדיקת-חוזה · fuzzyScore — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/fuzzy_score_test.dart
import 'fuzzy_score.dart';

// שקעי-הבדיקה הדטרמיניסטיים (מתועדים בחוזה).
String _norm(String s) => s.trim().toLowerCase();

int _lev(String a, String b) {
  final m = a.length, n = b.length;
  final d = List.generate(m + 1, (_) => List<int>.filled(n + 1, 0));
  for (var i = 0; i <= m; i++) d[i][0] = i;
  for (var j = 0; j <= n; j++) d[0][j] = j;
  for (var i = 1; i <= m; i++) {
    for (var j = 1; j <= n; j++) {
      final cost = a[i - 1] == b[j - 1] ? 0 : 1;
      final del = d[i - 1][j] + 1;
      final ins = d[i][j - 1] + 1;
      final sub = d[i - 1][j - 1] + cost;
      d[i][j] = del < ins ? (del < sub ? del : sub) : (ins < sub ? ins : sub);
    }
  }
  return d[m][n];
}

int _tol(int n) => n <= 3 ? 1 : 2;

int _score(String q, String c) => fuzzyScore(q, c,
    normSearch: _norm, damerauLevenshtein: _lev, fuzzyTolerance: _tol);

void _eq(int got, int want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(_score('abc', 'abcdef'), 0, '1 contains'); n++;
  _eq(_score('', 'x'), -1, '2 empty q'); n++;
  _eq(_score('x', ''), -1, '3 empty c'); n++;
  _eq(_score('  AB ', 'ab'), 0, '4 norm->contains'); n++;
  _eq(_score('abc', 'abx'), 1, '5 dist1<=tol1'); n++;
  _eq(_score('abc', 'xyz'), -1, '6 dist3>tol1'); n++;
  _eq(_score('abcd', 'abxy'), 2, '7 dist2<=tol2'); n++;
  _eq(_score('abcd', 'wxyz'), -1, '8 dist4>tol2'); n++;

  assert(_score('abc', 'abcdef') == 0, 'assert-live guard');
  print('OK fuzzyScore: $n asserts passed');
}
