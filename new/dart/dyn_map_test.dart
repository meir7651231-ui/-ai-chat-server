// בדיקת-חוזה · dynMap — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/dyn_map_test.dart
import 'dyn_map.dart';

void _true(bool c, String label) {
  if (!c) throw StateError('FAIL [$label]');
}

void main() {
  var n = 0;

  // 1 — Map ⇒ מומר, ערכים נשמרים
  final m = dynMap({'a': 1, 'b': 'x'});
  _true(m is Map<String, dynamic> && m['a'] == 1 && m['b'] == 'x', '1 map');
  n++;

  // 2 — null ⇒ ריק
  _true(dynMap(null).isEmpty, '2 null');
  n++;

  // 3 — List ⇒ ריק
  _true(dynMap([1, 2, 3]).isEmpty, '3 list');
  n++;

  // 4 — scalar int ⇒ ריק
  _true(dynMap(42).isEmpty, '4 int');
  n++;

  // 5 — scalar string ⇒ ריק
  _true(dynMap('טקסט').isEmpty, '5 string');
  n++;

  // 6 — Map ריק ⇒ ריק (אך Map)
  final e = dynMap(<String, dynamic>{});
  _true(e is Map<String, dynamic> && e.isEmpty, '6 empty-map');
  n++;

  assert(dynMap({'k': 7})['k'] == 7, 'assert-live guard');

  print('OK dynMap: $n asserts passed');
}
