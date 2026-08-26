// בדיקת-חוזה · conditionMatches — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/condition_matches_test.dart
import 'condition_matches.dart';

// שקע-הבדיקה: fieldValue שמחזיר את הערך שהוזרק ב-"order" (int), מתעלם מ-field/now.
num _fv(String field, int order, DateTime now) => order;

void _t(int v, String op, num value, bool want, String label) {
  final got = conditionMatches(
    (field: 'sum', op: op, value: value),
    v,
    DateTime.utc(2026, 1, 1),
    fieldValue: _fv,
  );
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  _t(10, '>', 5, true, '1 gt-true');
  n++;
  _t(10, '>=', 10, true, '2 ge-eq');
  n++;
  _t(10, '<', 5, false, '3 lt-false');
  n++;
  _t(5, '<=', 5, true, '4 le-eq');
  n++;
  _t(5, '=', 5, true, '5 eq-true');
  n++;
  _t(5, '=', 6, false, '6 eq-false');
  n++;
  _t(10, '!=', 5, false, '7 unknown-op');
  n++;
  _t(10, '', 5, false, '8 empty-op');
  n++;

  // ודא שה-field/order/now אכן מגיעים לשקע (שדה שונה, אותה הזרקה)
  final passed = conditionMatches(
    (field: 'ageDays', op: '>', value: 0),
    3,
    DateTime.utc(2026, 5, 5),
    fieldValue: (f, o, t) {
      if (f != 'ageDays' || o != 3) throw StateError('slot args wrong');
      return o.toDouble();
    },
  );
  if (!passed) throw StateError('FAIL [9 slot-passthrough]');
  n++;

  assert(conditionMatches((field: 'x', op: '>', value: 1), 2,
      DateTime.utc(2026), fieldValue: _fv), 'assert-live guard');

  print('OK conditionMatches: $n asserts passed');
}
