// בדיקת-חוזה · pressureDropToString — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/to_string_test.dart
import 'to_string.dart';

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]:\ngot ="$got"\nwant="$want"');
}

void main() {
  var n = 0;

  _eq(
    pressureDropToString(
        dropBar: 0.5, totalK: 3.2, frictionMetres: 5.0, minBoreMm: 13.0, bottleneckSku: 'PIPE-A'),
    'ΔP = 0.50 bar  (K=3.20, L=5.0m, minBore=13.0mm, bottleneck=PIPE-A)',
    '1 with-sku',
  );
  n++;

  _eq(
    pressureDropToString(
        dropBar: 0.5, totalK: 3.2, frictionMetres: 5.0, minBoreMm: 13.0, bottleneckSku: null),
    'ΔP = 0.50 bar  (K=3.20, L=5.0m, minBore=13.0mm, bottleneck=—)',
    '2 null-sku-dash',
  );
  n++;

  _eq(
    pressureDropToString(
        dropBar: 1.239, totalK: 0.0, frictionMetres: 12.34, minBoreMm: 12.34, bottleneckSku: 'X'),
    'ΔP = 1.24 bar  (K=0.00, L=12.3m, minBore=12.3mm, bottleneck=X)',
    '3 rounding',
  );
  n++;

  _eq(
    pressureDropToString(
        dropBar: 100.0, totalK: 100.0, frictionMetres: 100.0, minBoreMm: 100.0, bottleneckSku: ''),
    'ΔP = 100.00 bar  (K=100.00, L=100.0m, minBore=100.0mm, bottleneck=)',
    '4 empty-sku-not-dash',
  );
  n++;

  assert(
    pressureDropToString(
            dropBar: 0.5, totalK: 3.2, frictionMetres: 5.0, minBoreMm: 13.0, bottleneckSku: null)
        .contains('bottleneck=—'),
    'assert-live guard',
  );

  print('OK pressureDropToString: $n asserts passed');
}
