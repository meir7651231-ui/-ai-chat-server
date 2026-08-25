// בדיקת-חוזה (רתמת-זהב) · scheduleTasks — מייבאת אך ורק את האטום-שלה (חוק-4).
// מתרגמת את כל 5 דוגמאות-החוזה (schedule-tasks.contract.md) ואת בדיקת-ה-JS
// (new/atoms/schedule-tasks.test.mjs) ביט-אחר-ביט: שרשרת / מקביליות / סינון /
// מחזור / ריק. השוואת-מערכים = אורך + איבר-איבר (חוק-8). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/schedule-tasks_test.dart ⇒ exit 0
import 'schedule-tasks.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

/// השוואת רשימת-משימות מול tuples צפויים [id,start,end,critical] — כולל הסדר.
/// חוק-8: אורך תחילה, ואז איבר-איבר (לא join/JSON).
void _tuples(dynamic tasks, List<List<dynamic>> want, String label) {
  final list = tasks as List;
  _ok(list.length == want.length,
      '$label: אורך ${list.length} != ${want.length}');
  for (var i = 0; i < want.length; i++) {
    final t = list[i];
    _ok(t['id'] == want[i][0], '$label[$i].id: ${t['id']} != ${want[i][0]}');
    _ok(t['start'] == want[i][1],
        '$label[$i].start: ${t['start']} != ${want[i][1]}');
    _ok(t['end'] == want[i][2], '$label[$i].end: ${t['end']} != ${want[i][2]}');
    _ok(t['critical'] == want[i][3],
        '$label[$i].critical: ${t['critical']} != ${want[i][3]}');
  }
}

/// השוואת רשימה איבר-איבר (חוק-8).
void _listEq(dynamic got, List<dynamic> want, String label) {
  final list = got as List;
  _ok(list.length == want.length,
      '$label: אורך ${list.length} != ${want.length}');
  for (var i = 0; i < want.length; i++) {
    _ok(list[i] == want[i], '$label[$i]: ${list[i]} != ${want[i]}');
  }
}

void main() {
  var n = 0;

  // 1) שרשרת A(3)→B(2)→C(4)
  final chain = scheduleTasks([
    {'id': 'a', 'name': 'A', 'days': 3},
    {'id': 'b', 'name': 'B', 'days': 2, 'deps': ['a']},
    {'id': 'c', 'name': 'C', 'days': 4, 'deps': ['b']},
  ]);
  _ok(chain['total'] == 9, 'שרשרת: total=9');
  n++;
  _tuples(chain['tasks'], [
    ['a', 0, 3, true],
    ['b', 3, 5, true],
    ['c', 5, 9, true],
  ], 'שרשרת: ES/EF/קריטי');
  n++;

  // 2) מקביליות A(5)·B(2)·C(1,deps:[a,b]) — B לא-קריטית, מיון לפי סיום
  final par = scheduleTasks([
    {'id': 'a', 'name': 'A', 'days': 5},
    {'id': 'b', 'name': 'B', 'days': 2},
    {'id': 'c', 'name': 'C', 'days': 1, 'deps': ['a', 'b']},
  ]);
  _ok(par['total'] == 6, 'מקביליות: total=6');
  n++;
  _tuples(par['tasks'], [
    ['b', 0, 2, false],
    ['a', 0, 5, true],
    ['c', 5, 6, true],
  ], 'מקביליות: B לא-קריטית + מיון');
  n++;

  // 3) שורה בלי-days מסוננת; deps אליה ולעצמה נזרקות
  final nod = scheduleTasks([
    {'id': 'a', 'name': 'A', 'days': 3},
    {'id': 'x', 'name': 'X'},
    {'id': 'b', 'name': 'B', 'days': 2, 'deps': ['x', 'a', 'b']},
  ]);
  _ok((nod['tasks'] as List).length == 2 && nod['total'] == 5,
      'בלי-days: 2 משימות, total=5');
  n++;
  final b3 = (nod['tasks'] as List).firstWhere((t) => t['id'] == 'b');
  _listEq(b3['deps'], ['a'], 'בלי-days: deps מסוננות');
  _ok(b3['start'] == 3 && b3['end'] == 5, 'בלי-days: B 3-5');
  n++;

  // 4) מחזור A(2,deps:[b])·B(3,deps:[a]) — נעצר, לא נתקע
  final cyc = scheduleTasks([
    {'id': 'a', 'name': 'A', 'days': 2, 'deps': ['b']},
    {'id': 'b', 'name': 'B', 'days': 3, 'deps': ['a']},
  ]);
  _ok(cyc['total'] == 7, 'מחזור: total=7');
  n++;
  _tuples(cyc['tasks'], [
    ['b', 2, 5, true],
    ['a', 5, 7, false],
  ], 'מחזור: B 2-5 קריטית, A 5-7 לא');
  n++;

  // 5) ריק ⇒ {tasks:[],total:0}
  final empty = scheduleTasks([]);
  _ok((empty['tasks'] as List).isEmpty && empty['total'] == 0,
      'ריק ⇒ {tasks:[],total:0}');
  n++;

  // בדיקות-שדה משלימות מהחוזה: name/days/deps מוחזרים כלשונם.
  final a1 = (chain['tasks'] as List)[0];
  _ok(a1['name'] == 'A' && a1['days'] == 3, 'שרשרת: name+days של A');
  _listEq(a1['deps'], [], 'שרשרת: deps של A ריקות');
  final c1 = (chain['tasks'] as List)[2];
  _listEq(c1['deps'], ['b'], 'שרשרת: deps של C');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(scheduleTasks([])['total'] == 0, 'assert-live guard');

  print('OK scheduleTasks: $n בדיקות-חוזה (שרשרת/מקביליות/סינון/מחזור/ריק) עברו');
}
