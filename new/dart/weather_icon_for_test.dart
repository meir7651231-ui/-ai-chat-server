import 'weather_icon_for.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  _eq(weatherIconFor(0), '☀️', '1');
  n++;
  _eq(weatherIconFor(2), '⛅', '2');
  n++;
  _eq(weatherIconFor(60), '🌧️', '3');
  n++;
  _eq(weatherIconFor(96), '⛈️', '4');
  n++;
  print('✓ weatherIconFor: $n');
}
