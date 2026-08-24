// בדיקת-חוזה · sizeTableEq — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/size_table_eq_test.dart
import 'size_table_eq.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — דוגמאות-החוזה (connection_schema.dart:51-59) —
  _eq(sizeTableEq(null, null), true, '1 null==null');                          n++;
  _eq(sizeTableEq(null, [["1"]]), false, '2 null vs data');                    n++;
  _eq(sizeTableEq([["1"]], null), false, '3 data vs null');                    n++;
  _eq(sizeTableEq([], []), true, '4 empty==empty');                            n++;
  _eq(sizeTableEq([["1"]], []), false, '5 len 1 vs 0');                        n++;
  _eq(sizeTableEq([["a", "b"], ["c"]], [["a", "b"], ["c"]]), true, '6 equal'); n++;
  _eq(sizeTableEq([["a"]], [["b"]]), false, '7 row differs');                  n++;
  _eq(sizeTableEq([["a", "b"]], [["a"]]), false, '8 row-len differs');         n++;

  // — עדשה-עוינת (CURRICULUM #6) —
  _eq(sizeTableEq([[]], [[]]), true, 'e1 empty-rows equal');                   n++;
  _eq(sizeTableEq([["a", "b"]], [["b", "a"]]), false, 'e2 order matters');     n++;
  final t = [["x"]];
  _eq(sizeTableEq(t, t), true, 'e3 identical ref');                            n++;

  // — שקע rowEq עוקף את ברירת-המחדל (מוכיח הזרקה) —
  _eq(
    sizeTableEq([["a"]], [["b"]], rowEq: (x, y) => true),
    true,
    's1 injected rowEq always-true',
  );
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(sizeTableEq(null, null) == true, 'assert-live guard');

  print('OK sizeTableEq: $n asserts passed');
}
