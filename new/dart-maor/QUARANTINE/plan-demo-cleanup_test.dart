import '../dart-data-maor/plan-demo-cleanup.dart';
// רתמת-זהב · plan-demo-cleanup — אותן 10 דוגמאות-חוזה בדיוק
// מ-new/atoms/plan-demo-cleanup.test.mjs. עובר ⇒ Dart ≡ JS.
// הרצה: dart run --enable-asserts plan-demo-cleanup_test.dart
import 'plan-demo-cleanup.dart';

void main() {
  var f = 0;
  void ok(bool cond, String msg) {
    if (!cond) {
      print('✗ $msg');
      f = 1;
    }
  }

  final famDemo = {
    'id': 'f1',
    'name': 'כהן',
    'father': 'אהרן',
    'mother': 'בתיה',
    'phone': '0501111111',
    'phone2': '',
    'city': 'צפת',
    'address': 'רח 1',
    'email': 'k@x.co',
    'members': [
      {'id': 'm1'}
    ],
  };
  final famReal = {
    'id': 'f2',
    'name': 'לוי',
    'father': 'דוד',
    'mother': 'רות',
    'phone': '0502222222',
    'phone2': '',
    'city': 'חיפה',
    'address': 'רח 2',
    'email': 'l@x.co',
    'members': [
      {'id': 'm9'}
    ],
  };
  final crsDemo = {
    'id': 'c1',
    'name': 'ציור',
    'description': 'חוג ציור',
    'price': 100,
    'price1': 0,
    'price2': 0
  };
  final crsReal = {
    'id': 'c2',
    'name': 'נגרות',
    'description': '',
    'price': 200,
    'price1': 0,
    'price2': 0
  };
  final rooms = [
    {'id': 'r1', 'name': 'חדר אמת', 'location': '', 'cap': 10}
  ];
  final db = {
    'families': [famDemo, famReal],
    'courses': [crsDemo, crsReal],
    'enrollments': [
      {'id': 'e1', 'memberId': 'm1', 'courseId': 'c2'},
      {'id': 'e2', 'memberId': 'm9', 'courseId': 'c1'},
      {'id': 'e3', 'memberId': 'm9', 'courseId': 'c2'},
    ],
    'rooms': rooms,
  };
  // דמו: אותם שדות-זיהוי, id שונה ובלי members — טביעת-האצבע תופסת בכל-זאת:
  final demoDb = {
    'families': [
      {...famDemo, 'id': 'demo9', 'members': null}
    ],
    'courses': [
      {...crsDemo, 'id': 'demoC'}
    ],
  };

  final r = planDemoCleanup(db, demoDb, fpFields: kFpFields);
  final removed = r['removed'] as Map;
  final cleaned = r['cleaned'] as Map;

  final remFam = removed['families'] as Map;
  ok(remFam['count'] == 1 && _listEq(remFam['names'] as List, ['כהן']),
      'removed.families: $remFam');
  final remCrs = removed['courses'] as Map;
  ok(remCrs['count'] == 1 && (remCrs['names'] as List)[0] == 'ציור',
      'removed.courses: $remCrs');
  final remEnr = removed['enrollments'] as Map;
  ok(remEnr['count'] == 2,
      'מפל-שיבוצים: count=2 (חבר-דמו m1 + חוג-דמו c1), בפועל $remEnr');
  ok(r['total'] == 4, "total=4, בפועל ${r['total']}");
  final cFam = cleaned['families'] as List;
  ok(cFam.length == 1 && (cFam[0] as Map)['id'] == 'f2', 'cleaned.families=[f2]');
  final cEnr = cleaned['enrollments'] as List;
  ok(cEnr.length == 1 && (cEnr[0] as Map)['id'] == 'e3',
      'cleaned.enrollments=[e3]');
  ok(identical(cleaned['rooms'], db['rooms']), 'ישות בלי דמו ⇒ אותה הפניה');
  ok((db['families'] as List).length == 2 &&
          (db['enrollments'] as List).length == 3,
      'db המקורי לא שונה (אימוטביליות)');

  // demoDb ריק ⇒ אפס הסרות:
  final r2 = planDemoCleanup(db, {}, fpFields: kFpFields);
  ok(r2['total'] == 0 && (r2['removed'] as Map).isEmpty,
      'demoDb ריק ⇒ total=0, removed={}');

  if (f != 0) throw StateError('plan-demo-cleanup: סטייה מהמקור');
  print('✓ plan-demo-cleanup: 10 דוגמאות-חוזה — ירוק');
}

bool _listEq(List a, List b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}
