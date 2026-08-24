// בדיקת-חוזה (רתמת-זהב) · filterItems — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/filter-items.test.mjs:
//   יתרות מזויפות A→null · B→0 · C→1 · D→2 · E→3 ; smartFilter-מזויף מחזיר items.
//   1) '' ⇒ [A,B,C,D,E] ובלי קריאת itemRemaining · 2) untracked ⇒ [A] ·
//   3) out ⇒ [B] · 4) low ⇒ [C,D] · 5) getTerms({name:'נר שבת'}) ⇒ ['נר שבת','נר','שבת'].
// אם עובר ⇒ Dart≡JS. השוואת-מערכים איבר-איבר (כלל-8: לעולם לא join).
// הרצה: dart run --enable-asserts new/dart-maor/filter-items_test.dart  ⇒ exit 0
import 'filter-items.dart';

List<String> _ids(List<dynamic> out) =>
    out.map((i) => (i as Map)['id'] as String).toList();

void _eqList(List<dynamic> got, List<dynamic> want, String label) {
  if (got.length != want.length) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
  for (var i = 0; i < want.length; i++) {
    if (got[i] != want[i]) {
      throw StateError('FAIL [$label]: got=$got want=$want (index $i)');
    }
  }
}

void main() {
  final db = <String, dynamic>{
    'shopItems': <dynamic>[
      {'id': 'A', 'name': 'נר שבת'},
      {'id': 'B', 'name': 'יין'},
      {'id': 'C', 'name': 'חלה'},
      {'id': 'D', 'name': 'דבש'},
      {'id': 'E', 'name': 'שמן'},
    ],
  };
  final rems = <String, num?>{'A': null, 'B': 0, 'C': 1, 'D': 2, 'E': 3};

  var remCalls = 0;
  num? fakeRem(dynamic d, dynamic id) {
    remCalls++;
    return rems[id as String];
  }

  List<dynamic> Function(dynamic)? captured;
  List<dynamic> fakeSmart(String q, List<dynamic> items,
      List<dynamic> Function(dynamic) getTerms) {
    captured = getTerms;
    return items;
  }

  var n = 0;

  // 1) stockState='' ⇒ הכול, בלי קריאות itemRemaining
  remCalls = 0;
  _eqList(_ids(filterItems(db, '', '', fakeRem, fakeSmart)),
      ['A', 'B', 'C', 'D', 'E'], "1 '' -> all");
  if (remCalls != 0) {
    throw StateError('FAIL: itemRemaining נקרא למרות stockState ריק ($remCalls)');
  }
  n++;

  // 2) untracked ⇒ רק null
  _eqList(_ids(filterItems(db, '', 'untracked', fakeRem, fakeSmart)), ['A'],
      '2 untracked');
  n++;

  // 3) out ⇒ רק 0
  _eqList(_ids(filterItems(db, '', 'out', fakeRem, fakeSmart)), ['B'], '3 out');
  n++;

  // 4) low ⇒ 0<rem≤2
  _eqList(_ids(filterItems(db, '', 'low', fakeRem, fakeSmart)), ['C', 'D'],
      '4 low');
  n++;

  // 5) getTerms = השם + פיצול-מילים (captured מהקריאה האחרונה)
  final terms = captured!(<String, dynamic>{'name': 'נר שבת'});
  _eqList(terms, ['נר שבת', 'נר', 'שבת'], '5 getTerms');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_ids(filterItems(db, '', 'out', fakeRem, fakeSmart)).length == 1,
      'assert-live guard');

  print('OK filterItems: $n asserts passed');
}
