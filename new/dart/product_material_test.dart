// בדיקת-חוזה · productMaterial — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/product_material_test.dart
import 'product_material.dart';

class _Prod {
  final String sku;
  const _Prod(this.sku);
}

class _Spec {
  final String material;
  const _Spec(this.material);
}

// sku → spec, או חסר (⇒ null, כמו kVerifiedSpecs[sku]==null → מקור:54).
const Map<String, _Spec> _specs = {
  'A': _Spec('HDPE'),
  'B': _Spec('PEX'),
  'C': _Spec('נחושת'),
  'D': _Spec('פליז'),
  // 'RAW' — לא קיים (⇒ null).
};

_Spec? _specOf(_Prod p) => _specs[p.sku];
String _matOf(_Spec s) => s.material;

String? _m(String sku) =>
    productMaterial(_Prod(sku), specOf: _specOf, materialOf: _matOf);

void _eq(String? got, String? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(_m('A'), 'HDPE', '1 HDPE');           n++;
  _eq(_m('B'), 'PEX', '2 PEX');             n++;
  _eq(_m('C'), 'נחושת', '3 copper');        n++;
  _eq(_m('D'), 'פליז', '4 brass');          n++;
  _eq(_m('RAW'), null, '5 no spec ⇒ null'); n++;

  assert(_m('A') == 'HDPE', 'assert-live guard');
  print('OK productMaterial: $n asserts passed');
}
