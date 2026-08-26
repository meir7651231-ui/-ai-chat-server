// בדיקת-זהב · freshen-demo-db — מיישרת ל-freshen-demo-db.test.mjs (6 דוגמאות/10 בדיקות)
// + ratchet-הסגר (חודש-13/יום-פסול): V8 דוחה חודש∉[1,12] ויום∉[1,31] כ-Invalid ⇒
// shift מחזיר iso כמות-שהוא. הפורט השבור (DateTime.tryParse) נירמל אותם והזיז תאריך-פסול.
// הרצה: dart run --enable-asserts freshen-demo-db_test.dart

import 'freshen-demo-db.dart';

int _f = 0;
void ok(bool cond, String msg) {
  if (!cond) {
    print('✗ ' + msg);
    _f = 1;
  }
}

// שקע isoLocal — פורמט מקומי בלי הזחת-אזור-זמן (כמו date-util של maor)
String _p2(int n) => n.toString().padLeft(2, '0');
String isoLocal(DateTime d) =>
    '${d.year}-${_p2(d.month)}-${_p2(d.day)}';

Map<String, dynamic> _mkDb() => {
      'families': [
        {'id': 'f1', 'birth': '1990-01-01'}
      ],
      'courses': [
        {'id': 'c1', 'start': '2026-08-01', 'end': '2026-12-30'}
      ],
      'events': [
        {'id': 'ev1', 'date': '2026-08-30'}
      ],
      'distributionDays': [
        {'id': 'd1', 'date': '2026-08-03', 'createdAt': '2026-08-02'}
      ],
      'enrollments': [
        {'id': 'e1', 'dueDate': '', 'enrolledAt': '2026-08-01'}
      ],
    };

void main() {
  final db = _mkDb();
  final out = freshenDemoDb(db, '2026-08-05', '2026-08-02', isoLocal);

  final courses = out['courses'] as List;
  final events = out['events'] as List;
  final dist = out['distributionDays'] as List;
  final enr = out['enrollments'] as List;

  // 1) חוג — הזזה 3 ימים + גלגול-שנה
  ok(courses[0]['start'] == '2026-08-04', 'start ⇒ ${courses[0]['start']}');
  ok(courses[0]['end'] == '2027-01-02',
      'end (גלגול-שנה) ⇒ ${courses[0]['end']}');
  // 2) אירוע — גלגול-חודש
  ok(events[0]['date'] == '2026-09-02', 'event date ⇒ ${events[0]['date']}');
  // 3) יום-חלוקה — date+createdAt
  ok(dist[0]['date'] == '2026-08-06', 'dist date ⇒ ${dist[0]['date']}');
  ok(dist[0]['createdAt'] == '2026-08-05',
      'dist createdAt ⇒ ${dist[0]['createdAt']}');
  // 4) שיבוץ — ריק נשאר, enrolledAt מוזז
  ok(enr[0]['dueDate'] == '', 'dueDate ריק השתנה');
  ok(enr[0]['enrolledAt'] == '2026-08-04',
      'enrolledAt ⇒ ${enr[0]['enrolledAt']}');
  // 5) דלתא 0 — אותה רפרנס
  ok(identical(freshenDemoDb(db, '2026-08-02', '2026-08-02', isoLocal), db),
      'דלתא 0 לא החזירה אותו db');
  // 6) families לא ממופה + המקור קדוש
  ok(identical(out['families'], db['families']), 'families מופה בטעות');
  ok((db['courses'] as List)[0]['start'] == '2026-08-01' &&
      (db['events'] as List)[0]['date'] == '2026-08-30', 'המקור השתנה');

  // === ratchet-הסגר: חודש-13/יום-פסול (משפחת גלישת-תאריך, כלל-4) ===
  // הבאג: DateTime.tryParse נירמל '2026-13-45' ⇒ 2027-02-14 והזיז; V8 = Invalid ⇒ iso.
  final bad = {
    'families': [],
    'courses': [
      {'id': 'cbad', 'start': '2026-13-45', 'end': '2026-00-10'},
      {'id': 'cbad2', 'start': '2026-01-32', 'end': '2026-12-30'},
    ],
    'events': [
      {'id': 'evf30', 'date': '2026-02-30'}, // V8 מגלגל: Feb 30 ⇒ Mar 2
    ],
    'distributionDays': [],
    'enrollments': [],
  };
  final bo = freshenDemoDb(bad, '2026-08-05', '2026-08-02', isoLocal); // delta=3
  final bc = bo['courses'] as List;
  final be = bo['events'] as List;
  // חודש 13/00/יום 32 — פסולים ב-V8 ⇒ נשארים כמות-שהם (לא מוזזים)
  ok(bc[0]['start'] == '2026-13-45', 'חודש-13 הוזז בטעות ⇒ ${bc[0]['start']}');
  ok(bc[0]['end'] == '2026-00-10', 'חודש-00 הוזז בטעות ⇒ ${bc[0]['end']}');
  ok(bc[1]['start'] == '2026-01-32', 'יום-32 הוזז בטעות ⇒ ${bc[1]['start']}');
  // חוקי לצד הפסול — עדיין מוזז (גלגול-שנה)
  ok(bc[1]['end'] == '2027-01-02', 'תקין לצד פסול ⇒ ${bc[1]['end']}');
  // Feb 30 — V8 מגלגל ל-Mar 2, ואז +3 = Mar 5
  ok(be[0]['date'] == '2026-03-05', 'Feb30 (גלגול-יום) +3 ⇒ ${be[0]['date']}');

  // עוגן/היום פסולים ⇒ delta 0 ⇒ אותו db (JS: isNaN ⇒ 0)
  ok(identical(freshenDemoDb(db, '2026-13-01', '2026-08-02', isoLocal), db),
      'עוגן/היום פסול לא נתן delta 0');

  if (_f != 0) {
    throw StateError('freshen-demo-db: בדיקות נכשלו');
  }
  print('✓ freshen-demo-db: 6 דוגמאות-חוזה + ratchet חודש-13 — ירוק');
}
