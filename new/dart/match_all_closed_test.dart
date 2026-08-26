// בדיקת-חוזה · matchAllClosed — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/match_all_closed_test.dart
import 'match_all_closed.dart';

void _eqSet(Set<String> got, Set<String> want, String label) {
  if (got.length != want.length || !got.containsAll(want)) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  _eqSet(matchAllClosed({'a', 'b', 'c'}, 'a c'), {'a', 'c'}, '1 multi'); n++;
  _eqSet(matchAllClosed({'faucet', 'faucetKit'}, 'faucetKit'),
      {'faucet', 'faucetKit'}, '2 both-contained'); n++;
  _eqSet(matchAllClosed({'a', 'b'}, '   '), <String>{}, '3 blank'); n++;
  _eqSet(matchAllClosed({'a', 'b'}, 'zzz'), <String>{}, '4 no-match'); n++;
  _eqSet(matchAllClosed({'', 'x'}, 'x'), {'x'}, '5 empty-key-filtered'); n++;
  _eqSet(matchAllClosed(<String>{}, 'anything'), <String>{}, '6 empty-source'); n++;

  assert(matchAllClosed({'a'}, 'a').contains('a'), 'assert-live guard');

  print('OK matchAllClosed: $n asserts passed');
}
