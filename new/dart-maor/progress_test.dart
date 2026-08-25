// בדיקת-חוזה (רתמת-זהב) · progress — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/progress.test.mjs.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/progress_test.dart ⇒ exit 0
import 'progress.dart';

const RQ = ['noanswer', 'skip'];
const T = '2026-08-24T10:00:00';
Map L(String id, String outcome) => {'id': id, 'outcome': outcome, 'at': T};

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1) בסיס: אחד נסגר, שניים נותרו
  final p1 = progress({'total': 3, 'queue': ['b', 'c'], 'log': [L('a', 'donated')]}, RQ);
  _ok(p1['total'] == 3 && p1['remaining'] == 2 && p1['finalized'] == 1,
      'בסיס: total/remaining/finalized שגויים'); n++;
  _ok((p1['counts'] as Map)['donated'] == 1, 'בסיס: donated≠1'); n++;
  _ok(['noanswer', 'refused', 'callback', 'done', 'skip']
          .every((k) => (p1['counts'] as Map)[k] == 0),
      'בסיס: מפתח לא-אפסי'); n++;

  // 2) התיקון (20.8): לא-ענה פר-אדם, לא פר-ניסיון
  final p2 = progress(
      {'total': 1, 'queue': ['a'], 'log': [L('a', 'noanswer'), L('a', 'noanswer'), L('a', 'noanswer')]}, RQ);
  _ok((p2['counts'] as Map)['noanswer'] == 1,
      'פר-אדם: 3 ניסיונות של אותו מזהה נספרו ${(p2['counts'] as Map)['noanswer']}'); n++;
  _ok(p2['remaining'] == 1 && p2['finalized'] == 0, 'פר-אדם: remaining/finalized שגויים'); n++;

  // 3) שני אנשים שלא ענו — ייחודי פר-מזהה
  final p3 = progress(
      {'total': 2, 'queue': ['a', 'b'], 'log': [L('a', 'noanswer'), L('b', 'noanswer'), L('a', 'noanswer')]}, RQ);
  _ok((p3['counts'] as Map)['noanswer'] == 2, 'שני-אנשים: noanswer≠2'); n++;

  // 4) סופית נספרת פר-רשומה
  final p4 = progress({'total': 2, 'queue': [], 'log': [L('a', 'donated'), L('b', 'donated')]}, RQ);
  _ok((p4['counts'] as Map)['donated'] == 2 && p4['finalized'] == 2,
      'סופית: donated/finalized שגויים'); n++;

  // 5) קמפיין ריק — כל המפתחות קיימים ואפס
  final p5 = progress({'total': 0, 'queue': [], 'log': []}, RQ);
  _ok(p5['total'] == 0 && p5['remaining'] == 0 && p5['finalized'] == 0, 'ריק: מדדים שגויים'); n++;
  _ok((p5['counts'] as Map).length == 6 && (p5['counts'] as Map).values.every((v) => v == 0),
      'ריק: counts לא 6×0'); n++;

  // 6) קיטום finalized ל-0 + תור ייחודי (Set)
  final p6 = progress({'total': 0, 'queue': ['a'], 'log': []}, RQ);
  _ok(p6['finalized'] == 0, 'קיטום: finalized שלילי'); n++;
  _ok(progress({'total': 2, 'queue': ['a', 'a'], 'log': []}, RQ)['remaining'] == 1,
      'Set: כפילות בתור נספרה פעמיים'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(progress({'total': 3, 'queue': ['b', 'c'], 'log': [L('a', 'donated')]}, RQ)['finalized'] == 1,
      'assert-live guard');

  print('OK progress: $n asserts passed — ספירה פר-אדם 20.8 שמורה');
}
