// בדיקת-חוזה · matchAllElementIds — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/match_all_element_ids_test.dart
import 'match_all_element_ids.dart';

Set<String> _ids() => {'cart', 'cart.item', 'home'};

void _eqSet(Set<String> got, Set<String> want, String label) {
  if (got.length != want.length || !got.containsAll(want)) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  _eqSet(matchAllElementIds('cart.item ו-home', elementIds: _ids),
      {'cart', 'cart.item', 'home'}, '1 multi + prefix'); n++;
  _eqSet(matchAllElementIds('home', elementIds: _ids), {'home'}, '2 single'); n++;
  _eqSet(matchAllElementIds('   ', elementIds: _ids), <String>{}, '3 blank'); n++;
  _eqSet(matchAllElementIds('zzz', elementIds: _ids), <String>{}, '4 no-match'); n++;
  _eqSet(matchAllElementIds('home', elementIds: () => <String>{}), <String>{},
      '5 empty-registry'); n++;

  assert(matchAllElementIds('home', elementIds: _ids).contains('home'),
      'assert-live guard');

  print('OK matchAllElementIds: $n asserts passed');
}
