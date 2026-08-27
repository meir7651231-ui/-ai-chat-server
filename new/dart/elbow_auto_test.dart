import 'elbow_auto.dart';

// stub-אמת לשני השקעים — מסמנים איזה ענף נבחר.
Map<String, double> miteredElbow(int d) => {'mode': 1, 'd': d.toDouble()};
Map<String, double> elbow(int od, {int angle = 90}) =>
    {'mode': 2, 'd': od.toDouble(), 'angle': angle.toDouble()};

void main() {
  // d=200 ≥ 160 ⇒ מחותכת.
  final big = elbowAuto(200, miteredElbow: miteredElbow, elbow: elbow);
  assert(big['mode'] == 1 && big['d'] == 200);
  // d=110 < 160, angle ברירת-מחדל 90 ⇒ ברך רגילה.
  final small = elbowAuto(110, miteredElbow: miteredElbow, elbow: elbow);
  assert(small['mode'] == 2 && small['angle'] == 90);
  // d=110, angle=45 ⇒ מועבר לשקע elbow.
  final a45 = elbowAuto(110, angle: 45, miteredElbow: miteredElbow, elbow: elbow);
  assert(a45['mode'] == 2 && a45['angle'] == 45);
  // גבול: d=160 ⇒ מחותכת (≥).
  final edge = elbowAuto(160, miteredElbow: miteredElbow, elbow: elbow);
  assert(edge['mode'] == 1);
  print('elbowAuto OK');
}
