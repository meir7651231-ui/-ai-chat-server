// בדיקת-חוזה · lineIsSupply — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/line_is_supply_test.dart
import 'line_is_supply.dart';

class _Prod {
  final String sku;
  const _Prod(this.sku);
}

// sku → endSystems, או חסר (⇒ null, כמו kVerifiedSpecs[sku]==null → מקור:69).
final Map<String, Set<WaterSystem>> _es = {
  'SUP': {WaterSystem.supply},
  'DRN': {WaterSystem.drainage},
  'BOTH': {WaterSystem.supply, WaterSystem.drainage},
  // 'RAW' — חסר ⇒ null.
};

Set<WaterSystem>? _esOf(_Prod p) => _es[p.sku];

bool _sup(List<String> skus) =>
    lineIsSupply(skus.map(_Prod.new).toList(), endSystemsOf: _esOf);

void _eq(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(_sup(['SUP']), true, '1 supply end ⇒ true');                n++;
  _eq(_sup(['DRN']), false, '2 drainage only ⇒ false');          n++;
  _eq(_sup(['DRN', 'SUP']), true, '3 any supply ⇒ true');        n++;
  _eq(_sup(['RAW']), false, '4 no spec ⇒ false');                n++;
  _eq(_sup([]), false, '5 empty ⇒ false');                       n++;
  _eq(_sup(['BOTH']), true, '6 both ⇒ true');                    n++;
  _eq(_sup(['DRN', 'RAW']), false, '7 drain+unknown ⇒ false');   n++;

  assert(_sup(['SUP']) == true, 'assert-live guard');
  print('OK lineIsSupply: $n asserts passed');
}
