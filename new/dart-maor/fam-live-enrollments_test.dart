// רתמת-זהב · fam-live-enrollments — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// אם עובר: Dart ≡ JS. השקע מוזרק מקומית לכל דוגמה.
import 'fam-live-enrollments.dart';

void main() {
  // 1) חסר-סטטוס ומוקפא = חיים; ended/wait מסוננים
  final mix = <Map<String, dynamic>>[
    {'id': 1},
    {'id': 2, 'status': 'ended'},
    {'id': 3, 'status': 'wait'},
    {'id': 4, 'status': 'frozen'},
  ];
  final r1 = famLiveEnrollments({}, {}, (d, fm) => mix);
  assert(r1.length == 2, '✗ סינון ended/wait שגוי (אורך)');
  assert(r1[0]['id'] == 1 && r1[1]['id'] == 4 && r1[1]['status'] == 'frozen',
      '✗ סינון ended/wait שגוי');

  // 2) היסטוריה-בלבד ⇒ ריק
  final r2 = famLiveEnrollments({}, {}, (d, fm) => <Map<String, dynamic>>[
        {'id': 1, 'status': 'ended'},
        {'id': 2, 'status': 'ended'},
      ]);
  assert(r2.isEmpty, '✗ היסטוריה-בלבד לא רוקנה');

  // 3) ריק ⇒ ריק
  final r3 = famLiveEnrollments({}, {}, (d, fm) => <Map<String, dynamic>>[]);
  assert(r3.isEmpty, '✗ ריק לא נשאר ריק');

  // 4) השקע נקרא בדיוק פעם אחת עם (db, fam) כלשונם (אותם אובייקטים)
  final db = {'tag': 'db'};
  final fam = {'tag': 'fam'};
  var calls = 0;
  dynamic gotDb, gotFam;
  famLiveEnrollments(db, fam, (d, fm) {
    calls++;
    gotDb = d;
    gotFam = fm;
    return <Map<String, dynamic>>[];
  });
  assert(calls == 1 && identical(gotDb, db) && identical(gotFam, fam),
      '✗ השקע לא קיבל (db, fam) כלשונם פעם אחת');

  print('✓ fam-live-enrollments (Dart): 4 דוגמאות-חוזה — ירוק');
}
