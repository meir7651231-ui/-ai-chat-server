import 'live-suggestions.dart';

/// רתמת-זהב: אותן 6 דוגמאות-חוזה בדיוק מ-new/atoms/live-suggestions.test.mjs.
List<dynamic> sug(dynamic d, dynamic t, dynamic c) =>
    [{'key': 'a'}, {'key': 'b'}, {'key': 'c'}];

void main() {
  var f = 0;
  void ok(bool cond, String msg) {
    if (!cond) {
      print('✗ $msg');
      f = 1;
    }
  }

  // 1) 'a' טופל ומוחרג
  final r1 = liveSuggestions({'attnDone': {'a': 1}}, '2026-08-24', null, sug);
  ok(r1.length == 2 && r1[0]['key'] == 'b' && r1[1]['key'] == 'c', 'דוגמה 1 נשברה');

  // 2) אין attnDone ⇒ שלושתן
  ok(liveSuggestions({}, '2026-08-24', null, sug).length == 3, 'דוגמה 2 נשברה');

  // 3) הכול טופל ⇒ ריק
  ok(
      liveSuggestions({'attnDone': {'a': 1, 'b': '2026-08-24', 'c': true}},
              '2026-08-24', null, sug)
          .length ==
          0,
      'דוגמה 3 נשברה');

  // 4) ערך falsy אינו "טופל"
  ok(liveSuggestions({'attnDone': {'b': 0}}, '2026-08-24', null, sug).length == 3,
      'דוגמה 4 נשברה');

  // 5) פס-העברה שקוף — השקע מקבל בדיוק את (db,todayIso,config)
  final db5 = {'attnDone': {}};
  final cfg5 = {'features': {}};
  List<dynamic>? seen;
  liveSuggestions(db5, '2026-01-01', cfg5, (dynamic d, dynamic t, dynamic c) {
    seen = [d, t, c];
    return [];
  });
  ok(
      seen != null &&
          identical(seen![0], db5) &&
          seen![1] == '2026-01-01' &&
          identical(seen![2], cfg5),
      'דוגמה 5 נשברה — הארגומנטים לא הועברו כמו-שהם');

  // 6) שקע ריק ⇒ ריק
  ok(liveSuggestions({}, '2026-08-24', null, (dynamic d, dynamic t, dynamic c) => []).length == 0,
      'דוגמה 6 נשברה');

  if (f != 0) throw StateError('live-suggestions: סטייה מהמקור');
  print('✓ live-suggestions: 6 דוגמאות-חוזה — ירוק');
}
