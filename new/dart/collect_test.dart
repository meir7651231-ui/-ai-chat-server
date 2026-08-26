// בדיקת-חוזה golden · collect — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/collect_test.dart
import 'collect.dart';

void main() {
  var n = 0;
  final tree = const CatalogNode(isLeaf: false, children: [
    CatalogNode(isLeaf: true, lipskeyCategory: 'צנרת'),
    CatalogNode(isLeaf: false, children: [
      CatalogNode(isLeaf: true, lipskeyCategory: 'ברזים'),
      CatalogNode(isLeaf: true), // null ⇒ מדולג
    ]),
  ]);
  final out = <String>{};
  collect(tree, out);
  if (out.length != 2 || !out.contains('צנרת') || !out.contains('ברזים')) {
    throw StateError('FAIL 1: $out');
  }
  n++;

  // עלה-בודד עם קטגוריה.
  final out2 = <String>{};
  collect(const CatalogNode(isLeaf: true, lipskeyCategory: 'x'), out2);
  if (out2.length != 1 || !out2.contains('x')) throw StateError('FAIL 2: $out2');
  n++;

  // עלה בלי קטגוריה ⇒ out נשאר ריק.
  final out3 = <String>{};
  collect(const CatalogNode(isLeaf: true), out3);
  if (out3.isNotEmpty) throw StateError('FAIL 3: $out3');
  n++;

  // צבירה: קטגוריה קיימת ב-out לא מוכפלת (Set).
  final out4 = <String>{'צנרת'};
  collect(const CatalogNode(isLeaf: true, lipskeyCategory: 'צנרת'), out4);
  if (out4.length != 1) throw StateError('FAIL 4 dedup: $out4');
  n++;

  // פנימי ריק ⇒ אין תוספת.
  final out5 = <String>{};
  collect(const CatalogNode(isLeaf: false), out5);
  if (out5.isNotEmpty) throw StateError('FAIL 5: $out5');
  n++;

  assert(() {
    final o = <String>{};
    collect(const CatalogNode(isLeaf: true, lipskeyCategory: 'z'), o);
    return o.contains('z');
  }(), 'assert-live');
  print('OK collect: $n asserts passed');
}
