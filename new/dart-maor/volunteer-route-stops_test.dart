// בדיקת-חוזה (רתמת-זהב) · volunteerRouteStops — מייבאת אך ורק את האטום-שלה (חוק-4).
// כל 4 דוגמאות-החוזה + ה-db זהים ביט-אחר-ביט למקור new/atoms/volunteer-route-stops.test.mjs:
//   (d1,v1) ⇒ ['הרצל 1, צפת','ירושלים','הבנים 3']  (טרים+סינון-ריקים; f4 ו-ghost מדולגים)
//   (d1,v2) ⇒ ['עצירה של v2 בלבד']                 (מסירות של מתנדב אחר לא דולפות)
//   (d2,v1) ⇒ ['הרצל 1, צפת']                       (סינון גם לפי יום)
//   (d3,v1) ⇒ []                                     (אין מסירות ⇒ ריק)
// השוואת-מערכים: אורך + איבר-איבר (כלל-8 — לעולם לא join). כשל ⇒ StateError.
// הרצה: dart run --enable-asserts new/dart-maor/volunteer-route-stops_test.dart ⇒ OK
import 'volunteer-route-stops.dart';

void _eqList(String name, List got, List want) {
  if (got.length != want.length) {
    throw StateError('FAIL $name: אורך ${got.length} ≠ ${want.length} · got=$got');
  }
  for (var i = 0; i < want.length; i++) {
    if (got[i] != want[i]) {
      throw StateError("FAIL $name[$i]: '${got[i]}' ≠ '${want[i]}'");
    }
  }
}

void main() {
  final db = {
    'deliveries': [
      {'dayId': 'd1', 'volunteerId': 'v1', 'familyId': 'f1'},
      {'dayId': 'd1', 'volunteerId': 'v1', 'familyId': 'f2'},
      {'dayId': 'd1', 'volunteerId': 'v1', 'familyId': 'f3'},
      {'dayId': 'd1', 'volunteerId': 'v1', 'familyId': 'f4'},
      {'dayId': 'd1', 'volunteerId': 'v1', 'familyId': 'ghost'},
      {'dayId': 'd1', 'volunteerId': 'v2', 'familyId': 'f9'},
      {'dayId': 'd2', 'volunteerId': 'v1', 'familyId': 'f1'},
    ],
    'families': [
      {'id': 'f1', 'address': ' הרצל 1 ', 'city': 'צפת'},
      {'id': 'f2', 'address': '', 'city': 'ירושלים'},
      {'id': 'f3', 'address': 'הבנים 3', 'city': '  '},
      {'id': 'f4', 'address': '', 'city': ''},
      {'id': 'f9', 'address': 'עצירה של v2 בלבד', 'city': ''},
    ],
  };

  var n = 0;

  // 1) (d1,v1) — טרים לכתובת-הראשונה, סינון-חלק-ריק ב-f2/f3, דילוג f4 (ריק-כולו) ו-ghost.
  _eqList('(d1,v1)', volunteerRouteStops(db, 'd1', 'v1'),
      ['הרצל 1, צפת', 'ירושלים', 'הבנים 3']);
  n++;

  // 2) (d1,v2) — רק המסירה של v2; המסירות של v1 לא דולפות.
  _eqList('(d1,v2)', volunteerRouteStops(db, 'd1', 'v2'), ['עצירה של v2 בלבד']);
  n++;

  // 3) (d2,v1) — סינון גם לפי יום: רק f1 של d2.
  _eqList('(d2,v1)', volunteerRouteStops(db, 'd2', 'v1'), ['הרצל 1, צפת']);
  n++;

  // 4) (d3,v1) — אין מסירות ביום d3 ⇒ רשימה ריקה.
  _eqList('(d3,v1)', volunteerRouteStops(db, 'd3', 'v1'), <String>[]);
  n++;

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(volunteerRouteStops(db, 'd3', 'v1').isEmpty, 'assert-live guard');

  print('OK volunteerRouteStops: $n דוגמאות-חוזה — ירוק');
}
