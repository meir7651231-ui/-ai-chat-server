// 🧪 הוכחת-חוצה-שפות · reenroll (Dart) — מריצה את reenroll.dart על אותם קלטים/WANT
// כמו new/boxes/reenroll.test.mjs. ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסה, פלט זהה-ביט.
// (מגני-המקור-JS + מגן-ההכרעה של reenroll.test.mjs תלויי-מקור-JS ⇒ מדולגים כאן — הם על קובץ ה-mjs.)
import 'dart:convert';
import 'reenroll.dart' as R;

int n = 0, fails = 0;
void eq(String name, Object? got, Object? want) {
  final g = jsonEncode(got), w = jsonEncode(want);
  if (g != w) {
    print('✗ $name: got $g want $w');
    fails++;
  } else {
    n++;
  }
}
void ok(String name, bool c) {
  if (!c) {
    print('✗ $name');
    fails++;
  } else {
    n++;
  }
}

void main() {
  // 1) academicYearLabel — ספט׳ ⇒ שנה-נוכחית · לפני-ספט׳ ⇒ שנה-קודמת
  eq('academicYearLabel ספט׳', R.academicYearLabel('2026-09-01'), '2026/27');
  eq('academicYearLabel יוני', R.academicYearLabel('2026-06-01'), '2025/26');
  eq('academicYearLabel ינואר', R.academicYearLabel('2027-01-15'), '2026/27');

  // 2) nextYearDates — שומר יום/חודש
  eq('nextYearDates', R.nextYearDates('2026-09-01', '2027-06-30'),
      {'start': '2027-09-01', 'end': '2028-06-30'});

  // 3) renewOf / 4) isRenewed
  eq('renewOf yes', R.renewOf({'renew': 'yes'}), 'yes');
  eq('renewOf חסר', R.renewOf({}), '');
  eq('isRenewed true', R.isRenewed({'renewedToId': 'x'}), true);
  eq('isRenewed false', R.isRenewed({}), false);

  // 5) enrollSummary — כספים+נוכחות; lastPresent=הגדול-לקסיקוגרפית
  final e5 = <String, dynamic>{
    'status': 'active',
    'presents': ['2026-01-05', '2026-01-01'],
    'absences': [
      {'noshow': true},
      <String, dynamic>{}
    ],
    'totalDue': 200,
    'payments': [
      {'amount': 120}
    ],
  };
  eq('enrollSummary', R.enrollSummary(e5), {
    'presents': 2,
    'absences': 2,
    'noshow': 1,
    'balance': 80,
    'paid': 120,
    'statusLabel': 'פעיל',
    'lastPresent': '2026-01-05',
  });
  // קצה: שדות חסרים לגמרי
  eq('enrollSummary ריק', R.enrollSummary({'status': 'wait'}), {
    'presents': 0,
    'absences': 0,
    'noshow': 0,
    'balance': 0,
    'paid': 0,
    'statusLabel': 'רשימת-המתנה',
    'lastPresent': '',
  });

  // 6) buildReenrollRows — מיון עברי + findMember + סינונים
  final db = <String, Object?>{
    'families': [
      {'id': 'fa', 'name': 'כהן', 'members': [{'id': 'm1', 'first': 'בני'}, {'id': 'm2', 'first': 'אבי'}]},
      {'id': 'fb', 'name': 'לוי', 'members': [{'id': 'm3', 'first': 'גדי'}]},
    ],
    'courses': [{'id': 'c1', 'name': 'גיטרה', 'start': '2026-09-01', 'end': '2027-06-30', 'year': '2026/27'}],
    'enrollments': [
      {'id': 'e1', 'memberId': 'm1', 'courseId': 'c1', 'renew': 'yes', 'status': 'active', 'presents': [], 'absences': [], 'payments': [], 'totalDue': 0},
      {'id': 'e2', 'memberId': 'm2', 'courseId': 'c1', 'renew': 'no', 'status': 'active', 'presents': [], 'absences': [], 'payments': [], 'totalDue': 0},
      {'id': 'e3', 'memberId': 'm3', 'courseId': 'c1', 'status': 'active', 'renewedToId': 'zz', 'presents': [], 'absences': [], 'payments': [], 'totalDue': 0},
    ],
  };
  final rows = R.buildReenrollRows(db);
  eq('buildReenrollRows מיון-עברי', rows.map((r) => r['memberName']).toList(), ['אבי', 'בני', 'גדי']);
  eq('buildReenrollRows findMember', rows.map((r) => r['familyName']).toList(), ['כהן', 'כהן', 'לוי']);
  eq('buildReenrollRows renewed', rows[2]['renewed'], true);
  // undecided ⇒ רק גדי (e3, בלי שדה renew) · לא-קיים ⇒ ריק
  eq('filter undecided',
      R.buildReenrollRows(db, {'decision': 'undecided'}).map((r) => r['memberName']).toList(), ['גדי']);
  eq('filter yes',
      R.buildReenrollRows(db, {'decision': 'yes'}).map((r) => r['memberName']).toList(), ['בני']);
  // includeRenewed:false ⇒ מסיר את e3
  eq('filter includeRenewed',
      R.buildReenrollRows(db, {'includeRenewed': false}).map((r) => (r['e'] as Map)['id']).toList(), ['e2', 'e1']);
  // q רב-מילתי
  eq('filter q רב-מילתי',
      R.buildReenrollRows(db, {'q': 'בני כהן'}).map((r) => r['memberName']).toList(), ['בני']);
  eq('filter q שולל', R.buildReenrollRows(db, {'q': 'בני לוי'}).length, 0);

  // 7) reenrollCounts
  eq('reenrollCounts', R.reenrollCounts(rows),
      {'total': 3, 'yes': 1, 'no': 1, 'hold': 0, 'undecided': 1, 'renewed': 1});

  // 8) renewTargets — yes && !renewed
  eq('renewTargets', R.renewTargets(rows).map((r) => r['e']['id']).toList(), ['e1']);

  // 9) freshNextYearEnrollment — איפוס-היסטוריה, שמירת-תמחור
  final src9 = <String, Object?>{
    'id': 'old', 'memberId': 'm1', 'courseId': 'c1', 'plan': 'punch', 'purchased': 10, 'used': 4,
    'group': 'ג1', 'absences': [{}], 'payments': [{'amount': 50}], 'totalDue': 300, 'dueDate': '2026-01-01',
    'status': 'ended', 'note': 'x', 'enrolledAt': '2025-09-01', 'freq': 1, 'tier': 'B',
  };
  eq('freshNextYearEnrollment', R.freshNextYearEnrollment(src9, 'c2', 'new1', '2026-08-24'), {
    'id': 'new1', 'memberId': 'm1', 'courseId': 'c2', 'plan': 'punch', 'purchased': 0, 'used': 0, 'group': 'ג1',
    'absences': [], 'payments': [], 'totalDue': 300, 'dueDate': '', 'status': 'active', 'note': '',
    'enrolledAt': '2026-08-24', 'freq': 1, 'tier': 'B',
  });
  eq('freshNextYearEnrollment groupOverride',
      R.freshNextYearEnrollment(src9, 'c2', 'new2', '2026-08-24', 'ג9')['group'], 'ג9');

  // 10) nextYearCourseDraft
  eq('nextYearCourseDraft',
      R.nextYearCourseDraft({'id': 'c1', 'name': 'גיטרה', 'start': '2026-09-01', 'end': '2027-06-30', 'room': 'A'}, 'c2'),
      {'id': 'c2', 'name': 'גיטרה', 'start': '2027-09-01', 'end': '2028-06-30', 'room': 'A', 'year': '2027/28', 'prevYearId': 'c1'});

  // 11) studentHistory — מהחדש-לישן, fromRenewal/renewedForward
  final dbH = <String, Object?>{
    'families': [{'id': 'fa', 'name': 'כהן', 'members': [{'id': 'm1', 'first': 'בני'}]}],
    'courses': [
      {'id': 'cA', 'name': 'ישן', 'start': '2024-09-01', 'end': '2025-06-30', 'year': '2024/25'},
      {'id': 'cB', 'name': 'חדש', 'start': '2025-09-01', 'end': '2026-06-30', 'year': '2025/26'},
    ],
    'enrollments': [
      {'id': 'h1', 'memberId': 'm1', 'courseId': 'cA', 'status': 'ended', 'renewedToId': 'h2', 'enrolledAt': '2024-09-01', 'presents': [], 'absences': [], 'payments': [], 'totalDue': 0},
      {'id': 'h2', 'memberId': 'm1', 'courseId': 'cB', 'status': 'active', 'enrolledAt': '2025-09-01', 'presents': [], 'absences': [], 'payments': [], 'totalDue': 0},
    ],
  };
  final hist = R.studentHistory(dbH, 'm1');
  eq('studentHistory מיון', hist.map((h) => h['courseName']).toList(), ['חדש', 'ישן']);
  eq('studentHistory חדש', [hist[0]['fromRenewal'], hist[0]['renewedForward']], [true, false]);
  eq('studentHistory ישן', [hist[1]['fromRenewal'], hist[1]['renewedForward']], [false, true]);

  // 12) reenrollCsvRows — כותרת + decWord
  final csv = R.reenrollCsvRows(rows);
  eq('csv כותרת', csv[0],
      ['תלמיד/ה', 'משפחה', 'חוג', 'נוכחות', 'חיסורים', 'יתרה ₪', 'סטטוס', 'החלטה', 'נרשם לשנה הבאה', 'הערה']);
  // ממויין עברי: אבי(no) · בני(yes) · גדי(renewed/undecided)
  eq('csv decWord no', csv[1][7], 'לא ממשיך');
  eq('csv decWord yes', csv[2][7], 'ממשיך');
  eq('csv renewed', csv[3][8], 'כן');
  eq('csv אורך', csv.length, 4);

  // 13) reenrollListText / studentHistoryText
  final lt = R.reenrollListText(rows.cast<Map<String, dynamic>>()).split('\n');
  ok('listText ✓נרשם', lt.any((l) => l.contains('✓נרשם')));
  ok('listText לא ממשיך', lt.any((l) => l.contains('לא ממשיך')));
  eq('studentHistoryText שורות', R.studentHistoryText(hist).split('\n').length, 2);

  if (fails > 0) {
    print('❌ קופסת-reenroll (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('reenroll dart proof failed');
  }
  print('✓ קופסת-reenroll (Dart): $n טענות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
