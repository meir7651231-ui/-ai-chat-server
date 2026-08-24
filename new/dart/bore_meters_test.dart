// בדיקת-חוזה · boreMeters — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/bore_meters_test.dart
import 'bore_meters.dart';

// שקע-הבדיקה: ערכי-המקור verbatim (lipskey_verified_connections.dart:32-35).
const Map<String, int> _bsp = {
  '1/4': 8, '3/8': 10, '1/2': 15, '3/4': 20,
  '1': 25, '1-1/4': 32, '1-1/2': 40, '2': 50, '2-1/2': 65,
};

double? _b(EndType t, String size) =>
    boreMeters(ConnectorEnd(t, size), bspInchToMm: _bsp);

void _eq(double? got, double? want, String label) {
  final ok = (got == null && want == null) ||
      (got != null && want != null && (got - want).abs() < 1e-12);
  if (!ok) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — קבוצת-DN (מ״מ → מטר) —
  _eq(_b(EndType.hdpeCompression, '32'), 0.032, '1 hdpe 32');      n++;
  _eq(_b(EndType.drainOpening, '50'), 0.050, '2 drain 50');        n++;
  _eq(_b(EndType.pexPress, '16'), 0.016, '3 pex 16');              n++;
  _eq(_b(EndType.copperPress, '22'), 0.022, '4 copper 22');        n++;

  // — קבוצת-BSP (מפה → מטר), עם/בלי גרש ורווחים —
  _eq(_b(EndType.bspMale, '1/2"'), 0.015, '5 bsp 1/2');            n++;
  _eq(_b(EndType.bspFemale, '3/4"'), 0.020, '6 bsp 3/4');          n++;
  _eq(_b(EndType.bspMale, '1'), 0.025, '7 bsp 1 no-quote');        n++;
  _eq(_b(EndType.bspMale, '2-1/2"'), 0.065, '8 bsp 2-1/2');        n++;
  _eq(_b(EndType.bspFemale, '2'), 0.050, '12 bsp 2');              n++;
  _eq(_b(EndType.bspMale, ' 1/2" '), 0.015, 'trim+quote strip');   n++;

  // — דין-קצה (עדשה-עוינת) —
  _eq(_b(EndType.hdpeCompression, '0'), 0.0, '9 dn zero');         n++;
  _eq(_b(EndType.hdpeCompression, '1/2'), null, '10 dn non-int');  n++;
  _eq(_b(EndType.bspMale, '5/8"'), null, '11 bsp not-in-map');     n++;
  _eq(_b(EndType.hdpeCompression, '-5'), -0.005, 'dn negative');   n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_b(EndType.hdpeCompression, '32') == 0.032, 'assert-live guard');

  print('OK boreMeters: $n asserts passed');
}
