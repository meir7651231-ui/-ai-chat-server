// בדיקת-חוזה · matchPropKey — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/match_prop_key_test.dart
import 'match_prop_key.dart';

Set<String> _props(String id) =>
    id == 'card' ? {'color', 'bgColor', 'label'} : <String>{};

void _eq(String? got, String? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  _eq(matchPropKey('card', 'color', propKeysFor: _props), 'color', '1 exact'); n++;
  _eq(matchPropKey('card', 'bgColor', propKeysFor: _props), 'bgColor',
      '2 exact-over-substring'); n++;
  _eq(matchPropKey('card', 'שנה את bgColor', propKeysFor: _props), 'bgColor',
      '3 longest-contained'); n++;
  _eq(matchPropKey('card', 'zzz', propKeysFor: _props), null, '4 no-match'); n++;
  _eq(matchPropKey('missing', 'color', propKeysFor: _props), null,
      '5 unknown-id fail-closed'); n++;

  assert(matchPropKey('card', 'color', propKeysFor: _props) == 'color',
      'assert-live guard');

  print('OK matchPropKey: $n asserts passed');
}
