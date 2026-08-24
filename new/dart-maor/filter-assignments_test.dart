// 🏅 רתמת-זהב · filterAssignments — 7 דוגמאות-החוזה, זהות ביט-אחר-ביט לבדיקת-ה-JS
// (new/atoms/filter-assignments.test.mjs). עובר ⇒ Dart ≡ JS (חוק-4).
// הרצה: dart run --enable-asserts new/dart-maor/filter-assignments_test.dart ⇒ exit 0.
import 'filter-assignments.dart';

void main() {
  final db = <String, dynamic>{
    'families': [
      {'id': 'f1', 'name': 'משפחת פרץ'},
      {'id': 'f2', 'name': 'משפחת גל'},
      {'id': 'f3', 'name': 'משפחת כהן'},
    ],
    'shopProducts': [
      {'id': 'p1', 'name': 'חבילת פסח'},
      {'id': 'p2', 'name': 'חבילת חורף'},
    ],
    'shopAssignments': [
      {'id': 'a1', 'famId': 'f1', 'productId': 'p1', 'status': 'active', 'since': '2026-01-01'},
      {'id': 'a2', 'famId': 'f2', 'productId': 'p1', 'status': 'active', 'since': '2026-03-01'},
      {'id': 'a3', 'famId': 'f3', 'productId': 'p2', 'status': 'done', 'since': '2026-02-01'},
    ],
  };

  // שקעים מקומיים לבדיקה (הרתמה מייבאת רק את האטום שלה)
  const PEND = {'a1': 1, 'a2': 2, 'a3': 0};
  const PROG = {'a1': 0.5, 'a2': 0.0, 'a3': 1.0};
  final HOLS = <dynamic>[{'iso': '2026-04-02', 'name': 'פסח'}];

  final upcalls = <List<dynamic>>[];
  final pendHolidays = <dynamic>[];

  List<dynamic> upcomingHolidays(String from, int days) {
    upcalls.add([from, days]);
    return HOLS;
  }

  num pendingCount(dynamic d, dynamic a, dynamic holidays) {
    pendHolidays.add(holidays);
    return PEND[(a as Map)['id']] as num;
  }

  num progressOf(dynamic d, dynamic a, dynamic holidays) =>
      PROG[(a as Map)['id']] as num;

  List<dynamic> smartFilter(
      String qq, List<dynamic> items, List<dynamic> Function(dynamic) getTerms) {
    if (qq.isEmpty) return List<dynamic>.from(items); // עותק כש-q ריק
    return items
        .where((it) => getTerms(it).any((t) => t.toString().contains(qq)))
        .toList();
  }

  List<dynamic> run(String q, String status, bool pendingOnly, String productId,
          String sort, String? todayIso) =>
      filterAssignments(db, q, status, pendingOnly, productId, sort, todayIso,
          upcomingHolidays, 30, pendingCount, smartFilter, progressOf);

  List<dynamic> ids(List<dynamic> rows) =>
      rows.map((r) => (r as Map)['id']).toList();

  bool listEq(List<dynamic> a, List<dynamic> b) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (a[i] != b[i]) return false;
    }
    return true;
  }

  // 1 — sort='pending': ממתינים לפי since עולה, ממומש-כולו אחרון
  assert(listEq(ids(run('', '', false, '', 'pending', null)), ['a1', 'a2', 'a3']),
      'דוגמה 1 · pending');
  // בלי todayIso ⇒ holidays=null מושחל
  assert(pendHolidays.every((h) => h == null), 'דוגמה 1 · holidays אמור להיות null');

  // 2 — סינון סטטוס
  assert(listEq(ids(run('', 'active', false, '', 'pending', null)), ['a1', 'a2']),
      'דוגמה 2 · status');
  // 3 — סינון חבילה
  assert(listEq(ids(run('', '', false, 'p2', 'pending', null)), ['a3']),
      'דוגמה 3 · productId');
  // 4 — pendingOnly
  assert(listEq(ids(run('', '', true, '', 'pending', null)), ['a1', 'a2']),
      'דוגמה 4 · pendingOnly');
  // 5 — sort='name' עברית עולה
  assert(listEq(ids(run('', '', false, '', 'name', null)), ['a2', 'a3', 'a1']),
      'דוגמה 5 · name');
  // 6 — sort='progress' עולה
  assert(listEq(ids(run('', '', false, '', 'progress', null)), ['a2', 'a1', 'a3']),
      'דוגמה 6 · progress');
  // 7 — q על שם-החבילה + השחלת-החגים כלשונה
  assert(listEq(ids(run('חורף', '', false, '', 'pending', null)), ['a3']),
      'דוגמה 7 · q=חורף');

  upcalls.clear();
  pendHolidays.clear();
  assert(
      listEq(ids(run('', '', true, '', 'pending', '2026-03-20')), ['a1', 'a2']),
      'דוגמה 7 · pendingOnly עם todayIso');
  assert(upcalls.length == 1 && upcalls[0][0] == '2026-03-20' && upcalls[0][1] == 30,
      'דוגמה 7 · קריאת upcomingHolidays');
  assert(pendHolidays.isNotEmpty && pendHolidays.every((h) => identical(h, HOLS)),
      'דוגמה 7 · holidays לא הושחל כלשונו');

  print('✓ filter-assignments (Dart): 7 דוגמאות-חוזה — ירוק · Dart ≡ JS');
}
