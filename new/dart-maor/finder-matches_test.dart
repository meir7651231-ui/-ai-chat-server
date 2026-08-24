// בדיקת-חוזה (רתמת-זהב) · finderMatches — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/finder-matches.test.mjs.
// שקע-ייחוס (כמו במקור): (db,f,k) ⇒ String(f[k] ?? '').
//   families = [{id:1,city:'צפת',status:'a'},{id:2,city:'חיפה',status:'a'},{id:3,city:'צפת',status:'b'}]
//   1) locks={}                    ⇒ 1,2,3   (locks ריק ⇒ כולן, בסדר-המקור)
//   2) locks={city:'צפת'}          ⇒ 1,3     (נעילה אחת)
//   3) locks={city:'צפת',status:'a'} ⇒ 1     (AND בין נעילות)
//   4) locks={city:'אילת'}         ⇒ []      (אין התאמה)
//   5) הפלט מכיל את אותם אובייקטים (===), לא עותקים ⇒ identical ב-Dart.
// המרה: === של JS ⇒ identical ב-Dart; String(f[k] ?? '') ⇒ (f[k] ?? '').toString().
// הרצה: dart run --enable-asserts new/dart-maor/finder-matches_test.dart ⇒ exit 0.
import 'finder-matches.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// שקע-הייחוס: ערך-הציר = השדה עצמו כמחרוזת ('' כשחסר) — מקביל ל-String(f[k] ?? '').
String _axisValue(Map<dynamic, dynamic> db, dynamic f, dynamic k) =>
    ((f as Map)[k] ?? '').toString();

// ids(r) ⇒ '1,2,3' — מקביל ל-r.map(x=>x.id).join(',').
String _ids(List<dynamic> r) => r.map((x) => (x as Map)['id']).join(',');

void main() {
  var n = 0;

  final fam1 = {'id': 1, 'city': 'צפת', 'status': 'a'};
  final fam2 = {'id': 2, 'city': 'חיפה', 'status': 'a'};
  final fam3 = {'id': 3, 'city': 'צפת', 'status': 'b'};
  final fams = [fam1, fam2, fam3];
  final db = {'families': fams};

  // 1) locks ריק ⇒ כולן, בסדר-המקור.
  _ok(_ids(finderMatches(db, {}, _axisValue)) == '1,2,3',
      'דוגמה 1: locks ריק לא החזיר את כולן'); n++;

  // 2) נעילה אחת.
  _ok(_ids(finderMatches(db, {'city': 'צפת'}, _axisValue)) == '1,3',
      'דוגמה 2: נעילת-עיר שגויה'); n++;

  // 3) AND בין נעילות.
  _ok(_ids(finderMatches(db, {'city': 'צפת', 'status': 'a'}, _axisValue)) == '1',
      'דוגמה 3: AND נשבר'); n++;

  // 4) אין התאמה.
  _ok(finderMatches(db, {'city': 'אילת'}, _axisValue).isEmpty,
      'דוגמה 4: נמצאה התאמת-שווא'); n++;

  // 5) אותם אובייקטים — לא עותקים (=== במקור ⇒ identical).
  _ok(identical(finderMatches(db, {'city': 'צפת'}, _axisValue)[0], fam1),
      'דוגמה 5: הוחזר עותק במקום רפרנס'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_ids(finderMatches(db, {}, _axisValue)) == '1,2,3', 'assert-live guard');

  print('OK finderMatches: $n asserts passed');
}
