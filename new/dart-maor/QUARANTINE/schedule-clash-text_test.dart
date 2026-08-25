// בדיקת-חוזה (רתמת-זהב) · scheduleClashText — מייבאת אך ורק את האטום-שלה (חוק-4).
// מתרגמת ביט-אחר-ביט את new/atoms/schedule-clash-text.test.mjs — כל 8 דוגמאות-החוזה
// (schedule-clash-text.contract.md). הפלט = מחרוזת או null ⇒ השוואת-שוויון ישירה
// (כלל-8 — אורך+איבר-איבר — רלוונטי רק למערכים; אין כאלה בפלט).
// שקע-המפגשים בבדיקה = סמנטיקת-המוצא: c.sessions כשקיימים-ולא-ריקים, אחרת
// מפגש-יחיד מ-weekday/time (truthiness של JS: undefined/ריק ⇒ הנפילה).
// הרצה: dart run --enable-asserts new/dart-maor/schedule-clash-text_test.dart ⇒ OK
import 'schedule-clash-text.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // שקע-מפגשים = סמנטיקת-המוצא (sessionsOf):
  // JS: c.sessions && c.sessions.length ? c.sessions : [{day:c.weekday, time:c.time, label:''}]
  dynamic sessionsOf(dynamic c) {
    final s = c['sessions'];
    return (s is List && s.isNotEmpty)
        ? s
        : [
            {'day': c['weekday'], 'time': c['time'], 'label': ''}
          ];
  }

  final piano = {'id': 'c1', 'name': 'פסנתר', 'weekday': 2, 'time': '17:00'};
  final paint = {'id': 'c2', 'name': 'ציור', 'weekday': 2, 'time': '17:00'};
  Map<String, dynamic> db(List courses, List enrollments) =>
      {'courses': courses, 'enrollments': enrollments};

  // 1) התנגשות מלאה — נוסח מדויק.
  _ok(
    scheduleClashText(
          db([paint], [
            {'memberId': 'm1', 'courseId': 'c2', 'status': 'active'}
          ]),
          'm1',
          piano,
          sessionsOf,
        ) ==
        '⚠ התנגשות לו"ז: כבר משובצ/ת ל"ציור" — יום שלישי 17:00',
    'דוגמה 1: נוסח-האזהרה',
  );
  n++;

  // 2) אותו יום, שעה שונה ⇒ null.
  _ok(
    scheduleClashText(
          db([
            {...paint, 'time': '18:00'}
          ], [
            {'memberId': 'm1', 'courseId': 'c2', 'status': 'active'}
          ]),
          'm1',
          piano,
          sessionsOf,
        ) ==
        null,
    'דוגמה 2: שעה שונה',
  );
  n++;

  // 3) שיבוץ שהסתיים ⇒ null.
  _ok(
    scheduleClashText(
          db([paint], [
            {'memberId': 'm1', 'courseId': 'c2', 'status': 'ended'}
          ]),
          'm1',
          piano,
          sessionsOf,
        ) ==
        null,
    'דוגמה 3: ended מוחרג',
  );
  n++;

  // 4) שיבוץ לחוג-היעד עצמו ⇒ null.
  _ok(
    scheduleClashText(
          db([piano], [
            {'memberId': 'm1', 'courseId': 'c1', 'status': 'active'}
          ]),
          'm1',
          piano,
          sessionsOf,
        ) ==
        null,
    'דוגמה 4: חוג-היעד עצמו',
  );
  n++;

  // 5) שעות ריקות ⇒ null — שעה ריקה לא מתנגשת.
  _ok(
    scheduleClashText(
          db([
            {...paint, 'time': ''}
          ], [
            {'memberId': 'm1', 'courseId': 'c2', 'status': 'active'}
          ]),
          'm1',
          {...piano, 'time': ''},
          sessionsOf,
        ) ==
        null,
    'דוגמה 5: שעה ריקה לא מתנגשת',
  );
  n++;

  // 6) ילד אחר ⇒ null.
  _ok(
    scheduleClashText(
          db([paint], [
            {'memberId': 'm2', 'courseId': 'c2', 'status': 'active'}
          ]),
          'm1',
          piano,
          sessionsOf,
        ) ==
        null,
    'דוגמה 6: ילד אחר',
  );
  n++;

  // 7) חוג שנמחק (אין ב-db.courses) ⇒ מדולג, null.
  _ok(
    scheduleClashText(
          db([], [
            {'memberId': 'm1', 'courseId': 'c2', 'status': 'active'}
          ]),
          'm1',
          piano,
          sessionsOf,
        ) ==
        null,
    'דוגמה 7: חוג חסר מדולג',
  );
  n++;

  // 8) התנגשות דרך מערך-sessions מרובה (יום 4 = חמישי).
  final multiTarget = {
    'id': 'c1',
    'name': 'פסנתר',
    'sessions': [
      {'day': 2, 'time': '17:00', 'label': ''},
      {'day': 4, 'time': '16:30', 'label': ''},
    ],
  };
  final thursday = {'id': 'c3', 'name': 'תפירה', 'weekday': 4, 'time': '16:30'};
  _ok(
    scheduleClashText(
          db([thursday], [
            {'memberId': 'm1', 'courseId': 'c3', 'status': 'active'}
          ]),
          'm1',
          multiTarget,
          sessionsOf,
        ) ==
        '⚠ התנגשות לו"ז: כבר משובצ/ת ל"תפירה" — יום חמישי 16:30',
    'דוגמה 8: sessions מרובים',
  );
  n++;

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
      scheduleClashText(db([], []), 'm1', piano, sessionsOf) == null,
      'assert-live guard');

  print('OK scheduleClashText: $n דוגמאות-חוזה — ירוק');
}
