// בדיקת-חוזה · fuzzyMatch — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/fuzzy_match_test.dart
import 'fuzzy_match.dart';

void _eqb(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

String _norm(String s) => s.trim().toLowerCase();

// מימוש-Damerau קלאסי (stub דטרמיניסטי לבדיקת-הקסקדה).
int _dl(String a, String b) {
  final n = a.length, m = b.length;
  final d = List.generate(n + 1, (_) => List<int>.filled(m + 1, 0));
  for (var i = 0; i <= n; i++) d[i][0] = i;
  for (var j = 0; j <= m; j++) d[0][j] = j;
  for (var i = 1; i <= n; i++) {
    for (var j = 1; j <= m; j++) {
      final cost = a[i - 1] == b[j - 1] ? 0 : 1;
      var v = [d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost]
          .reduce((x, y) => x < y ? x : y);
      if (i > 1 && j > 1 && a[i - 1] == b[j - 2] && a[i - 2] == b[j - 1]) {
        v = v < d[i - 2][j - 2] + 1 ? v : d[i - 2][j - 2] + 1;
      }
      d[i][j] = v;
    }
  }
  return d[n][m];
}

int _tol(int len) => len >= 4 ? 1 : 0;

void main() {
  var n = 0;
  bool fm(String q, String c) => fuzzyMatch(q, c,
      normSearch: _norm, damerauLevenshtein: _dl, fuzzyTolerance: _tol);

  _eqb(fm('abc', 'xxabcxx'), true, '1 substring'); n++;
  _eqb(fm('', 'abc'), false, '2 empty query'); n++;
  _eqb(fm('abc', '   '), false, '3 empty after trim'); n++;
  _eqb(fm('abcd', 'abxd'), true, '4 dist1<=tol1'); n++;
  _eqb(fm('abcd', 'xyzw'), false, '5 dist4>tol1'); n++;
  _eqb(fm('ab', 'ax'), false, '6 dist1>tol0'); n++;
  _eqb(fm('ABC', 'abcxx'), true, '7 norm lower->substr'); n++;

  assert(fm('abc', 'xxabcxx') == true, 'assert-live guard');

  print('OK fuzzyMatch: $n asserts passed');
}
