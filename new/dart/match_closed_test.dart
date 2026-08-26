// בדיקת-חוזה · matchClosed — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/match_closed_test.dart
import 'match_closed.dart';

void _eq(String? got, String? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  // — התאמה-מדויקת גוברת —
  _eq(matchClosed({'a', 'b'}, 'a'), 'a', '1 exact'); n++;
  _eq(matchClosed({'faucet', 'kitchenFaucet'}, 'kitchenFaucet'),
      'kitchenFaucet', '2 exact-over-substring'); n++;

  // — מוכל-ארוך-ביותר —
  _eq(matchClosed({'faucet', 'kitchenFaucet'}, 'רוצה kitchenFaucet בבקשה'),
      'kitchenFaucet', '3 longest-contained'); n++;
  _eq(matchClosed({'card', 'card.order'}, '"card.order"'),
      'card.order', '4 contained-over-prefix'); n++;

  // — fail-closed —
  _eq(matchClosed({'a', 'b'}, '   '), null, '5 blank'); n++;
  _eq(matchClosed({'a', 'b'}, 'zzz'), null, '6 no-match'); n++;
  _eq(matchClosed({'', 'x'}, 'y'), null, '7 empty-key-not-contained'); n++;

  // assert חי — מוכיח שהמנגנון פעיל.
  assert(matchClosed({'a'}, 'a') == 'a', 'assert-live guard');

  print('OK matchClosed: $n asserts passed');
}
