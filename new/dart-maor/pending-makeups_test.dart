// בדיקת-חוזה (רתמת-זהב) · pendingMakeups — מייבאת אך ורק את האטום-שלה (חוק-4).
// 5 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/pending-makeups.test.mjs:
//   1) מיון לא-מתוזמן-קודם · 2) makeup:false מדולג · 3) ended/wait מדולגים ·
//   4) סינון-פר-חוג + מיון-תאריך · 5) שדות-הפריט (makeupDate חסר ⇒ null ≡ undefined).
// המרה: undefined של JS ⇒ null ב-Dart. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/pending-makeups_test.dart ⇒ exit 0
import 'pending-makeups.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  final e1 = {
    'id': 'e1', 'memberId': 'm1', 'courseId': 'c1', 'status': 'active',
    'absences': [
      {'date': '2026-03-01', 'reason': 'מחלה', 'makeup': true},
      {'date': '2026-02-01', 'reason': 'טיול', 'makeup': false},
    ],
  };
  final e2 = {
    'id': 'e2', 'memberId': 'm2', 'courseId': 'c2', 'status': 'active',
    'absences': [
      {'date': '2026-01-05', 'reason': 'חג', 'makeup': true, 'makeupDate': '2026-04-01'},
    ],
  };
  final e3 = {
    'id': 'e3', 'memberId': 'm3', 'courseId': 'c1', 'status': 'ended',
    'absences': [
      {'date': '2026-01-01', 'reason': 'x', 'makeup': true},
    ],
  };
  final e4 = {
    'id': 'e4', 'memberId': 'm4', 'courseId': 'c1', 'status': 'wait',
    'absences': [
      {'date': '2026-01-02', 'reason': 'y', 'makeup': true},
    ],
  };
  final e5 = {
    'id': 'e5', 'memberId': 'm5', 'courseId': 'c1', 'status': 'active',
    'absences': [
      {'date': '2026-02-10', 'reason': 'אירוע', 'makeup': true},
    ],
  };

  // 1+2+3: מיון לא-מתוזמן-קודם, makeup:false מדולג, ended/wait מדולגים.
  final r1 = pendingMakeups([e1, e2, e3, e4]);
  _ok(r1.length == 2, 'r1.length'); n++;
  _ok(r1[0]['enrollmentId'] == 'e1', 'r1[0]=e1'); n++;
  _ok(r1[1]['enrollmentId'] == 'e2', 'r1[1]=e2'); n++;
  _ok(r1[1]['makeupDate'] == '2026-04-01', 'r1[1].makeupDate'); n++;
  _ok(!r1.any((x) => x['date'] == '2026-02-01'), 'makeup:false נכלל'); n++;
  _ok(!r1.any((x) => x['enrollmentId'] == 'e3' || x['enrollmentId'] == 'e4'),
      'ended/wait נכללו'); n++;

  // 4: סינון פר-חוג + מיון-תאריך בתוך הלא-מתוזמנים.
  final r2 = pendingMakeups([e1, e2, e5], 'c1');
  _ok(r2.length == 2, 'r2.length'); n++;
  _ok(r2[0]['enrollmentId'] == 'e5', 'r2[0]=e5'); n++;
  _ok(r2[1]['enrollmentId'] == 'e1', 'r2[1]=e1'); n++;

  // 5: שדות-הפריט (makeupDate חסר ⇒ null ≡ undefined של JS).
  final it = r2[1];
  _ok(it['memberId'] == 'm1', 'memberId'); n++;
  _ok(it['courseId'] == 'c1', 'courseId'); n++;
  _ok(it['date'] == '2026-03-01', 'date'); n++;
  _ok(it['reason'] == 'מחלה', 'reason'); n++;
  _ok(it['makeupDate'] == null, 'makeupDate ≠ undefined'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(pendingMakeups([e1, e2, e3, e4]).length == 2, 'assert-live guard');

  print('OK pendingMakeups: $n asserts passed');
}
