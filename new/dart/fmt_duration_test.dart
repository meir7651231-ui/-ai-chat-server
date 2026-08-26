// בדיקת-חוזה · fmtDuration — מייבאת רק את האטום-שלה (חוק-4).
// אימות: dart run --enable-asserts new/dart/fmt_duration_test.dart ⇒ exit 0.
import 'fmt_duration.dart';

void _eq(String got, String want, String msg) {
  if (got != want) {
    throw StateError('FAIL $msg\n  got : $got\n  want: $want');
  }
}

void main() {
  _eq(fmtDuration(const Duration(hours: 7, minutes: 45)), '7:45', 'ex1');
  _eq(fmtDuration(Duration.zero), '0:00', 'ex2');
  _eq(fmtDuration(const Duration(hours: 1, minutes: 30)), '1:30', 'ex3');
  _eq(fmtDuration(const Duration(hours: 8, minutes: 5)), '8:05', 'ex4-pad');
  _eq(fmtDuration(const Duration(hours: 25)), '25:00', 'ex5-over24');
  print('OK fmt_duration 5/5');
}
