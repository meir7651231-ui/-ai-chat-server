import 'bom_rows.dart';

void _eq(Object? g, Object? w, String l) {
  if (g != w) throw StateError('FAIL [$l]: $g != $w');
}

void main() {
  var n = 0;
  const a = LipskeyCatalogProduct(sku: 'A', nameHe: 'ברז');
  const b = LipskeyCatalogProduct(sku: 'B', nameHe: 'ברך');
  final plan = const InstallationPlan([a, b], {'A': 3});
  final rows = bomRows(plan);
  _eq(rows.length, 2, '1');
  n++;
  // A carries an explicit quantity → 3
  _eq(rows[0].qty, 3, '2');
  n++;
  // B missing from quantities → qtyOf falls back to 1
  _eq(rows[1].qty, 1, '3');
  n++;
  _eq(rows[1].nameHe, 'ברך', '4');
  n++;
  // empty plan → empty BOM (M1: no throw)
  _eq(bomRows(const InstallationPlan([], {})).length, 0, '5');
  n++;
  print('✓ bomRows: $n');
}
