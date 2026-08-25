// בדיקת-חוזה (רתמת-זהב) · roomsNow — מייבאת אך ורק את האטום-שלה (חוק-4).
// מתרגמת ביט-אחר-ביט את new/atoms/rooms-now.test.mjs (5 דוגמאות-החוזה):
//   1) ‏r2 מושבת מושמט — הפלט באורך 2 בסדר-db (השוואת-מערך = אורך+איבר-איבר, כלל-8).
//   2) ‏r1 תפוס ע"י c1 — ‏10:15 בתוך ‏[10:00,11:00) (slot ברירת-מחדל 60).
//   3) ‏r3 פנוי — ‏slot:30 ‏⇒ ‏09:40+30=10:10 ≤ 10:15 (הקצה פתוח).
//   4) גבולות: ‏10:00 בדיוק ⇒ תפוס (mins ≥ start); ‏11:00 בדיוק ⇒ פנוי.
//   5) ‏day אחר / מפגש בלי time ⇒ מדולגים — החדר פנוי.
// ‏=== של JS ⇒ ‏identical ב-Dart; ‏undefined ⇒ null.
// הרצה: dart run --enable-asserts new/dart-maor/rooms-now_test.dart ⇒ OK
import 'rooms-now.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // השקע (חוק-1): sessionsOf = (c) => c.sessions || []
  dynamic sessionsOf(dynamic c) {
    final s = c['sessions'];
    return s ?? [];
  }

  // יום שני 10:15 — ‏new Date('2026-08-24T10:15:00'), ‏getDay()=1
  final now = DateTime.parse('2026-08-24T10:15:00');

  final r1 = {'id': 'r1', 'active': true}; // slot ברירת-מחדל 60
  final r2 = {'id': 'r2', 'active': false}; // מושבת — לא מוחזר
  final r3 = {'id': 'r3', 'active': true, 'slot': 30}; // משבצות 30 דק׳
  final c1 = {
    'id': 'c1',
    'roomId': 'r1',
    'sessions': [
      {'day': 1, 'time': '10:00'},
    ],
  };
  final c3 = {
    'id': 'c3',
    'roomId': 'r3',
    'sessions': [
      {'day': 1, 'time': '09:40'},
    ],
  };
  final db = {
    'rooms': [r1, r2, r3],
    'courses': [c1, c3],
  };

  // 1) מושבת לא מוחזר — אורך + איבר-איבר (כלל-8), זהות-רפרנס כמו === במקור.
  final out = roomsNow(db, now, sessionsOf);
  _ok(out.length == 2, '1 אורך הפלט ≠ 2 (r2 המושבת לא הושמט?)'); n++;
  _ok(identical(out[0]['room'], r1), '1 איבר-0 אינו r1 (זהות-רפרנס)'); n++;
  _ok(identical(out[1]['room'], r3), '1 איבר-1 אינו r3 (זהות-רפרנס)'); n++;

  // 2) r1 תפוס ע"י c1 — ‏10:15 בתוך [10:00,11:00)
  _ok(identical(out[0]['busyWith'], c1), '2 r1 לא תפוס עם c1'); n++;

  // 3) r3 פנוי — slot 30: ‏09:40+30=10:10 ≤ 10:15 (undefined ⇒ null)
  _ok(out[1]['busyWith'] == null, '3 r3 לא פנוי (המשבצת נגמרה)'); n++;

  // 4) גבולות: בדיוק בתחילת המפגש = תפוס; בדיוק בסופו = פנוי
  final at10 = roomsNow(db, DateTime.parse('2026-08-24T10:00:00'), sessionsOf);
  _ok(identical(at10[0]['busyWith'], c1), '4א ‏10:00 בדיוק — r1 לא תפוס'); n++;
  final at11 = roomsNow(db, DateTime.parse('2026-08-24T11:00:00'), sessionsOf);
  _ok(at11[0]['busyWith'] == null, '4ב ‏11:00 בדיוק — r1 לא פנוי (קצה פתוח)'); n++;

  // 5) יום אחר / מפגש בלי time — מדולגים
  final db5 = {
    'rooms': [r1],
    'courses': [
      {
        'id': 'c9',
        'roomId': 'r1',
        'sessions': [
          {'day': 2, 'time': '10:00'},
          {'day': 1},
        ],
      },
    ],
  };
  final out5 = roomsNow(db5, now, sessionsOf);
  _ok(out5.length == 1, '5 אורך הפלט ≠ 1'); n++;
  _ok(out5[0]['busyWith'] == null, '5 ‏day אחר ובלי time — החדר לא פנוי'); n++;

  // assert חי (הרצה עם --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(roomsNow(db, now, sessionsOf).length == 2, 'assert-live guard');

  print('OK roomsNow: $n asserts passed');
}
