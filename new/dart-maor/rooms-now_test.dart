// בדיקת-חוזה · roomsNow — 5 דוגמאות-המקור + הסגר כלל-2 (roomId null↔undefined).
// הרצה: dart run --enable-asserts rooms-now_test.dart

import 'rooms-now.dart';

int _fail = 0;
void chk(String name, bool cond) {
  if (!cond) {
    _fail = 1;
    print('✗ $name');
  }
}

List<dynamic> sessionsOf(dynamic c) =>
    ((c as Map)['sessions'] as List?) ?? <dynamic>[];

void main() {
  final now = DateTime(2026, 8, 24, 10, 15); // יום שני, weekday%7 == 1

  final r1 = {'id': 'r1', 'active': true}; // slot ברירת-מחדל 60
  final r2 = {'id': 'r2', 'active': false}; // מושבת — לא מוחזר
  final r3 = {'id': 'r3', 'active': true, 'slot': 30}; // משבצות 30 דק׳
  final c1 = {
    'id': 'c1',
    'roomId': 'r1',
    'sessions': [
      {'day': 1, 'time': '10:00'}
    ]
  };
  final c3 = {
    'id': 'c3',
    'roomId': 'r3',
    'sessions': [
      {'day': 1, 'time': '09:40'}
    ]
  };
  final db = {
    'rooms': [r1, r2, r3],
    'courses': [c1, c3]
  };

  // 1) מושבת לא מוחזר
  final out = roomsNow(db, now, sessionsOf);
  chk('1 שני חדרים בלבד (r2 מושבת הושמט)',
      out.length == 2 && identical(out[0]['room'], r1) && identical(out[1]['room'], r3));

  // 2) r1 תפוס ע"י c1 — 10:15 בתוך [10:00,11:00)
  chk('2 r1 תפוס עם c1', identical(out[0]['busyWith'], c1));

  // 3) r3 פנוי — slot 30: 09:40+30=10:10 ≤ 10:15
  chk('3 r3 פנוי (המשבצת נגמרה)', out[1]['busyWith'] == null);

  // 4) גבולות: בדיוק בתחילת המפגש = תפוס; בדיוק בסופו = פנוי
  final at10 = roomsNow(db, DateTime(2026, 8, 24, 10, 0), sessionsOf);
  chk('4א 10:00 בדיוק ⇒ r1 תפוס', identical(at10[0]['busyWith'], c1));
  final at11 = roomsNow(db, DateTime(2026, 8, 24, 11, 0), sessionsOf);
  chk('4ב 11:00 בדיוק ⇒ r1 פנוי (קצה פתוח)', at11[0]['busyWith'] == null);

  // 5) יום אחר / מפגש בלי time — מדולגים
  final db5 = {
    'rooms': [r1],
    'courses': [
      {
        'id': 'c9',
        'roomId': 'r1',
        'sessions': [
          {'day': 2, 'time': '10:00'},
          {'day': 1}
        ]
      }
    ]
  };
  chk('5 day אחר ובלי time ⇒ פנוי', roomsNow(db5, now, sessionsOf)[0]['busyWith'] == null);

  // 6) הסגר כלל-2: חדר בלי-id (undefined) מול חוג עם roomId:null מפורש.
  //    JS: null !== undefined ⇒ מדלג ⇒ חדר פנוי. (הבאג: Dart גולמי null==null ⇒ תפוס.)
  final roomNoId = {'active': true}; // אין מפתח 'id' ⇒ room.id === undefined
  final courseNullRoom = {
    'id': 'cN',
    'roomId': null, // roomId מפורש-null
    'sessions': [
      {'day': 1, 'time': '10:00'}
    ]
  };
  final dbBug = {
    'rooms': [roomNoId],
    'courses': [courseNullRoom]
  };
  chk('6 roomId:null מול id-חסר ⇒ פנוי (null!==undefined)',
      roomsNow(dbBug, now, sessionsOf)[0]['busyWith'] == null);

  // 6ב) ביקורת-נגד: id:null מפורש בשני הצדדים ⇒ null===null ⇒ בוחן ⇒ תפוס.
  final roomNullId = {'id': null, 'active': true};
  final dbMatch = {
    'rooms': [roomNullId],
    'courses': [courseNullRoom]
  };
  chk('6ב id:null==roomId:null ⇒ תפוס (null===null)',
      identical(roomsNow(dbMatch, now, sessionsOf)[0]['busyWith'], courseNullRoom));

  if (_fail != 0) {
    throw StateError('rooms-now: בדיקות נכשלו');
  }
  print('✓ rooms-now: 5 דוגמאות-חוזה + הסגר כלל-2 — ירוק');
}
