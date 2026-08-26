// בדיקת-חוזה · matchComponentType — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/match_component_type_test.dart
import 'match_component_type.dart';

Set<String> _types() => {'button', 'card', 'iconButton'};

void _eq(String? got, String? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  _eq(matchComponentType('card', componentTypes: _types), 'card', '1 exact'); n++;
  _eq(matchComponentType('iconButton', componentTypes: _types), 'iconButton',
      '2 exact-over-substring'); n++;
  _eq(matchComponentType('הוסף iconButton', componentTypes: _types),
      'iconButton', '3 longest-contained'); n++;
  _eq(matchComponentType('zzz', componentTypes: _types), null, '4 no-match'); n++;
  _eq(matchComponentType('card', componentTypes: () => <String>{}), null,
      '5 pre-palette fail-closed'); n++;

  assert(matchComponentType('card', componentTypes: _types) == 'card',
      'assert-live guard');

  print('OK matchComponentType: $n asserts passed');
}
