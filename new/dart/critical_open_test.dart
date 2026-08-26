// בדיקת-חוזה · criticalOpen — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/critical_open_test.dart
import 'critical_open.dart';

typedef _Item = ({bool satisfied, bool critical});

// שקע-בדיקה: מחזיר רשימה קבועה, ומאמת שה-tempC/accessories אכן עוברים.
List<_Item> Function(int, Set<String>) _fixed(List<_Item> items) =>
    (tempC, acc) => items;

void _eq(int got, int want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  _eq(
      criticalOpen(60,
          compliance: _fixed(const [
            (satisfied: false, critical: true),
            (satisfied: true, critical: true),
            (satisfied: false, critical: false),
          ])),
      1,
      '1 one-open');
  n++;

  _eq(criticalOpen(60, compliance: _fixed(const [])), 0, '2 empty');
  n++;

  _eq(
      criticalOpen(60,
          compliance: _fixed(const [
            (satisfied: true, critical: true),
            (satisfied: true, critical: true),
          ])),
      0,
      '3 all-satisfied');
  n++;

  _eq(
      criticalOpen(60,
          compliance: _fixed(const [
            (satisfied: false, critical: true),
            (satisfied: false, critical: true),
            (satisfied: false, critical: false),
          ])),
      2,
      '4 two-open');
  n++;

  _eq(
      criticalOpen(60,
          compliance: _fixed(const [
            (satisfied: false, critical: false),
            (satisfied: false, critical: false),
          ])),
      0,
      '5 none-critical');
  n++;

  // ודא ש-tempC/accessories מגיעים לשקע
  final ok = criticalOpen(85, accessories: {'insulation'}, compliance: (t, a) {
    if (t != 85 || !a.contains('insulation')) throw StateError('slot args wrong');
    return const [(satisfied: false, critical: true)];
  });
  _eq(ok, 1, '6 slot-passthrough');
  n++;

  assert(criticalOpen(60,
          compliance: _fixed(const [(satisfied: false, critical: true)])) ==
      1, 'assert-live guard');

  print('OK criticalOpen: $n asserts passed');
}
