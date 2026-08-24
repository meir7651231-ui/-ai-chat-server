// בדיקת-חוזה (רתמת-זהב) · eligibleFamilies — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/eligible-families.test.mjs:
//   families: f1 active (m1,m2) · f2 active (m3) · f3 inactive;
//   shopAssignments: f1←p9 active['c1'] · f1←p1 active['c2'] · f2←p1 canceled['c1'].
//   1) ([], 'p9')          ⇒ ids == 'f2'    (f1 כבר משויכת-p9, f3 לא-פעילה)
//   2) ([], 'p2')          ⇒ ids == 'f1,f2' (בלי קריטריון ⇒ כל הפעילות הלא-משויכות)
//   3) (['c1','c2'], 'p2') ⇒ ids == 'f1'    (רק f1 מחזיקה שניהם באיחוד שיוכיה)
//   4) (['c3'], 'p2')      ⇒ length == 0    (איש לא מחזיק)
//   5) צורת-הפלט f1        ⇒ {famId:'f1', name:'כהן', memberIds:['m1','m2']}
// המרה: === של JS ⇒ == ב-Dart; JSON.stringify-eq ⇒ השוואת-שדות מפורשת. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/eligible-families_test.dart ⇒ exit 0
import 'eligible-families.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

String _ids(List arr) => arr.map((x) => (x as Map)['famId']).join(',');

bool _listEq(List a, List b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

void main() {
  var n = 0;

  final db = {
    'families': [
      {
        'id': 'f1',
        'name': 'כהן',
        'status': 'active',
        'members': [
          {'id': 'm1'},
          {'id': 'm2'}
        ]
      },
      {
        'id': 'f2',
        'name': 'לוי',
        'status': 'active',
        'members': [
          {'id': 'm3'}
        ]
      },
      {'id': 'f3', 'name': 'מזרחי', 'status': 'inactive', 'members': []},
    ],
    'shopAssignments': [
      {'famId': 'f1', 'productId': 'p9', 'status': 'active', 'criterionIds': ['c1']},
      {'famId': 'f1', 'productId': 'p1', 'status': 'active', 'criterionIds': ['c2']},
      {'famId': 'f2', 'productId': 'p1', 'status': 'canceled', 'criterionIds': ['c1']},
    ],
  };

  // 1) p9 ⇒ רק f2 (f1 כבר משויכת, f3 לא-פעילה).
  _ok(_ids(eligibleFamilies(db, [], 'p9')) == 'f2',
      'p9 ⇒ רק f2 (f1 כבר משויכת, f3 לא-פעילה)'); n++;

  // 2) בלי קריטריון ⇒ כל הפעילות הלא-משויכות.
  _ok(_ids(eligibleFamilies(db, [], 'p2')) == 'f1,f2',
      'בלי קריטריון ⇒ כל הפעילות הלא-משויכות'); n++;

  // 3) רק f1 מחזיקה את שני הקריטריונים (איחוד שיוכים).
  _ok(_ids(eligibleFamilies(db, ['c1', 'c2'], 'p2')) == 'f1',
      'רק f1 מחזיקה את שניהם (איחוד שיוכים)'); n++;

  // 4) קריטריון שאיש לא מחזיק ⇒ ריק.
  _ok(eligibleFamilies(db, ['c3'], 'p2').length == 0,
      'קריטריון שאיש לא מחזיק ⇒ ריק'); n++;

  // 5) צורת-הפלט {famId,name,memberIds}.
  final out = eligibleFamilies(db, [], 'p2')[0];
  _ok(
      out['famId'] == 'f1' &&
          out['name'] == 'כהן' &&
          _listEq(out['memberIds'] as List, ['m1', 'm2']),
      'צורת-הפלט {famId,name,memberIds}'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_ids(eligibleFamilies(db, [], 'p9')) == 'f2', 'assert-live guard');

  print('OK eligibleFamilies: $n asserts passed');
}
