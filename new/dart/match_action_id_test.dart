// בדיקת-חוזה · matchActionId — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/match_action_id_test.dart
import 'match_action_id.dart';

// שקע-הבדיקה: RegistryView.actionIdsFor stub דטרמיניסטי.
Set<String> _actions(String id) =>
    id == 'btn' ? {'nav.open', 'cart.add'} : <String>{};

void _eq(String? got, String? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  _eq(matchActionId('btn', 'cart.add', actionIdsFor: _actions),
      'cart.add', '1 exact'); n++;
  _eq(matchActionId('btn', 'לחץ nav.open עכשיו', actionIdsFor: _actions),
      'nav.open', '2 contained'); n++;
  _eq(matchActionId('btn', 'zzz', actionIdsFor: _actions),
      null, '3 no-match'); n++;
  _eq(matchActionId('btn', '   ', actionIdsFor: _actions),
      null, '4 blank'); n++;
  _eq(matchActionId('missing', 'cart.add', actionIdsFor: _actions),
      null, '5 fail-closed empty set'); n++;

  assert(matchActionId('btn', 'cart.add', actionIdsFor: _actions) == 'cart.add',
      'assert-live guard');

  print('OK matchActionId: $n asserts passed');
}
