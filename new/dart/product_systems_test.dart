// בדיקת-חוזה · productSystems — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/product_systems_test.dart
import '../dart-data/product_systems-data.dart' as td_product_systems;
import 'product_systems.dart';

Set<WaterSystem> _sys(String cat, Set<WaterSystem>? ends) =>
    productSystems(cat, endSystemsOf: () => ends, supplyCats: td_product_systems.supplyCats, drainCats: td_product_systems.drainCats, fixtureCats: td_product_systems.fixtureCats, structuralCats: td_product_systems.structuralCats, allSystems: td_product_systems.allSystems);

void _eq(Set<WaterSystem> got, Set<WaterSystem> want, String label) {
  if (got.length != want.length || !got.containsAll(want)) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;
  const supply = {WaterSystem.supply};
  const drain = {WaterSystem.drainage};
  const both = {WaterSystem.supply, WaterSystem.drainage};

  // קטגוריה מקבעת — ה-endSystemsOf לא-נקרא (thunk עצל).
  _eq(_sys('אביזרי נחושת', null), supply, '1 supply cat');         n++;
  _eq(_sys('סיפונים', null), drain, '2 drain cat');                n++;
  _eq(_sys('אסלות וכיורים', null), both, '3 fixture ⇒ both');       n++;
  _eq(_sys('חבקי תליה', null), both, '4 structural ⇒ both');        n++;
  // קטגוריה עמומה ('אביזרי תבריג' לא-ברשימות) ⇒ נופל לקצוות.
  _eq(_sys('אביזרי תבריג', supply), supply, '5 ambiguous→ends supply'); n++;
  _eq(_sys('אביזרי תבריג', null), both, '6 ambiguous no-spec ⇒ both');  n++;
  _eq(_sys('אביזרי תבריג', <WaterSystem>{}), both, '7 ambiguous empty ⇒ both'); n++;

  assert(_sys('אביזרי נחושת', null).contains(WaterSystem.supply),
      'assert-live guard');
  print('OK productSystems: $n asserts passed');
}
