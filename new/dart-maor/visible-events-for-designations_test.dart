// בדיקת-חוזה · visibleEventsForDesignations — תרגום new/atoms/…test.mjs אחד-לאחד.
// הרצה: dart run --enable-asserts ⇒ OK
import 'visible-events-for-designations.dart';

bool isSupVisible(dynamic sp, dynamic a) {
  if (a == null || (a as List).isEmpty) return true;
  final fw = ((sp['forWho'] ?? '') as String).trim();
  if (fw.isEmpty) return false;
  return a.map((s) => (s as String).trim()).contains(fw);
}

void main() {
  final S = [
    {'id': 's1', 'forWho': 'יתומים'},
    {'id': 's2', 'forWho': ''},
    {'id': 's3', 'forWho': 'חולים'},
  ];
  final E = [
    {'id': 'e1'},
    {'id': 'e2', 'spId': 's1'},
    {'id': 'e3', 'spId': 's2'},
    {'id': 'e4', 'spId': 's3'},
    {'id': 'e5', 'spId': 'sX'},
  ];
  String ids(List<dynamic> arr) => arr.map((e) => e['id']).join(',');

  final cases = <List<dynamic>>[
    [visibleEventsForDesignations(E, S, null, isSupVisible), 'e1,e2,e3,e4,e5', 'דוגמה 1 · allowed=null'],
    [visibleEventsForDesignations(E, S, <dynamic>[], isSupVisible), 'e1,e2,e3,e4,e5', 'דוגמה 2 · allowed=[]'],
    [visibleEventsForDesignations(E, S, ['יתומים'], isSupVisible), 'e1,e2', 'דוגמה 3 · יתומים'],
    [visibleEventsForDesignations(E, S, ['יתומים', 'חולים'], isSupVisible), 'e1,e2,e4', 'דוגמה 4 · שני-ייעודים'],
    [visibleEventsForDesignations([{'id': 'e2', 'spId': 's1'}], S, ['חולים'], isSupVisible), '', 'דוגמה 5 · תורם-לא-בייעוד'],
    [visibleEventsForDesignations([{'id': 'e1'}], S, ['יתומים'], isSupVisible), 'e1', 'דוגמה 6 · לא-מקושר-נשמר'],
    [visibleEventsForDesignations([{'id': 'e5', 'spId': 'sX'}], S, ['יתומים'], isSupVisible), '', 'דוגמה 7 · spId-ללא-תורם'],
  ];
  for (final c in cases) {
    final g = ids(c[0] as List<dynamic>);
    if (g != c[1]) throw StateError('${c[2]} ⇒ [$g] ≠ [${c[1]}]');
  }
  // בונוס-זהות: allowed ריק מחזיר את אותה-הפניה (JS מחזיר את events עצמו)
  if (!identical(visibleEventsForDesignations(E, S, null, isSupVisible), E)) {
    throw StateError('allowed=null חייב להחזיר את אותה-הפניה');
  }
  print('OK visibleEventsForDesignations: 8 asserts passed');
}
