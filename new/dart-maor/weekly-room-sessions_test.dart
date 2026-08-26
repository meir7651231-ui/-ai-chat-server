// בדיקת-חוזה (רתמת-זהב) · weeklyRoomSessions — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/weekly-room-sessions.test.mjs:
//   1) r1 ב-2026-08-24 ⇒ 3 — c1 (2 מפגשים) + c4 (end==iso ⇒ נכלל, 1); c2 הסתיים, c3 חדר-אחר
//   2) r2 ⇒ 1 (רק c3)
//   3) r9 ⇒ 0 (אין חוגים בחדר) · וגם courses=[] ⇒ 0
//   4) iso=2026-06-30 (יום-הסיום של c2) ⇒ r1 = 4 — c2 חוזר להיספר (iso ≤ end)
//   5) שקע sessions-of מלא: חוג בלי sessions ⇒ נפילה למפגש-יחיד ⇒ 1
// שקע-sessionsOf בסיסי = `(c) => c.sessions || []` (מערך חסר ⇒ ריק) — מקומי לבדיקה.
// הרצה: dart run --enable-asserts new/dart-maor/weekly-room-sessions_test.dart  ⇒ exit 0
import 'weekly-room-sessions.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// שקע-sessionsOf: מחקה `(c) => c.sessions || []` — חסר/null ⇒ מערך ריק.
List<dynamic> _sessionsOf(dynamic c) =>
    ((c as Map)['sessions'] as List?) ?? const [];

void main() {
  var n = 0;
  final c1 = {
    'id': 'c1',
    'roomId': 'r1',
    'sessions': [{'day': 1}, {'day': 3}],
  };
  final c2 = {
    'id': 'c2',
    'roomId': 'r1',
    'end': '2026-06-30',
    'sessions': [{'day': 2}],
  };
  final c3 = {
    'id': 'c3',
    'roomId': 'r2',
    'sessions': [{'day': 4}],
  };
  final c4 = {
    'id': 'c4',
    'roomId': 'r1',
    'end': '2026-08-24',
    'sessions': [{'day': 5}],
  };
  final db = <String, dynamic>{'courses': [c1, c2, c3, c4]};

  // 1) r1 ב-2026-08-24: c1 (2) + c4 (end==iso ⇒ נכלל, 1) = 3; c2 הסתיים, c3 חדר אחר
  _ok(weeklyRoomSessions(db, 'r1', '2026-08-24', _sessionsOf) == 3,
      '1 r1 ⇒ 3 (כולל יום-הסיום עצמו של c4)');
  n++;

  // 2) r2 ⇒ 1 (רק c3)
  _ok(weeklyRoomSessions(db, 'r2', '2026-08-24', _sessionsOf) == 1, '2 r2 ⇒ 1');
  n++;

  // 3) חדר בלי חוגים ⇒ 0; וגם רשימת-חוגים ריקה ⇒ 0
  _ok(
      weeklyRoomSessions(db, 'r9', '2026-08-24', _sessionsOf) == 0 &&
          weeklyRoomSessions(
                  <String, dynamic>{'courses': []}, 'r1', '2026-08-24', _sessionsOf) ==
              0,
      '3 r9 ⇒ 0 וגם courses=[] ⇒ 0');
  n++;

  // 4) iso=יום-הסיום של c2 ⇒ c2 חוזר להיספר: 2+1+1=4
  _ok(weeklyRoomSessions(db, 'r1', '2026-06-30', _sessionsOf) == 4,
      '4 iso=2026-06-30 ⇒ r1 = 4');
  n++;

  // 5) שקע בהתנהגות sessions-of המלאה: חוג בלי sessions ⇒ נפילה למפגש-יחיד
  //    `(c) => c.sessions && c.sessions.length ? c.sessions : [{day: c.weekday}]`
  List<dynamic> fullSessionsOf(dynamic c) {
    final cm = c as Map;
    final ss = cm['sessions'];
    return (ss is List && ss.isNotEmpty) ? ss : [{'day': cm['weekday']}];
  }

  final c5 = {'id': 'c5', 'roomId': 'r3', 'weekday': 2};
  _ok(
      weeklyRoomSessions(
              <String, dynamic>{'courses': [c5]}, 'r3', '2026-08-24', fullSessionsOf) ==
          1,
      '5 חוג בלי sessions ⇒ 1 דרך הנפילה של השקע');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(weeklyRoomSessions(db, 'r1', '2026-08-24', _sessionsOf) == 3,
      'assert-live guard');

  print('OK weeklyRoomSessions: $n contract examples passed');
}
