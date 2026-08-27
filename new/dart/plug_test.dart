// בדיקת-Golden · plug — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'plug.dart';

void _eq(double got, double want, String lbl) {
  if (got != want) throw StateError('FAIL [$lbl]: got=$got want=$want');
}

// שקע-אמת: base מחזיר מפה עם F; r1 = עיגול-פשוט לעשירית.
Map<String, double> _base(int od) => {'F': od.toDouble(), 'OD': od.toDouble()};
double _r1(double x) => (x * 10).round() / 10;

void main() {
  var n = 0;
  final p20 = plug(20, base: _base, r1: _r1);
  // A = r1(20 + 20*0.4) = r1(28.0) = 28.0
  _eq(p20['A']!, 28.0, '#0');
  n++;
  // cap = r1(20*0.4) = r1(8.0) = 8.0
  _eq(p20['cap']!, 8.0, '#1');
  n++;
  final p10 = plug(10, base: _base, r1: _r1);
  // A = r1(10 + 10*0.4) = r1(14.0) = 14.0
  _eq(p10['A']!, 14.0, '#2');
  n++;
  // cap = r1(10*0.4) = r1(4.0) = 4.0
  _eq(p10['cap']!, 4.0, '#3');
  n++;
  print('✓ plug: ' + n.toString() + ' Golden');
}
