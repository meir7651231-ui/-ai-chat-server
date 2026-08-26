// בדיקת-חוזה · productMaxTempC — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/product_max_temp_c_test.dart
import 'product_max_temp_c.dart';

// שקעי-הבדיקה: מוצר בעל sku, spec בעל maxTempC (מראה install_engine.dart:51).
class _Prod {
  final String sku;
  const _Prod(this.sku);
}

class _Spec {
  final double maxTempC;
  const _Spec(this.maxTempC);
}

// "מסד-ה-specs": sku → spec, או חסר (⇒ null, כמו kVerifiedSpecs[sku]==null).
const Map<String, _Spec> _specs = {
  'HDPE': _Spec(40), // ברירת-מחדל HDPE
  'PEX': _Spec(95),
  'CU': _Spec(110),
  // 'RAW' — לא קיים במכוון (⇒ null).
};

_Spec? _specOf(_Prod p) => _specs[p.sku];
double _maxOf(_Spec s) => s.maxTempC;

double? _t(String sku) =>
    productMaxTempC(_Prod(sku), specOf: _specOf, maxTempCOf: _maxOf);

void _eq(double? got, double? want, String label) {
  final ok = (got == null && want == null) ||
      (got != null && want != null && (got - want).abs() < 1e-12);
  if (!ok) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(_t('HDPE'), 40, '1 HDPE ⇒ 40');          n++;
  _eq(_t('PEX'), 95, '2 PEX ⇒ 95');            n++;
  _eq(_t('CU'), 110, '3 copper ⇒ 110');        n++;
  _eq(_t('RAW'), null, '4 no spec ⇒ null');    n++;

  assert(_t('HDPE') == 40, 'assert-live guard');
  print('OK productMaxTempC: $n asserts passed');
}
