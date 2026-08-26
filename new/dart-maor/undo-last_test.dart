/// בדיקת-חוזה · undo-last — כל 6 הדוגמאות המחייבות + בדיקת-ה-JS.
/// מערכים: אורך + איבר-איבר (חוק-8). כשל ⇒ StateError. סיום ירוק ⇒ OK.
import 'undo-last.dart';

void eqList(dynamic actual, List expected, String msg) {
  final List a = actual as List;
  if (a.length != expected.length) {
    throw StateError('✗ $msg: אורך ${a.length} != ${expected.length}');
  }
  for (var i = 0; i < a.length; i++) {
    if (a[i] != expected[i]) {
      throw StateError('✗ $msg[$i]: ${a[i]} != ${expected[i]}');
    }
  }
}

void eqEntry(dynamic actual, Map expected, String msg) {
  final Map a = actual as Map;
  if (a.length != expected.length) {
    throw StateError('✗ $msg: מספר-מפתחות ${a.length} != ${expected.length}');
  }
  for (final k in expected.keys) {
    if (a[k] != expected[k]) {
      throw StateError('✗ $msg[$k]: ${a[k]} != ${expected[k]}');
    }
  }
}

void main() {
  const rq = ['noanswer', 'skip'];
  const t = '2026-08-24';

  // 1) ביטול תוצאה-סופית — חוזר לחזית, היומן מתרוקן
  {
    final out = undoLast({
      'queue': ['b'],
      'log': [
        {'id': 'a', 'outcome': 'donated', 'at': t}
      ],
    }, rq);
    eqList(out['queue'], ['a', 'b'], 'דוגמה 1: queue');
    eqList(out['log'], [], 'דוגמה 1: log');
  }

  // 2) ביטול requeue — מוסר מהסוף וחוזר לחזית
  {
    final out = undoLast({
      'queue': ['b', 'a'],
      'log': [
        {'id': 'a', 'outcome': 'noanswer', 'at': t}
      ],
    }, rq);
    eqList(out['queue'], ['a', 'b'], 'דוגמה 2: queue');
    eqList(out['log'], [], 'דוגמה 2: log');
  }

  // 3) המזהה פעמיים בתור — מוסר האחרון (lastIndexOf)
  {
    final out = undoLast({
      'queue': ['a', 'b', 'a'],
      'log': [
        {'id': 'a', 'outcome': 'skip', 'at': t}
      ],
    }, rq);
    eqList(out['queue'], ['a', 'a', 'b'], 'דוגמה 3: queue');
  }

  // 4) requeue כשהמזהה לא בתור — התור לא נפגע, רק חזרה לחזית
  {
    final out = undoLast({
      'queue': ['b'],
      'log': [
        {'id': 'a', 'outcome': 'noanswer', 'at': t}
      ],
    }, rq);
    eqList(out['queue'], ['a', 'b'], 'דוגמה 4: queue');
  }

  // 5) יומן ריק — no-op באותה רפרנס
  {
    final c = {
      'queue': ['a'],
      'log': [],
    };
    if (!identical(undoLast(c, rq), c)) {
      throw StateError('✗ דוגמה 5: לא הוחזר אותו אובייקט');
    }
  }

  // 6) רק הרשומה האחרונה נמחקת + immutability
  {
    final log = [
      {'id': 'a', 'outcome': 'donated', 'at': t},
      {'id': 'b', 'outcome': 'refused', 'at': t},
    ];
    final c = {
      'queue': ['c'],
      'log': log,
    };
    final out = undoLast(c, rq);
    final List outLog = out['log'] as List;
    if (outLog.length != 1) {
      throw StateError('✗ דוגמה 6: אורך log ${outLog.length} != 1');
    }
    eqEntry(outLog[0], {'id': 'a', 'outcome': 'donated', 'at': t},
        'דוגמה 6: הרשומה הראשונה נשארת');
    eqList(out['queue'], ['b', 'c'], 'דוגמה 6: queue');
    eqList(c['queue'], ['c'], 'דוגמה 6: c.queue המקורי השתנה');
    if ((c['log'] as List).length != 2) {
      throw StateError('✗ דוגמה 6: c.log המקורי השתנה');
    }
  }

  // ספיח: spread שומר מפתחות-נוספים ({...c}) — כמו ב-JS
  {
    final out = undoLast({
      'queue': [],
      'log': [
        {'id': 'x', 'outcome': 'donated', 'at': t}
      ],
      'name': 'קמפיין',
    }, rq);
    if (out['name'] != 'קמפיין') {
      throw StateError('✗ ספיח: מפתח-נוסף אבד ב-spread');
    }
  }

  print('OK — undo-last: 6 דוגמאות-חוזה — ירוק');
}
