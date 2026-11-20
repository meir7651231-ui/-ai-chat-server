// בדיקת-חוזה · linCycles — שקילות ל-Math.floor של new/atoms/lin-cycles.mjs, כולל מונה שלילי.
// הרצה: dart run --enable-asserts new/dart-maor/lin-cycles_test.dart ⇒ OK
import 'lin-cycles.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  // [n, a, b, c, want] — want = Math.floor((a*n-b)/c) כפי שמחושב ב-node
  const cases = [
    [10, 235, 1, 19, 123],   // מונה חיובי
    [0, 235, 1, 19, -1],     // ‏-1/19 ⇒ רצפה -1 (חיתוך-לאפס היה 0)
    [-1, 235, 1, 19, -13],   // ‏-236/19 ⇒ -13 (חיתוך-לאפס היה -12)
    [-2, 7, 0, 7, -2],       // שלילי מתחלק-בדיוק ⇒ ללא תיקון
    [3, 1, 0, -2, -2],       // מחלק שלילי: 3/-2 ⇒ -2
    [-3, 1, 0, -2, 1],       // שלילי/שלילי: -3/-2=1.5 ⇒ 1
  ];
  for (final t in cases) {
    final got = linCycles(t[0], t[1], t[2], t[3]);
    _ok(got == t[4], 'linCycles(${t[0]},${t[1]},${t[2]},${t[3]}) = $got ≠ ${t[4]}');
  }
  print('OK');
}
