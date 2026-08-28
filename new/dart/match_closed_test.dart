// בדיקת-חוזה golden · matchClosed — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/match_closed_test.dart
import 'match_closed.dart';

void _eq(String? got, String? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(matchClosed({'a', 'b'}, ''), null, '1 empty'); n++;
  _eq(matchClosed({'a', 'b'}, '   '), null, '2 blank-trim'); n++;
  _eq(matchClosed({'card', 'card.order'}, 'card'), 'card', '3 exact-wins'); n++;
  _eq(matchClosed({'faucet', 'kitchenFaucet'}, 'the kitchenFaucet pls'),
      'kitchenFaucet', '4 longest-contained'); n++;
  _eq(matchClosed({'faucet', 'kitchenFaucet'}, 'the faucet pls'), 'faucet',
      '5 only-faucet'); n++;
  _eq(matchClosed({'a', 'b', 'c'}, 'xyz'), null, '6 none'); n++;
  _eq(matchClosed(<String>{}, 'anything'), null, '7 empty-set'); n++;
  _eq(matchClosed({'', 'abc'}, 'abc'), 'abc', '8 empty-key-rejected'); n++;
  _eq(matchClosed({'ab', 'abcd'}, '  abcd  '), 'abcd', '9 trim-then-exact'); n++;
  _eq(matchClosed({'xx', 'yy'}, 'zz xx yy'), 'xx', '10 tie-insertion-order'); n++;
  _eq(matchClosed({'cat', 'category'}, 'pick category'), 'category',
      '11 longer-beats-prefix'); n++;
  // exact short-circuits even when a longer key also contains the reply
  _eq(matchClosed({'go', 'goal'}, 'go'), 'go', '12 exact-short-circuit'); n++;

  assert(matchClosed({'kitchenFaucet', 'faucet'}, 'x kitchenFaucet') ==
      'kitchenFaucet', 'assert-live');
  print('OK matchClosed: $n asserts passed');
}
