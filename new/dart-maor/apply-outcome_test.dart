// בדיקת-חוזה (רתמת-זהב) · applyOutcome — מייבאת אך ורק את האטום-שלה (חוק-4).
// שבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/apply-outcome.test.mjs:
//   1) תוצאה סופית 'donated', note ''         ⇒ queue ['b'] · log [{a,donated,T}] · אין note
//   2) 'noanswer' (ברשימת-החזרה)              ⇒ queue ['b','a']
//   3) note '  לחזור מחר  '                    ⇒ log[0].note == 'לחזור מחר' (נחתך)
//   4) note '   ' (רווחים בלבד)                ⇒ אין שדה note
//   5) תור ריק                                 ⇒ no-op, אותה רפרנס (=== ⇒ identical)
//   6) immutability — הקמפיין-הנכנס לא שוכתב
//   7) היומן נצבר בסדר [a,b]
// המרה: JSON.stringify של JS ⇒ _deep (שוויון-עמוק) ב-Dart; === ⇒ identical.
// הרצה: dart run --enable-asserts new/dart-maor/apply-outcome_test.dart  ⇒ exit 0
import 'apply-outcome.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

/// שוויון-עמוק (מקביל להשוואת JSON.stringify של המקור — order-safe יותר).
bool _deep(Object? a, Object? b) {
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k)) return false;
      if (!_deep(a[k], b[k])) return false;
    }
    return true;
  }
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!_deep(a[i], b[i])) return false;
    }
    return true;
  }
  return a == b;
}

// שקע currentId מהמקור: `c => c.queue.length ? c.queue[0] : null`.
Object? cur(Map c) {
  final q = c['queue'] as List;
  return q.isNotEmpty ? q[0] : null;
}

void main() {
  var n = 0;
  final rq = ['noanswer', 'skip'];
  const t = '2026-08-24T10:00:00';

  // 1) תוצאה סופית — יוצא מהתור, נרשם ליומן בלי note.
  final c1 = {
    'queue': ['a', 'b'],
    'log': [],
  };
  final o1 = applyOutcome(c1, 'donated', '', t, cur, rq);
  _ok(_deep(o1['queue'], ['b']), 'סופית: התור שגוי'); n++;
  _ok(
      _deep(o1['log'], [
        {'id': 'a', 'outcome': 'donated', 'at': t},
      ]),
      'סופית: היומן שגוי');
  n++;
  _ok(!((o1['log'] as List)[0] as Map).containsKey('note'),
      'note ריק נרשם בכל-זאת');
  n++;

  // 2) חזרה-לתור — עובר לסוף.
  final o2 = applyOutcome(
      {
        'queue': ['a', 'b'],
        'log': [],
      },
      'noanswer',
      '',
      t,
      cur,
      rq);
  _ok(_deep(o2['queue'], ['b', 'a']), 'requeue: לא עבר לסוף-התור'); n++;

  // 3) הערה קטומה.
  final o3 = applyOutcome(
      {
        'queue': ['a'],
        'log': [],
      },
      'callback',
      '  לחזור מחר  ',
      t,
      cur,
      rq);
  _ok((o3['log'] as List)[0]['note'] == 'לחזור מחר', 'ההערה לא נקטמה'); n++;

  // 4) הערת-רווחים בלבד ⇒ אין שדה note.
  final o4 = applyOutcome(
      {
        'queue': ['a'],
        'log': [],
      },
      'done',
      '   ',
      t,
      cur,
      rq);
  _ok(!((o4['log'] as List)[0] as Map).containsKey('note'),
      'הערת-רווחים נרשמה');
  n++;

  // 5) תור ריק ⇒ no-op (אותה רפרנס בדיוק).
  final c5 = {'queue': [], 'log': []};
  _ok(identical(applyOutcome(c5, 'donated', '', t, cur, rq), c5),
      'תור ריק לא החזיר את אותו קמפיין');
  n++;

  // 6) immutability — הקמפיין הנכנס לא שוכתב.
  _ok(_deep(c1['queue'], ['a', 'b']), 'c הנכנס שוכתב (queue)'); n++;
  _ok(_deep(c1['log'], []), 'c הנכנס שוכתב (log)'); n++;

  // 7) היומן נצבר בסדר.
  final o7 = applyOutcome(
      {
        'queue': ['b'],
        'log': [
          {'id': 'a', 'outcome': 'donated', 'at': t},
        ],
      },
      'skip',
      '',
      'T2',
      cur,
      rq);
  final log7 = o7['log'] as List;
  _ok(
      log7.length == 2 &&
          (log7[0] as Map)['id'] == 'a' &&
          (log7[1] as Map)['id'] == 'b',
      'היומן לא נצבר בסדר');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(identical(applyOutcome(c5, 'donated', '', t, cur, rq), c5),
      'assert-live guard');

  print('OK applyOutcome: $n asserts passed');
}
