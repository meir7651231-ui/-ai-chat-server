// בדיקת-חוזה (רתמת-זהב) · leaderboard — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/leaderboard.test.mjs:
//   1) הסדר: score יורד, תיקו מוכרע ב-total יורד ⇒ c2,c4,c1.
//   2) לא-פעיל (c3, score 99) לא מופיע — למרות ה-score הגבוה ביותר.
//   3) שורת-c4 נושאת את ערכי-השקעים כלשונם: {total:700, boxCount:3}.
//   4) רכזים ריקים ⇒ [] והשקעים לא נקראים כלל.
// המרה: השקעים החוזיים (totals/boxCounts) מומרים למפות-Dart; socketCalls נספר בסגור.
// הרצה: dart run --enable-asserts new/dart-maor/leaderboard_test.dart  ⇒ exit 0.
import 'leaderboard.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // שקעים חוזיים (מדמים את שכני-המקור).
  final totals = <String, num>{'c1': 300, 'c2': 100, 'c4': 700};
  final boxCounts = <String, int>{'c1': 2, 'c2': 1, 'c4': 3};
  var socketCalls = 0;
  num coordinatorTotal(List<dynamic> boxes, dynamic id) {
    socketCalls++;
    return totals[id] ?? 0;
  }

  List<dynamic> coordinatorBoxes(List<dynamic> boxes, dynamic id) {
    socketCalls++;
    return List<dynamic>.generate(
        boxCounts[id] ?? 0, (i) => <String, dynamic>{'id': '$id-b$i'});
  }

  final C = <Map<String, dynamic>>[
    {'id': 'c1', 'score': 50, 'active': true},
    {'id': 'c2', 'score': 80, 'active': true},
    {'id': 'c3', 'score': 99, 'active': false},
    {'id': 'c4', 'score': 50, 'active': true},
  ];
  final rows = leaderboard(C, <dynamic>[], coordinatorTotal, coordinatorBoxes);

  // 1) הסדר: score יורד, תיקו מוכרע ב-total יורד.
  final order = rows
      .map((r) => (r['coordinator'] as Map)['id'])
      .join(',');
  _ok(order == 'c2,c4,c1', '1: הסדר ≠ c2,c4,c1 (קיבלנו $order)');
  n++;

  // 2) לא-פעיל לא מופיע — גם עם ה-score הגבוה ביותר.
  _ok(
      rows.length == 3 &&
          !rows.any((r) => (r['coordinator'] as Map)['id'] == 'c3'),
      '2: c3 הלא-פעיל הופיע');
  n++;

  // 3) שורת-c4 נושאת את ערכי-השקעים כלשונם.
  final r4 =
      rows.firstWhere((r) => (r['coordinator'] as Map)['id'] == 'c4');
  _ok(r4['total'] == 700 && r4['boxCount'] == 3,
      '3: שורת-c4 ≠ {total:700, boxCount:3}');
  n++;

  // 4) רכזים ריקים ⇒ [] והשקעים לא נקראים.
  socketCalls = 0;
  final empty =
      leaderboard(<dynamic>[], <dynamic>[], coordinatorTotal, coordinatorBoxes);
  _ok(empty.isEmpty, '4: ([]) ≠ []');
  n++;
  _ok(socketCalls == 0, '4: השקעים נקראו על קלט ריק');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(order == 'c2,c4,c1', 'assert-live guard');

  print('OK leaderboard: $n asserts passed');
}
