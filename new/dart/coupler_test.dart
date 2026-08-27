// בדיקת-Golden · coupler — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'coupler.dart';

void _eq(double got, double want, String lbl) {
  if (got != want) throw StateError('FAIL [$lbl]: got=$got want=$want');
}

// שקע-אמת: base מחזיר מפה עם F (עומק-שקע) + B; r1 = עיגול-פשוט לעשירית.
Map<String, double> _base(int od) =>
    {'F': od.toDouble(), 'B': od * 2.0, 'OD': od.toDouble()};
double _r1(double x) => (x * 10).round() / 10;

void main() {
  var n = 0;
  final c20 = coupler(20, base: _base, r1: _r1);
  // A = r1(2*20 + 2) = r1(42) = 42.0
  _eq(c20['A']!, 42.0, '#0');
  n++;
  // הבסיס נשמר (F הוזרם מ-base).
  _eq(c20['F']!, 20.0, '#1');
  n++;
  final c10 = coupler(10, base: _base, r1: _r1);
  // A = r1(2*10 + 2) = r1(22) = 22.0
  _eq(c10['A']!, 22.0, '#2');
  n++;
  // B מהבסיס נשאר ללא-נגיעה.
  _eq(c10['B']!, 20.0, '#3');
  n++;
  print('✓ coupler: ' + n.toString() + ' Golden');
}
