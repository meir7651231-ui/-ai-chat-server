// בדיקת-חוזה (רתמת-זהב) · sortSupportThreads — מייבאת אך ורק את האטום-שלה (חוק-4).
// ‏4 דוגמאות-ה-Golden זהות ביט-אחר-ביט למקור new/atoms/sort-support-threads.test.mjs
// והחוזה sort-support-threads.contract.md, ובנוסף מקרי-אימות שהוקלטו מהרצת קוד-ה-JS
// האמיתי (node, 25.8.2026) — כדי לכסות גם את המסלול שבו ה-comparator באמת רץ
// (הדוגמאות המוקלטות הן בנות ≤1 איברים ⇒ ה-comparator לא מופעל בהן).
// כלל-8: השוואת-מערכים = אורך + איבר-איבר (לעולם לא join). כשל ⇒ StateError.
// הרצה: dart run --enable-asserts new/dart-maor/sort-support-threads_test.dart ⇒ OK
import 'sort-support-threads.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

/// שוויון-עומק ל-JSON-ערכים; מערכים = אורך + איבר-איבר (כלל-8).
bool _deepEq(dynamic a, dynamic b) {
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!_deepEq(a[i], b[i])) return false;
    }
    return true;
  }
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k) || !_deepEq(a[k], b[k])) return false;
    }
    return true;
  }
  if (a is num && b is num) return a == b;
  return a == b;
}

void main() {
  var n = 0;

  // ── 4 הקלטות-ה-Golden מהחוזה (זהה-ביט ל-test.mjs) ─────────────────────────
  // 1) [{"amount":100}] ⇒ [{"amount":100}] — איבר-יחיד מוחזר כמו-שהוא בעותק-חדש.
  final t1 = [
    {'amount': 100},
  ];
  final r1 = sortSupportThreads(t1) as List;
  _ok(_deepEq(r1, [{'amount': 100}]), 'Golden 1: [{amount:100}]'); n++;
  _ok(!identical(r1, t1), 'Golden 1: JS מחזיר מערך-חדש ([...threads])'); n++;
  _ok(identical(r1[0], t1[0]), 'Golden 1: עותק-רדוד — אותו איבר בדיוק'); n++;

  // 2) ["2026-08-24"] ⇒ ["2026-08-24"] — איבר-מחרוזת (property עליו = undefined ב-JS).
  final t2 = ['2026-08-24'];
  final r2 = sortSupportThreads(t2) as List;
  _ok(_deepEq(r2, ['2026-08-24']), 'Golden 2: ["2026-08-24"]'); n++;

  // 3) "" ⇒ [] — ‏spread של מחרוזת-ריקה ב-JS = מערך-ריק.
  final r3 = sortSupportThreads('') as List;
  _ok(_deepEq(r3, <dynamic>[]), 'Golden 3: "" ⇒ []'); n++;

  // 4) [] ⇒ [].
  final r4 = sortSupportThreads(<dynamic>[]) as List;
  _ok(_deepEq(r4, <dynamic>[]), 'Golden 4: [] ⇒ []'); n++;

  // ── מקרים שהוקלטו מהרצת ה-JS האמיתי (node על sort-support-threads.mjs) ────
  // 5) עירוב מלא: b(2),e(1) לא-נקראים (‏'5' מחרוזת ⇒ typeof≠number ⇒ 0!);
  //    בקבוצת-הנקראים lastAt יורד; c לפני d (‏lastAt זהה ⇒ יציבות-JS).
  //    ‏JS הדפיס: ["b","e","f","c","d","a"].
  final t5 = [
    {'id': 'a', 'unreadAdmin': 0, 'lastAt': '2026-01-05'},
    {'id': 'b', 'unreadAdmin': 2, 'lastAt': '2020-01-01'},
    {'id': 'c', 'lastAt': '2026-03-01'},
    {'id': 'd', 'unreadAdmin': -3, 'lastAt': '2026-03-01'},
    {'id': 'e', 'unreadAdmin': 1},
    {'id': 'f', 'unreadAdmin': '5', 'lastAt': '2026-09-09'},
  ];
  final r5 = (sortSupportThreads(t5) as List).map((x) => (x as Map)['id']).toList();
  _ok(_deepEq(r5, ['b', 'e', 'f', 'c', 'd', 'a']),
      'JS-ref 5: סדר-מיון מלא (קיבלנו $r5)'); n++;

  // 6) שלושה בלי שדות כלל ⇒ הסדר-המקורי נשמר (יציבות). JS: ["x","y","z"].
  final t6 = [
    {'id': 'x'},
    {'id': 'y'},
    {'id': 'z'},
  ];
  final r6 = (sortSupportThreads(t6) as List).map((x) => (x as Map)['id']).toList();
  _ok(_deepEq(r6, ['x', 'y', 'z']), 'JS-ref 6: יציבות על שוויון-מלא'); n++;

  // 7) הקלט לא מוטבל (המיון על העותק): JS השאיר ["p","q"] במקור.
  final t7 = [
    {'id': 'p', 'unreadAdmin': 1, 'lastAt': '2026-01-01'},
    {'id': 'q', 'unreadAdmin': 0, 'lastAt': '2026-02-02'},
  ];
  final r7 = sortSupportThreads(t7) as List;
  _ok((t7[0] as Map)['id'] == 'p' && (t7[1] as Map)['id'] == 'q',
      'JS-ref 7: המקור לא הוטבל'); n++;
  _ok((r7[0] as Map)['id'] == 'p' && (r7[1] as Map)['id'] == 'q',
      'JS-ref 7: לא-נקרא (p) ראשון'); n++;

  // 8) איבר-null: supportUnread(null)=0 והענף-המוקדם מחזיר לפני גישת-lastAt —
  //    ‏JS הדפיס: ["m",null].
  final t8 = [null, {'id': 'm', 'unreadAdmin': 1, 'lastAt': '2021-01-01'}];
  final r8 = sortSupportThreads(t8) as List;
  _ok(r8.length == 2 && (r8[0] as Map)['id'] == 'm' && r8[1] == null,
      'JS-ref 8: [null, m] ⇒ [m, null]'); n++;

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_deepEq(sortSupportThreads(<dynamic>[]) as List, <dynamic>[]),
      'assert-live guard');

  print('OK sortSupportThreads: $n asserts passed');
}
