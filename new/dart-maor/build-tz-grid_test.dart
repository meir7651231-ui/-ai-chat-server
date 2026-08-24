// בדיקת-חוזה (רתמת-זהב) · buildTzGrid — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/build-tz-grid.test.mjs:
//   1) הפלט = אותה רפרנס שהחזיר השקע (=== במקור ⇒ identical ב-Dart).
//   2) tzEvents הועבר לשקע באותה רפרנס בדיוק.
//   2b) anchorIso, hebMode הועברו כמו-שהם ('2026-08-24', false).
//   3) hebMode=true עובר לשקע כ-true.
//   4) שקע-מחשב: אורך רשימת-tzEvents נגיש בתוך השקע ({n: evs.length}=3).
// המרה: === של JS ⇒ identical ב-Dart. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/build-tz-grid_test.dart  ⇒ exit 0
import 'build-tz-grid.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1+2+2b · האצלה מלאה — אותה רפרנס לפלט ולארגומנט הראשון, וערכים כמו-שהם.
  final ev = [
    {'date': '2026-08-24'}
  ];
  final g = {'cells': []};
  List<Object?>? seen;
  final out = buildTzGrid(ev, '2026-08-24', false, (a, b, c) {
    seen = [a, b, c];
    return g;
  });
  _ok(identical(out, g), 'הפלט אינו זקיף-השקע (רפרנס)'); n++;
  _ok(identical(seen![0], ev), 'tzEvents לא הועבר באותה רפרנס'); n++;
  _ok(seen![1] == '2026-08-24' && seen![2] == false, 'anchorIso/hebMode שונו'); n++;

  // 3 · hebMode=true עובר כמו-שהוא.
  Object? hebSeen;
  buildTzGrid(<Object?>[], '2026-01-01', true, (e, a, h) {
    hebSeen = h;
    return null;
  });
  _ok(hebSeen == true, 'hebMode=true לא הועבר כ-true'); n++;

  // 4 · שקע-מחשב — אורך הרשימה נגיש בתוך השקע.
  final r = buildTzGrid(
    [
      {'date': 'a'},
      {'date': 'b'},
      {'date': 'c'}
    ],
    'x',
    false,
    (evs, a, h) => {'n': (evs as List).length},
  ) as Map;
  _ok(r['n'] == 3, 'שקע-מחשב: n ≠ 3'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(identical(buildTzGrid(ev, 'z', false, (a, b, c) => a), ev),
      'assert-live guard');

  print('OK buildTzGrid: $n asserts passed');
}
