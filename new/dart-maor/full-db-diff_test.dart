// בדיקת-חוזה (רתמת-זהב) · fullDbDiff — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/full-db-diff.test.mjs:
//   cols=['families','courses'] · metaOf=(db)=>{'orgName':db['orgName']}
//   db={orgName:'מאור', families:[{id:'f1',name:'לוי'},{id:'f2'}], courses:[{id:'c1'}]}
//   ⇒ 3 sets בסדר אוספים-ואז-פריטים · data=אותה רפרנס · deletes=[] · meta={orgName:'מאור'}
//   וכן db ריק-ישויות ⇒ sets ריק, meta עדיין נבנה.
// המרה: === של JS ⇒ identical ב-Dart; JSON.stringify(meta) ⇒ השוואת-שדות. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/full-db-diff_test.dart  ⇒ exit 0
import 'full-db-diff.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  final cols = <String>['families', 'courses'];
  dynamic metaOf(Map<String, dynamic> db) => {'orgName': db['orgName']};

  final db = <String, dynamic>{
    'orgName': 'מאור',
    'families': [
      {'id': 'f1', 'name': 'לוי'},
      {'id': 'f2'},
    ],
    'courses': [
      {'id': 'c1'},
    ],
  };

  final d = fullDbDiff(db, cols, metaOf);
  final sets = d['sets'] as List;

  // 1) שלושה sets בסדר אוספים-ואז-פריטים
  _ok(sets.length == 3, 'sets.length ⇒ ${sets.length}'); n++;
  _ok(sets[0]['col'] == 'families' && sets[0]['id'] == 'f1', 'sets[0] שגוי'); n++;
  _ok(sets[1]['col'] == 'families' && sets[1]['id'] == 'f2', 'sets[1] שגוי'); n++;
  _ok(sets[2]['col'] == 'courses' && sets[2]['id'] == 'c1', 'sets[2] שגוי'); n++;

  // 2) data = אותה רפרנס (=== של JS ⇒ identical)
  _ok(identical(sets[0]['data'], (db['families'] as List)[0]),
      'data אינו אותה רפרנס'); n++;

  // 3) deletes ריק תמיד
  final deletes = d['deletes'];
  _ok(deletes is List && (deletes as List).isEmpty, 'deletes אינו []'); n++;

  // 4) meta דרך השקע — JSON.stringify ⇒ השוואת-שדות ({orgName:'מאור'})
  final meta = d['meta'] as Map;
  _ok(meta.length == 1 && meta['orgName'] == 'מאור',
      'meta ⇒ $meta'); n++;

  // 5) אוספים ריקים — sets ריק, meta עדיין נבנה
  final d2 = fullDbDiff(
    <String, dynamic>{'orgName': 'x', 'families': [], 'courses': []},
    cols,
    metaOf,
  );
  _ok((d2['sets'] as List).isEmpty && (d2['meta'] as Map)['orgName'] == 'x',
      'db ריק-ישויות טופל שגוי'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(identical(sets[0]['data'], (db['families'] as List)[0]),
      'assert-live guard');

  print('OK fullDbDiff: $n asserts passed (5 דוגמאות-חוזה)');
}
