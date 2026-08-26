// בדיקת-חוזה · matchAssistantRecipeKey — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/match_assistant_recipe_key_test.dart
import 'match_assistant_recipe_key.dart';

// שקע: kSmartProducts.map((p) => p.key) verbatim (בסדר-המקור).
const List<String> _keys = ['faucet', 'kitchenFaucet', 'basinTrap'];

void _eq(String? got, String? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  _eq(matchAssistantRecipeKey('faucet', productKeys: _keys), 'faucet',
      '1 exact-wins-first'); n++;
  _eq(matchAssistantRecipeKey('kitchenFaucet', productKeys: _keys),
      'kitchenFaucet', '2 exact'); n++;
  _eq(matchAssistantRecipeKey('הרכב לי kitchenFaucet', productKeys: _keys),
      'kitchenFaucet', '3 longest-contained'); n++;
  _eq(matchAssistantRecipeKey('zzz', productKeys: _keys), null, '4 no-match'); n++;
  _eq(matchAssistantRecipeKey('   ', productKeys: _keys), null, '5 blank'); n++;
  _eq(matchAssistantRecipeKey('faucet', productKeys: const <String>[]), null,
      '6 empty'); n++;

  assert(matchAssistantRecipeKey('faucet', productKeys: _keys) == 'faucet',
      'assert-live guard');

  print('OK matchAssistantRecipeKey: $n asserts passed');
}
