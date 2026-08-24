import 'advance-status.dart';

/// רתמת-זהב: אותן 5 דוגמאות-חוזה בדיוק מ-new/atoms/advance-status.test.mjs.
void main() {
  final c = [
    ['pickup', 'enroute'],
    ['enroute', 'delivered'],
    ['delivered', 'delivered'],
    ['שטויות', 'delivered'],
    ['', 'delivered'],
  ];
  var f = 0;
  for (final row in c) {
    final a = row[0];
    final w = row[1];
    final g = advanceStatus(a);
    if (g != w) {
      print('✗ "$a" ⇒ $g ≠ $w');
      f = 1;
    }
  }
  if (f != 0) throw StateError('advance-status: סטייה מהמקור');
  print('✓ advance-status: 5 דוגמאות-חוזה — ירוק');
}
