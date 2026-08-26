// בדיקת-חוזה · contrastRatio — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/contrast_ratio_test.dart
import 'contrast_ratio.dart';

double _lum(double x) => x; // שקע-הבדיקה: luminanceOf = זהות

void _close(double got, double want, String label) {
  if ((got - want).abs() > 1e-9) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  _close(contrastRatio(1.0, 0.0, luminanceOf: _lum), 21.0, '1 white-black');
  n++;
  _close(contrastRatio(0.0, 1.0, luminanceOf: _lum), 21.0, '2 symmetric');
  n++;
  _close(contrastRatio(0.5, 0.5, luminanceOf: _lum), 1.0, '3 identical');
  n++;
  _close(contrastRatio(0.5, 0.0, luminanceOf: _lum), 11.0, '4 mid-black');
  n++;
  _close(contrastRatio(0.0, 0.0, luminanceOf: _lum), 1.0, '5 both-black');
  n++;

  assert(contrastRatio(1.0, 0.0, luminanceOf: _lum) == 21.0, 'assert-live guard');

  print('OK contrastRatio: $n asserts passed');
}
