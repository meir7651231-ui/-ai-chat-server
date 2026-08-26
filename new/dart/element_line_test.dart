// בדיקת-חוזה · elementLine — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/element_line_test.dart
import 'element_line.dart';

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  // שקעים סינתטיים — מפות id⇒קבוצות.
  final props = <String, List<String>>{
    'title': ['text', 'color'],
    'card': ['bg', 'text'],
    'z': ['a'],
  };
  final acts = <String, List<String>>{
    'btn': ['tap', 'long'],
    'card': ['open'],
  };
  Iterable<String> pk(String id) => props[id] ?? const <String>[];
  Iterable<String> ak(String id) => acts[id] ?? const <String>[];

  _eq(elementLine('title', propKeysFor: pk, actionIdsFor: ak),
      'title = props color/text', '1 props sorted'); n++;
  _eq(elementLine('btn', propKeysFor: pk, actionIdsFor: ak),
      'btn = actions long/tap', '2 actions sorted'); n++;
  _eq(elementLine('card', propKeysFor: pk, actionIdsFor: ak),
      'card = props bg/text · actions open', '3 both'); n++;
  _eq(elementLine('x', propKeysFor: pk, actionIdsFor: ak), 'x', '4 empty'); n++;
  _eq(elementLine('z', propKeysFor: pk, actionIdsFor: ak),
      'z = props a', '5 single prop'); n++;

  assert(elementLine('x', propKeysFor: pk, actionIdsFor: ak) == 'x',
      'assert-live guard');

  print('OK elementLine: $n asserts passed');
}
