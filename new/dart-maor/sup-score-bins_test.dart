// בדיקת-חוזה (רתמת-זהב) · supScoreBins — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/sup-score-bins.test.mjs
// (אותם קלטים→פלטים; שקע-הבדיקה byScore = (sp)=>sp.score אלא-אם צוין אחרת):
//   1) []                          ⇒ [0,0,0,0,0,0,0,0,0,0] (תמיד 10 סלים)
//   2) ציונים [130,580,1000]       ⇒ [0,1,0,0,0,1,0,0,0,1] (1000 נצמד לסל-9)
//   3) ציונים [999,950]            ⇒ [0,0,0,0,0,0,0,0,0,2] (שניים בסל העליון)
//   4) ציון [0]                    ⇒ [1,0,0,0,0,0,0,0,0,0]
//   5) ה-rate זורם לשקע (byRate=(sp,r)=>r*100): ‏rate=4 ⇒ סל-4; ‏rate הושמט
//      (undefined במקור ⇒ ברירת-המחדל 3.7) ⇒ סל-3.
// השוואת-מערכים = אורך + איבר-איבר (כלל-8 — לעולם לא join). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/sup-score-bins_test.dart  ⇒ exit 0
import 'sup-score-bins.dart';

// שקע-הבדיקה — מקביל ל-byScore = (sp) => sp.score במקור (JS מתעלם מארגומנט עודף;
// כאן החתימה דו-ארגומנטית כי האטום תמיד קורא supScore(sp, rate)).
dynamic _byScore(dynamic sp, dynamic rate) => sp['score'];

// שקע דוגמה-5 — מקביל ל-byRate = (sp, r) => r * 100.
dynamic _byRate(dynamic sp, dynamic r) => r * 100;

// כלל-8: השוואת-מערך = אורך + איבר-איבר; כשל ⇒ StateError.
void _eq(List<int> got, List<int> want, String label) {
  if (got.length != want.length) {
    throw StateError('FAIL [$label]: אורך ${got.length} ≠ ${want.length}');
  }
  for (var i = 0; i < want.length; i++) {
    if (got[i] != want[i]) {
      throw StateError('FAIL [$label]: איבר $i — got=${got[i]} want=${want[i]} '
          '(got=$got want=$want)');
    }
  }
}

void main() {
  var n = 0;

  // 1) רשימה ריקה — תמיד 10 סלים.
  _eq(supScoreBins([], rate: 3.7, supScore: _byScore),
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 'דוגמה 1: לא 10 אפסים');
  n++;

  // 2) 130⇒סל1 · 580⇒סל5 · 1000⇒נצמד לסל9.
  _eq(
    supScoreBins([
      {'score': 130},
      {'score': 580},
      {'score': 1000},
    ], rate: 3.7, supScore: _byScore),
    [0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
    'דוגמה 2: פיזור שגוי',
  );
  n++;

  // 3) שניים באותו סל עליון.
  _eq(
    supScoreBins([
      {'score': 999},
      {'score': 950},
    ], rate: 3.7, supScore: _byScore),
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    'דוגמה 3: סל-9 ≠ 2',
  );
  n++;

  // 4) ציון 0 ⇒ סל 0.
  _eq(
    supScoreBins([
      {'score': 0},
    ], rate: 3.7, supScore: _byScore),
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'דוגמה 4: סל-0 ≠ 1',
  );
  n++;

  // 5א) ה-rate זורם לשקע: מפורש 4 ⇒ 400 ⇒ סל 4.
  _eq(supScoreBins([<String, dynamic>{}], rate: 4, supScore: _byRate),
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0], 'דוגמה 5א: rate=4 ≠ סל-4');
  n++;

  // 5ב) rate הושמט (undefined במקור-ה-JS) ⇒ ברירת-המחדל 3.7 ⇒ 370.00000000000006 ⇒ סל 3.
  _eq(supScoreBins([<String, dynamic>{}], supScore: _byRate),
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0], 'דוגמה 5ב: ברירת-מחדל ≠ סל-3');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    supScoreBins([
      {'score': 1000},
    ], supScore: _byScore)[9] ==
        1,
    'assert-live guard',
  );

  print('OK supScoreBins: $n asserts passed');
}
