import '../dart-data-maor/inactive-room-courses-sockets.dart' as sk_inactive_room_courses;
// בדיקת-חוזה (רתמת-זהב) · inactiveRoomCourses — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/inactive-room-courses.test.mjs:
//   1) חדר-חסר rX, terms={}                    ⇒ [{course:cMissing, roomName:'חדר לא קיים'}]
//   2) terms={'entity.room':'אולם'}             ⇒ roomName='אולם לא קיים' (המונח מהשקע)
//   3) חדר r1 לא-פעיל                            ⇒ [{course:cInactive, roomName:'סטודיו ב'}]
//   4) חדר r2 פעיל                               ⇒ []
//   5) חוג שהסתיים end<iso                        ⇒ [] (גם כשחדרו לא-פעיל)
//   6) בלי-roomId + מסתיים-היום (iso≤end)         ⇒ [{course:cEndsToday, roomName:'סטודיו ב'}]
// שקע-termOf = חוזה-config של maor (cfg?.terms?.[key] ?? fallback) — מקומי לבדיקה.
// הרצה: dart run --enable-asserts new/dart-maor/inactive-room-courses_test.dart  ⇒ exit 0
import 'inactive-room-courses.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// שקע-termOf: מחקה `cfg?.terms?.[key] ?? fallback` — null/חסר ⇒ fallback.
String _termOf(dynamic cfg, String key, String fallback) {
  final terms = (cfg is Map) ? cfg['terms'] : null;
  if (terms is Map && terms[key] != null) return terms[key] as String;
  return fallback;
}

// השוואת-פלט: אורך + זהות-רפרנס-course + roomName (חוק-8 — איבר-איבר, לא join).
void _eq(String name, List<Map<String, dynamic>> got,
    List<Map<String, dynamic>> want) {
  _ok(got.length == want.length, '$name: אורך ${got.length} ≠ ${want.length}');
  for (var i = 0; i < want.length; i++) {
    _ok(identical(got[i]['course'], want[i]['course']),
        '$name[$i]: course לא אותה רפרנס');
    _ok(got[i]['roomName'] == want[i]['roomName'],
        "$name[$i]: roomName '${got[i]['roomName']}' ≠ '${want[i]['roomName']}'");
  }
}

void main() {
  var n = 0;
  const iso = '2026-08-24';
  final cMissing = {'id': 'c1', 'roomId': 'rX'};
  final cInactive = {'id': 'c2', 'roomId': 'r1'};
  final cActive = {'id': 'c3', 'roomId': 'r2'};
  final cEnded = {'id': 'c4', 'roomId': 'r1', 'end': '2026-08-01'};
  final cNoRoom = {'id': 'c5'};
  final cEndsToday = {'id': 'c6', 'roomId': 'r1', 'end': '2026-08-24'};
  final rooms = [
    {'id': 'r1', 'name': 'סטודיו ב', 'active': false},
    {'id': 'r2', 'name': 'אולם ראשי', 'active': true},
  ];

  // 1) חדר לא קיים — fallback 'חדר'
  _eq(
      'חדר-חסר',
      inactiveRoomCourses({'courses': [cMissing], 'rooms': rooms}, iso, {'terms': {}}, _termOf, sk_inactive_room_courses.inactiveRoomCourses_T),
      [{'course': cMissing, 'roomName': 'חדר לא קיים'}]);
  n++;

  // 2) מונח פר-ארגון דרך השקע
  _eq(
      'מונח-ארגוני',
      inactiveRoomCourses({'courses': [cMissing], 'rooms': rooms}, iso, {'terms': {'entity.room': 'אולם'}}, _termOf, sk_inactive_room_courses.inactiveRoomCourses_T),
      [{'course': cMissing, 'roomName': 'אולם לא קיים'}]);
  n++;

  // 3) חדר לא-פעיל — שם החדר
  _eq(
      'חדר-לא-פעיל',
      inactiveRoomCourses({'courses': [cInactive], 'rooms': rooms}, iso, {'terms': {}}, _termOf, sk_inactive_room_courses.inactiveRoomCourses_T),
      [{'course': cInactive, 'roomName': 'סטודיו ב'}]);
  n++;

  // 4) חדר פעיל — לא אזהרה
  _eq(
      'חדר-פעיל',
      inactiveRoomCourses({'courses': [cActive], 'rooms': rooms}, iso, {'terms': {}}, _termOf, sk_inactive_room_courses.inactiveRoomCourses_T),
      const []);
  n++;

  // 5) חוג שהסתיים — מדולג גם כשחדרו לא-פעיל
  _eq(
      'חוג-שהסתיים',
      inactiveRoomCourses({'courses': [cEnded], 'rooms': rooms}, iso, {'terms': {}}, _termOf, sk_inactive_room_courses.inactiveRoomCourses_T),
      const []);
  n++;

  // 6) בלי roomId — מדולג · מסתיים-היום (iso ≤ end) — נכלל
  _eq(
      'בלי-חדר+מסתיים-היום',
      inactiveRoomCourses({'courses': [cNoRoom, cEndsToday], 'rooms': rooms}, iso, {'terms': {}}, _termOf, sk_inactive_room_courses.inactiveRoomCourses_T),
      [{'course': cEndsToday, 'roomName': 'סטודיו ב'}]);
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
      inactiveRoomCourses({'courses': [cMissing], 'rooms': rooms}, iso, {'terms': {}}, _termOf, sk_inactive_room_courses.inactiveRoomCourses_T)
          .length ==
      1,
      'assert-live guard');

  print('OK inactiveRoomCourses: $n contract examples passed');
}
