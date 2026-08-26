// בדיקת-חוזה · minBoreMmOf — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/min_bore_mm_of_test.dart
import 'min_bore_mm_of.dart';

const Map<String, double> _bsp = {'1': 25.0, '3/4': 20.0};

void _eq(double? got, double? want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  _eq(minBoreMmOf(ends: null, bspInchToMm: _bsp), null, '1 null spec'); n++;
  _eq(minBoreMmOf(ends: const [], bspInchToMm: _bsp), null, '2 no ends'); n++;
  _eq(
      minBoreMmOf(
          ends: const [(type: EndType.copperPress, size: '22')],
          bspInchToMm: _bsp),
      22.0,
      '3 single metric'); n++;
  _eq(
      minBoreMmOf(ends: const [
        (type: EndType.copperPress, size: '22'),
        (type: EndType.pexPress, size: '16'),
      ], bspInchToMm: _bsp),
      16.0,
      '4 min of two'); n++;
  _eq(
      minBoreMmOf(
          ends: const [(type: EndType.bspFemale, size: '3/4"')],
          bspInchToMm: _bsp),
      20.0,
      '5 bsp inch->mm'); n++;
  _eq(
      minBoreMmOf(
          ends: const [(type: EndType.drainOpening, size: 'abc')],
          bspInchToMm: _bsp),
      null,
      '6 unparsable skipped'); n++;
  _eq(
      minBoreMmOf(ends: const [
        (type: EndType.copperPress, size: '22'),
        (type: EndType.bspMale, size: '1"'),
      ], bspInchToMm: _bsp),
      22.0,
      '7 metric beats bsp'); n++;

  assert(
      minBoreMmOf(
              ends: const [(type: EndType.bspMale, size: '2"')],
              bspInchToMm: _bsp) ==
          null,
      'assert-live guard'); // '2' לא במפה ⇒ מדולג ⇒ null

  print('OK minBoreMmOf: $n asserts passed');
}
