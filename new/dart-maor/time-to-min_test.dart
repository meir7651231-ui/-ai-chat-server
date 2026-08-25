/// בדיקת חוט time-to-min — כל דוגמאות-החוזה + מקרי בדיקת-ה-JS (זהים).
import 'time-to-min.dart';

void check(dynamic t, num want) {
  final g = timeToMin(t);
  final ok = want.isNaN ? (g is num && g.isNaN) : g == want;
  if (!ok) throw StateError('✗ timeToMin($t) = $g ≠ $want');
}

void main() {
  // דוגמאות מחייבות מהחוזה (= בדיקת-ה-JS, 8 מקרים):
  check('9:30', 570);
  check('00:00', 0);
  check('23:59', 1439);
  check(' 12:05 ', 725); // גזימה
  check('9:5', double.nan); // דקה חד-ספרתית
  check('930', double.nan);
  check('', double.nan);
  check(null, double.nan);
  print('OK');
}
