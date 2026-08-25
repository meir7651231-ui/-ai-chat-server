// 🥇 רתמת-זהב · priceSuffix — Dart≡JS. ה-assert-ים = בדיוק דוגמאות-החוזה של new/atoms/price-suffix.test.mjs
// (אותם קלטים→פלטים). עובר ⇒ הפורט זהה-התנהגות למקור-ה-JS. הרצה:
//   dart run --enable-asserts new/dart-maor/price-suffix_test.dart  ⇒  exit 0.

import 'price-suffix.dart';

void run(String model, String want) {
  final got = priceSuffix(model);
  if (got != want) {
    throw AssertionError('✗ $model ⇒ $got ≠ $want');
  }
}

void main() {
  run('half_year', 'לחצי שנה');
  run('year', 'לשנה');
  run('punch', '');
  run('month', 'לחודש');
  run('אחר', 'לחודש');

  print('✓ price-suffix: 5 דוגמאות-חוזה — Dart≡JS ירוק');
}
