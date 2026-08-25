import 'kit-progress.dart';

/// רתמת-זהב: אותן 6 דוגמאות-חוזה בדיוק מ-new/atoms/kit-progress.test.mjs.
/// K(n, done) = מערך n פריטים {label:'שלב '+i, done: i<done} — כמו במקור.
List<Map<String, Object>> _K(int n, int done) => List.generate(
      n,
      (i) => {'label': 'שלב $i', 'done': i < done},
    );

var _f = 0;

void _eq(Map<String, Object> g, Map<String, Object> w, String msg) {
  final ok = g['done'] == w['done'] &&
      g['total'] == w['total'] &&
      g['pct'] == w['pct'] &&
      g['ready'] == w['ready'];
  if (!ok) {
    print('✗ $msg\n  קיבלנו: $g\n  ציפינו: $w');
    _f = 1;
  }
}

void main() {
  // 1) 3 מתוך 5 ⇒ 60%, לא מוכן
  _eq(kitProgress({'kit': _K(5, 3)}),
      {'done': 3, 'total': 5, 'pct': 60, 'ready': false}, '1: 3/5');

  // 2) הכול סומן ⇒ 100%, מוכן-למסירה
  _eq(kitProgress({'kit': _K(3, 3)}),
      {'done': 3, 'total': 3, 'pct': 100, 'ready': true}, '2: 3/3');

  // 3) עיגול מטה — 1/3 ⇒ 33
  if (kitProgress({'kit': _K(3, 1)})['pct'] != 33) {
    print('✗ 3: 1/3 ≠ 33');
    _f = 1;
  }

  // 4) עיגול מעלה — 2/3 ⇒ 67
  if (kitProgress({'kit': _K(3, 2)})['pct'] != 67) {
    print('✗ 4: 2/3 ≠ 67');
    _f = 1;
  }

  // 5) ערכה ריקה — ריק אינו "מוכן"
  final empty = {'done': 0, 'total': 0, 'pct': 0, 'ready': false};
  _eq(kitProgress({'kit': []}), empty, '5: ערכה ריקה');

  // 6) null / undefined(=null ב-Dart) / בלי kit ⇒ אותו פלט-ריק
  _eq(kitProgress(null), empty, '6: null');
  _eq(kitProgress({}), empty, '6: בלי kit');

  if (_f != 0) throw StateError('kit-progress: סטייה מהמקור');
  print('✓ kit-progress: 6 דוגמאות-חוזה — ירוק');
}
