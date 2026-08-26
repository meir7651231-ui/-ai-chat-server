// בדיקת-חוזה · retentionPct — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/retention_pct_test.dart
import 'retention_pct.dart';

// שקע-returning: 0→10, 1→5, אחרת 0.
int _ret(int off) => off == 0 ? 10 : (off == 1 ? 5 : 0);

double _s(int off, {int size = 10}) =>
    retentionPct(off, size: size, returning: _ret, percentScale: 100);

void _eq(double got, double want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  _eq(_s(0), 100.0, '1 day0 full'); n++;
  _eq(_s(1), 50.0, '2 day1 half'); n++;
  _eq(_s(2), 0.0, '3 day2 none'); n++;
  _eq(_s(99), 0.0, '4 far offset'); n++;
  _eq(_s(0, size: 0), 0.0, '5 empty cohort guard'); n++;

  // 6 — נאמנות: returning>size ⇒ אחוז מעל 100 (אין תקרה).
  _eq(retentionPct(0, size: 10, returning: (_) => 20, percentScale: 100),
      200.0, '6 over-100 fidelity'); n++;

  assert(_s(0) == 100.0, 'assert-live guard');
  print('OK retentionPct: $n asserts passed');
}
