// בדיקת-חוזה · matchComponentTypeName — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/match_component_type_name_test.dart
import 'match_component_type_name.dart';

// שקע-הבדיקה: stand-in ל-_paletteTypeView.componentTypes() (מופע-View פרטי; חוק-3).
const Set<String> _types = {'button', 'card', 'iconButton'};

void _eq(String? got, String? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  _eq(matchComponentTypeName('card', componentTypes: _types), 'card', '1 exact'); n++;
  _eq(matchComponentTypeName('iconButton', componentTypes: _types), 'iconButton',
      '2 exact-over-substring'); n++;
  _eq(matchComponentTypeName('הוסף iconButton', componentTypes: _types),
      'iconButton', '3 longest-contained'); n++;
  _eq(matchComponentTypeName('zzz', componentTypes: _types), null, '4 no-match'); n++;
  _eq(matchComponentTypeName('card', componentTypes: const <String>{}), null,
      '5 empty fail-closed'); n++;

  assert(matchComponentTypeName('card', componentTypes: _types) == 'card',
      'assert-live guard');

  print('OK matchComponentTypeName: $n asserts passed');
}
