// 🏅 רתמת-זהב · filterCoordinators — 6 דוגמאות-החוזה, זהות ביט-אחר-ביט לבדיקת-ה-JS
// (new/atoms/filter-coordinators.test.mjs). עובר ⇒ Dart ≡ JS (חוק-4).
// הרצה: dart run --enable-asserts new/dart-maor/filter-coordinators_test.dart ⇒ exit 0.
import 'filter-coordinators.dart';

void main() {
  // שקעים מקומיים לבדיקה (הרתמה מייבאת רק את האטום שלה)
  const TOTAL = {'c1': 300, 'c2': 500, 'c3': 0};
  const LAST = {'c1': '2026-03-01', 'c2': '2026-01-15', 'c3': ''};

  num coordinatorTotal(dynamic boxes, dynamic id) => TOTAL[id as String] as num;
  String coordinatorLastCollection(dynamic boxes, dynamic id) =>
      LAST[id as String] as String;

  List<dynamic> smartFilter(
      String qq, List<dynamic> items, List<dynamic> Function(dynamic) getTerms) {
    if (qq.isEmpty) return List<dynamic>.from(items); // עותק כש-q ריק
    return items
        .where((it) => getTerms(it).any((t) => t.toString().contains(qq)))
        .toList();
  }

  final coords = <dynamic>[
    {'id': 'c1', 'name': 'רבקה כהן', 'active': true, 'score': 5},
    {'id': 'c2', 'name': 'שרה לוי', 'active': false, 'score': 9},
    {'id': 'c3', 'name': 'לאה מזרחי', 'active': true, 'score': 7},
  ];
  final boxes = <dynamic>[];

  List<dynamic> run(String q, bool onlyActive, String sort) => filterCoordinators(
      coords, boxes, q, onlyActive, sort, smartFilter, coordinatorTotal,
      coordinatorLastCollection);

  List<dynamic> ids(List<dynamic> rows) =>
      rows.map((r) => (r as Map)['id']).toList();

  bool listEq(List<dynamic> a, List<dynamic> b) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (a[i] != b[i]) return false;
    }
    return true;
  }

  // 1 — onlyActive+name: לאה < רבקה; c2 (לא-active) נופל
  assert(listEq(ids(run('', true, 'name')), ['c3', 'c1']),
      'דוגמה 1 · onlyActive+name');
  // 2 — score יורד (9,7,5)
  assert(listEq(ids(run('', false, 'score')), ['c2', 'c3', 'c1']),
      'דוגמה 2 · score יורד');
  // 3 — total יורד (500,300,0)
  assert(listEq(ids(run('', false, 'total')), ['c2', 'c1', 'c3']),
      'דוגמה 3 · total יורד');
  // 4 — stale: מעולם-לא ('') ראשון, אחריו הישן
  assert(listEq(ids(run('', false, 'stale')), ['c3', 'c2', 'c1']),
      'דוגמה 4 · stale — מעולם-לא ראשון');
  // 5 — q=כהן (מילת-שם בנפרד היא מונח)
  assert(listEq(ids(run('כהן', false, 'name')), ['c1']),
      'דוגמה 5 · q=כהן (מילת-שם)');
  // 6 — הקלט לא השתנה
  assert(listEq(ids(coords), ['c1', 'c2', 'c3']),
      'דוגמה 6 · הקלט לא השתנה');

  print('✓ filter-coordinators (Dart): 6 דוגמאות-חוזה — ירוק · Dart ≡ JS');
}
