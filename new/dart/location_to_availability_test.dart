// בדיקת-חוזה · locationToAvailability — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/location_to_availability_test.dart
import 'location_to_availability.dart';

void _eq(StockAvailability got, StockAvailability want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  _eq(locationToAvailability('warehouse'), StockAvailability.warehouse,
      '1 warehouse'); n++;
  _eq(locationToAvailability('site'), StockAvailability.site, '2 site'); n++;
  _eq(locationToAvailability(''), StockAvailability.site, '3 empty->site'); n++;
  _eq(locationToAvailability('Warehouse'), StockAvailability.site,
      '4 case-sensitive->site'); n++;
  _eq(locationToAvailability('anything'), StockAvailability.site,
      '5 other->site'); n++;

  assert(locationToAvailability('warehouse') == StockAvailability.warehouse,
      'assert-live guard');

  print('OK locationToAvailability: $n asserts passed');
}
