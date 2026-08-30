// בדיקת-חוזה · scheduleClashText — 8 דוגמאות-המקור (schedule-clash-text.test.mjs)
// + עדות-הסגר (כלל-15): אינדוקס-מערך במחרוזת-קנונית (day='1' ⇒ dayNames[1]).
// הרצה: dart run --enable-asserts schedule-clash-text_test.dart
import '../dart-data-maor/schedule-clash-text-sockets.dart' as sk_schedule_clash_text;
import 'schedule-clash-text.dart';

int _f = 0;
void ok(bool cond, String msg) {
  if (!cond) {
    print('✗ $msg');
    _f = 1;
  }
}

// שקע-מפגשים = סמנטיקת-המוצא (sessionsOf)
List sessionsOf(dynamic c) {
  final s = c['sessions'];
  if (s is List && s.isNotEmpty) return s;
  return [
    {'day': c['weekday'], 'time': c['time'], 'label': ''}
  ];
}

Map db(List courses, List enrollments) =>
    {'courses': courses, 'enrollments': enrollments};

void main() {
  final piano = {'id': 'c1', 'name': 'פסנתר', 'weekday': 2, 'time': '17:00'};
  final paint = {'id': 'c2', 'name': 'ציור', 'weekday': 2, 'time': '17:00'};

  // 1) התנגשות מלאה — נוסח מדויק
  ok(
    scheduleClashText(
          db([paint], [
            {'memberId': 'm1', 'courseId': 'c2', 'status': 'active'}
          ]),
          'm1',
          piano,
          sessionsOf,
          sk_schedule_clash_text.scheduleClashText_dayNames,
          sk_schedule_clash_text.scheduleClashText_T) ==
        '⚠ התנגשות לו"ז: כבר משובצ/ת ל"ציור" — יום שלישי 17:00',
    'דוגמה 1: נוסח-האזהרה',
  );

  // 2) אותו יום, שעה שונה ⇒ null
  ok(
    scheduleClashText(
          db([
            {...paint, 'time': '18:00'}
          ], [
            {'memberId': 'm1', 'courseId': 'c2', 'status': 'active'}
          ]),
          'm1',
          piano,
          sessionsOf,
          sk_schedule_clash_text.scheduleClashText_dayNames,
          sk_schedule_clash_text.scheduleClashText_T) ==
        null,
    'דוגמה 2: שעה שונה',
  );

  // 3) שיבוץ שהסתיים ⇒ null
  ok(
    scheduleClashText(
          db([paint], [
            {'memberId': 'm1', 'courseId': 'c2', 'status': 'ended'}
          ]),
          'm1',
          piano,
          sessionsOf,
          sk_schedule_clash_text.scheduleClashText_dayNames,
          sk_schedule_clash_text.scheduleClashText_T) ==
        null,
    'דוגמה 3: ended מוחרג',
  );

  // 4) שיבוץ לחוג-היעד עצמו ⇒ null
  ok(
    scheduleClashText(
          db([piano], [
            {'memberId': 'm1', 'courseId': 'c1', 'status': 'active'}
          ]),
          'm1',
          piano,
          sessionsOf,
          sk_schedule_clash_text.scheduleClashText_dayNames,
          sk_schedule_clash_text.scheduleClashText_T) ==
        null,
    'דוגמה 4: חוג-היעד עצמו',
  );

  // 5) שעות ריקות ⇒ null
  ok(
    scheduleClashText(
          db([
            {...paint, 'time': ''}
          ], [
            {'memberId': 'm1', 'courseId': 'c2', 'status': 'active'}
          ]),
          'm1',
          {...piano, 'time': ''},
          sessionsOf,
          sk_schedule_clash_text.scheduleClashText_dayNames,
          sk_schedule_clash_text.scheduleClashText_T) ==
        null,
    'דוגמה 5: שעה ריקה לא מתנגשת',
  );

  // 6) ילד אחר ⇒ null
  ok(
    scheduleClashText(
          db([paint], [
            {'memberId': 'm2', 'courseId': 'c2', 'status': 'active'}
          ]),
          'm1',
          piano,
          sessionsOf,
          sk_schedule_clash_text.scheduleClashText_dayNames,
          sk_schedule_clash_text.scheduleClashText_T) ==
        null,
    'דוגמה 6: ילד אחר',
  );

  // 7) חוג שנמחק ⇒ null
  ok(
    scheduleClashText(
          db([], [
            {'memberId': 'm1', 'courseId': 'c2', 'status': 'active'}
          ]),
          'm1',
          piano,
          sessionsOf,
          sk_schedule_clash_text.scheduleClashText_dayNames,
          sk_schedule_clash_text.scheduleClashText_T) ==
        null,
    'דוגמה 7: חוג חסר מדולג',
  );

  // 8) התנגשות דרך מערך-sessions מרובה (יום 4 = חמישי)
  final multiTarget = {
    'id': 'c1',
    'name': 'פסנתר',
    'sessions': [
      {'day': 2, 'time': '17:00', 'label': ''},
      {'day': 4, 'time': '16:30', 'label': ''}
    ]
  };
  final thursday = {'id': 'c3', 'name': 'תפירה', 'weekday': 4, 'time': '16:30'};
  ok(
    scheduleClashText(
          db([thursday], [
            {'memberId': 'm1', 'courseId': 'c3', 'status': 'active'}
          ]),
          'm1',
          multiTarget,
          sessionsOf,
          sk_schedule_clash_text.scheduleClashText_dayNames,
          sk_schedule_clash_text.scheduleClashText_T) ==
        '⚠ התנגשות לו"ז: כבר משובצ/ת ל"תפירה" — יום חמישי 16:30',
    'דוגמה 8: sessions מרובים',
  );

  // 9) עדות-הסגר (כלל-15): day='1' מחרוזת ⇒ JS dayNames['1']≡dayNames[1]='שני'.
  final pStr = {
    'id': 'c1',
    'name': 'פסנתר',
    'sessions': [
      {'day': '1', 'time': '17:00', 'label': ''}
    ]
  };
  final oStr = {
    'id': 'c2',
    'name': 'ציור',
    'sessions': [
      {'day': '1', 'time': '17:00', 'label': ''}
    ]
  };
  ok(
    scheduleClashText(
          db([oStr], [
            {'memberId': 'm1', 'courseId': 'c2', 'status': 'active'}
          ]),
          'm1',
          pStr,
          sessionsOf,
          sk_schedule_clash_text.scheduleClashText_dayNames,
          sk_schedule_clash_text.scheduleClashText_T) ==
        '⚠ התנגשות לו"ז: כבר משובצ/ת ל"ציור" — יום שני 17:00',
    'עדות-הסגר: אינדקס-מחרוזת-קנונית day="1"',
  );

  // 10) מפתח לא-קנוני '01' אינו אינדקס-מערך ⇒ undefined (כלל-15).
  final pBad = {
    'id': 'c1',
    'name': 'פסנתר',
    'sessions': [
      {'day': '01', 'time': '17:00', 'label': ''}
    ]
  };
  final oBad = {
    'id': 'c2',
    'name': 'ציור',
    'sessions': [
      {'day': '01', 'time': '17:00', 'label': ''}
    ]
  };
  ok(
    scheduleClashText(
          db([oBad], [
            {'memberId': 'm1', 'courseId': 'c2', 'status': 'active'}
          ]),
          'm1',
          pBad,
          sessionsOf,
          sk_schedule_clash_text.scheduleClashText_dayNames,
          sk_schedule_clash_text.scheduleClashText_T) ==
        '⚠ התנגשות לו"ז: כבר משובצ/ת ל"ציור" — יום undefined 17:00',
    'עדות-הסגר: מפתח לא-קנוני "01" ⇒ undefined',
  );

  if (_f != 0) {
    print('נכשל');
    throw StateError('בדיקות נכשלו');
  }
  print('✓ schedule-clash-text.dart: 8 דוגמאות-חוזה + 2 עדויות-הסגר (כלל-15) — ירוק');
}
