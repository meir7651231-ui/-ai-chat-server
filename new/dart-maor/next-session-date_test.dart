// בדיקת-חוזה (רתמת-זהב) · nextSessionDate — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/next-session-date.test.mjs.
// NOW = 2026-08-24 (יום-שני) 12:00. הערה: חודשי-JS 0-אינדקסיים (month 7) ⇒ Dart month 8.
// המרה: getTime()===want ⇒ DateTime ==; מערך-ריק ⇒ null. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/next-session-date_test.dart ⇒ exit 0
import 'next-session-date.dart';

// שקע-sessionsOf מקומי לבדיקה — מחזיר את מערך-המפגשים שהוזן לחוג.
dynamic _sessionsOf(dynamic c) => c['sessions'];

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;
  final now = DateTime(2026, 8, 24, 12, 0); // 2026-08-24, יום-שני, 12:00

  final cases = <List<dynamic>>[
    [
      'דוגמה 1 (שלישי הקרוב)',
      [
        {'day': 2, 'time': '17:00'}
      ],
      DateTime(2026, 8, 25, 17, 0)
    ],
    [
      'דוגמה 2 (היום — שעה עתידית)',
      [
        {'day': 1, 'time': '17:00'}
      ],
      DateTime(2026, 8, 24, 17, 0)
    ],
    [
      'דוגמה 3 (היום — שעה שעברה ⇒ שבוע)',
      [
        {'day': 1, 'time': '10:00'}
      ],
      DateTime(2026, 8, 31, 10, 0)
    ],
    [
      'דוגמה 4 (מרובה — המוקדם מנצח)',
      [
        {'day': 4, 'time': '09:00'},
        {'day': 2, 'time': '19:30'}
      ],
      DateTime(2026, 8, 25, 19, 30)
    ],
    [
      'דוגמה 5 (בלי שעה ⇒ 17:00)',
      [
        {'day': 3}
      ],
      DateTime(2026, 8, 26, 17, 0)
    ],
  ];

  for (final row in cases) {
    final name = row[0] as String;
    final sessions = row[1];
    final want = row[2] as DateTime;
    final g = nextSessionDate({'sessions': sessions}, now, _sessionsOf);
    _ok(g != null && g == want, '$name: $g ≠ $want');
    n++;
  }

  // 6. אין מפגשים ⇒ null.
  _ok(nextSessionDate({'sessions': []}, now, _sessionsOf) == null,
      'דוגמה 6: מערך-ריק לא החזיר null');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
      nextSessionDate({
            'sessions': [
              {'day': 2, 'time': '17:00'}
            ]
          }, now, _sessionsOf) ==
          DateTime(2026, 8, 25, 17, 0),
      'assert-live guard');

  print('✓ next-session-date: $n דוגמאות-חוזה — ירוק (Dart≡JS)');
}
