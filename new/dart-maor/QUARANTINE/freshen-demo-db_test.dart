// רתמת-זהב · freshen-demo-db — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// אם עובר: Dart ≡ JS. השקע isoLocal = מימוש-המקור בזעיר-אנפין (זהה ל-.test.mjs):
// getMonth()+1 של JS ⇒ DateTime.month (כבר 1-based) בלי +1.
import 'freshen-demo-db.dart';

String _p2(int n) => n.toString().padLeft(2, '0');
// פורמט מקומי בלי הזחת-אזור-זמן (כמו date-util של maor).
String isoLocal(DateTime d) => '${d.year}-${_p2(d.month)}-${_p2(d.day)}';

void main() {
  final db = <String, dynamic>{
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

  final out = freshenDemoDb(db, '2026-08-05', '2026-08-02', isoLocal);

  // 1) חוג — הזזה 3 ימים + גלגול-שנה
  assert(out['courses'][0]['start'] == '2026-08-04',
      'start ⇒ ${out['courses'][0]['start']}');
  assert(out['courses'][0]['end'] == '2027-01-02',
      'end (גלגול-שנה) ⇒ ${out['courses'][0]['end']}');
  // 2) אירוע — גלגול-חודש
  assert(out['events'][0]['date'] == '2026-09-02',
      'event date ⇒ ${out['events'][0]['date']}');
  // 3) יום-חלוקה — date+createdAt
  assert(out['distributionDays'][0]['date'] == '2026-08-06',
      'dist date ⇒ ${out['distributionDays'][0]['date']}');
  assert(out['distributionDays'][0]['createdAt'] == '2026-08-05',
      'dist createdAt ⇒ ${out['distributionDays'][0]['createdAt']}');
  // 4) שיבוץ — ריק נשאר, enrolledAt מוזז
  assert(out['enrollments'][0]['dueDate'] == '', 'dueDate ריק השתנה');
  assert(out['enrollments'][0]['enrolledAt'] == '2026-08-04',
      'enrolledAt ⇒ ${out['enrollments'][0]['enrolledAt']}');
  // 5) דלתא 0 — אותה רפרנס
  assert(identical(freshenDemoDb(db, '2026-08-02', '2026-08-02', isoLocal), db),
      'דלתא 0 לא החזירה אותו db');
  // 6) families לא ממופה + המקור קדוש
  assert(identical(out['families'], db['families']), 'families מופה בטעות');
  assert(
      db['courses'][0]['start'] == '2026-08-01' &&
          db['events'][0]['date'] == '2026-08-30',
      'המקור השתנה');

  print('✓ freshen-demo-db: 6 דוגמאות-חוזה (10 בדיקות) — ירוק');
}
