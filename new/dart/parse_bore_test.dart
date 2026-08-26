// בדיקת-חוזה · parseBore — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/parse_bore_test.dart
import 'parse_bore.dart';

void _eq(double? got, double? want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  _eq(parseBore(const {}, boreDimsKey: null, boreParse: BoreParseStrategy.dnDirect),
      null, '1 null key'); n++;
  _eq(
      parseBore(const {'di': '13.6–14.7'},
          boreDimsKey: 'di', boreParse: BoreParseStrategy.diRangeMax),
      14.7,
      '2 range max'); n++;
  _eq(
      parseBore(null,
          boreDimsKey: 'di', boreParse: BoreParseStrategy.diRangeMax),
      null,
      '3 null dims'); n++;
  _eq(
      parseBore(const {'di': 'N/A'},
          boreDimsKey: 'di', boreParse: BoreParseStrategy.diRangeMax),
      null,
      '4 no numbers'); n++;
  _eq(
      parseBore(const {'dn': '50'},
          boreDimsKey: 'dn', boreParse: BoreParseStrategy.dnDirect),
      50.0,
      '5 dn direct'); n++;
  _eq(
      parseBore(const {'dn': 'abc'},
          boreDimsKey: 'dn', boreParse: BoreParseStrategy.dnDirect),
      null,
      '6 unparsable'); n++;
  _eq(
      parseBore(const {'dn': '50'},
          boreDimsKey: 'dn', boreParse: BoreParseStrategy.none),
      null,
      '7 strategy none'); n++;

  assert(
      parseBore(const {'di': '32'},
              boreDimsKey: 'di', boreParse: BoreParseStrategy.diRangeMax) ==
          32.0,
      'assert-live guard');

  print('OK parseBore: $n asserts passed');
}
