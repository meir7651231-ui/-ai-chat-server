// בדיקת-חוזה · pipeConnectionDn — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/pipe_connection_dn_test.dart
import 'pipe_connection_dn.dart';

// שקעים דטרמיניסטיים: קצה מיוצג כמידתו; "חולק חיבור" = שוויון-מידה.
bool _shared(String a, String b) => a == b;
String _size(String e) => e;

void _eq(String? got, String? want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  _eq(pipeConnectionDn(const ['32'], const ['32'], pipeShared: _shared, sizeOf: _size),
      '32', '1 direct'); n++;
  _eq(
      pipeConnectionDn(const ['32', '40'], const ['40'],
          pipeShared: _shared, sizeOf: _size),
      '40',
      '2 second end matches'); n++;
  _eq(pipeConnectionDn(const <String>[], const ['32'], pipeShared: _shared, sizeOf: _size),
      null, '3 no spec A'); n++;
  _eq(pipeConnectionDn(const ['32'], const <String>[], pipeShared: _shared, sizeOf: _size),
      null, '4 no spec B'); n++;
  _eq(pipeConnectionDn(const ['50'], const ['32'], pipeShared: _shared, sizeOf: _size),
      null, '5 no shared'); n++;
  _eq(
      pipeConnectionDn(const ['32', '40'], const ['40', '32'],
          pipeShared: _shared, sizeOf: _size),
      '32',
      '6 first outer wins'); n++;
  _eq(
      pipeConnectionDn(const ['32', '32'], const ['32'],
          pipeShared: _shared, sizeOf: _size),
      '32',
      '7 duplicate end'); n++;

  assert(
      pipeConnectionDn(const ['110'], const ['110'],
              pipeShared: _shared, sizeOf: _size) ==
          '110',
      'assert-live guard');

  print('OK pipeConnectionDn: $n asserts passed');
}
