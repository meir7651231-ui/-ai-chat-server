// בדיקת-חוזה · fieldValue — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/field_value_test.dart
import 'field_value.dart';

void _eq(num got, num want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

// ישות-record סינתטית (במקור Order).
typedef _Order = ({DateTime? createdAt, num sum, num items});

void main() {
  var n = 0;
  final now = DateTime(2026, 8, 26, 12, 0);

  num fv(String field, _Order o) => fieldValue<_Order>(
        field,
        o,
        now,
        createdAt: (x) => x.createdAt,
        sum: (x) => x.sum,
        items: (x) => x.items,
        ageDaysField: 'ageDays',
        sumField: 'sum',
        itemsField: 'items',
      );

  final _Order o1 = (createdAt: DateTime(2026, 8, 16, 12, 0), sum: 540, items: 3);
  final _Order oNull = (createdAt: null, sum: 0, items: 0);
  final _Order oSameDay = (createdAt: DateTime(2026, 8, 26, 0, 0), sum: 0, items: 0);

  _eq(fv('ageDays', o1), 10, '1 age 10 days'); n++;
  _eq(fv('ageDays', oNull), 0, '2 null created'); n++;
  _eq(fv('ageDays', oSameDay), 0, '3 <1 day floors'); n++;
  _eq(fv('sum', o1), 540, '4 sum'); n++;
  _eq(fv('items', o1), 3, '5 items'); n++;
  _eq(fv('unknown', o1), 0, '6 fallthrough'); n++;

  assert(fv('sum', o1) == 540, 'assert-live guard');

  print('OK fieldValue: $n asserts passed');
}
