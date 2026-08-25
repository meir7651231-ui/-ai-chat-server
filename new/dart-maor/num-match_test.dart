// בדיקת-חוזה (רתמת-זהב) · numMatch — מייבאת אך ורק את האטום-שלה (חוק-4).
// 11 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/num-match.test.mjs:
//   ('3',3)=true · ('3',4)=false · ('3+',5)=true · ('3 +',3)=true · ('3+',2)=false ·
//   ('2-4',3)=true · ('2 - 4',2)=true · ('2-4',5)=false · ('',7)=true ·
//   (null,7)=true · ('אבג',0)=true.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/num-match_test.dart  ⇒ exit 0
import 'num-match.dart';

void _check(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  // (q, n, expected) — verbatim מ-num-match.test.mjs.
  final cases = <List<dynamic>>[
    ['3', 3, true], ['3', 4, false],
    ['3+', 5, true], ['3 +', 3, true], ['3+', 2, false],
    ['2-4', 3, true], ['2 - 4', 2, true], ['2-4', 5, false],
    ['', 7, true], [null, 7, true],
    ['אבג', 0, true],
  ];
  var n = 0;
  for (final c in cases) {
    final q = c[0];
    final num num_ = c[1] as num;
    final expected = c[2] as bool;
    final got = numMatch(q, num_);
    _check(got == expected,
        'numMatch(${q == null ? 'null' : '"$q"'}, $num_) = $got ≠ $expected');
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(numMatch('3+', 5) == true, 'assert-live guard');

  print('OK numMatch: $n דוגמאות-חוזה — ירוק');
}
