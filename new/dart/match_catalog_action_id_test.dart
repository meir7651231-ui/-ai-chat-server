// בדיקת-חוזה · matchCatalogActionId — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/match_catalog_action_id_test.dart
import 'match_catalog_action_id.dart';

// שקע-הבדיקה: stand-in ל-_catalogActionView.elementIds() (מופע-View פרטי; חוק-3).
const Set<String> _cat = {'nav.open', 'share', 'cart.add'};

void _eq(String? got, String? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  _eq(matchCatalogActionId('share', catalogActionIds: _cat), 'share', '1 exact'); n++;
  _eq(matchCatalogActionId('בצע cart.add כאן', catalogActionIds: _cat),
      'cart.add', '2 contained'); n++;
  _eq(matchCatalogActionId('zzz', catalogActionIds: _cat), null, '3 no-match'); n++;
  _eq(matchCatalogActionId('   ', catalogActionIds: _cat), null,
      '4 blank fail-closed'); n++;
  _eq(matchCatalogActionId('share', catalogActionIds: const <String>{}), null,
      '5 empty'); n++;

  assert(matchCatalogActionId('share', catalogActionIds: _cat) == 'share',
      'assert-live guard');

  print('OK matchCatalogActionId: $n asserts passed');
}
