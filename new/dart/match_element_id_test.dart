// בדיקת-חוזה · matchElementId — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/match_element_id_test.dart
import 'match_element_id.dart';

Set<String> _ids() => {'cart', 'cart.item', 'home'};

void _eq(String? got, String? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  _eq(matchElementId('home', elementIds: _ids), 'home', '1 exact'); n++;
  _eq(matchElementId('cart.item', elementIds: _ids), 'cart.item',
      '2 exact-over-prefix'); n++;
  _eq(matchElementId('פתח את cart.item', elementIds: _ids), 'cart.item',
      '3 longest-contained'); n++;
  _eq(matchElementId('zzz', elementIds: _ids), null, '4 no-match'); n++;
  _eq(matchElementId('   ', elementIds: _ids), null, '5 blank'); n++;
  _eq(matchElementId('home', elementIds: () => <String>{}), null,
      '6 empty-registry fail-closed'); n++;

  assert(matchElementId('home', elementIds: _ids) == 'home', 'assert-live guard');

  print('OK matchElementId: $n asserts passed');
}
