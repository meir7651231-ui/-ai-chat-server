import 'scoped_prefs_key.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  _eq(scopedPrefsKey('favorites', null), 'favorites', '1');
  n++;
  _eq(scopedPrefsKey('favorites', ''), 'favorites', '2');
  n++;
  _eq(scopedPrefsKey('favorites', 'u42'), 'favorites::u42', '3');
  n++;
  print('✓ scopedPrefsKey: $n');
}
