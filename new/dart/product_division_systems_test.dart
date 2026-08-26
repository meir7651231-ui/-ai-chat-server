// בדיקת-חוזה · productDivisionSystems — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/product_division_systems_test.dart
import 'product_division_systems.dart';

void _eqSet(Set<WaterSystem> got, Set<WaterSystem> want, String label) {
  if (got.length != want.length || !got.containsAll(want)) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — מותג מכריע כשאין spec (null) —
  _eqSet(productDivisionSystems('פולירול', verifiedEndSystems: null),
      {WaterSystem.supply}, '1 polirol'); n++;
  _eqSet(productDivisionSystems('חוליות', verifiedEndSystems: null),
      {WaterSystem.drainage}, '2 default'); n++;

  // — spec לא-ריק גובר על הכול —
  _eqSet(
      productDivisionSystems('כלשהו',
          verifiedEndSystems: {WaterSystem.supply, WaterSystem.drainage}),
      {WaterSystem.supply, WaterSystem.drainage}, '3 spec-both'); n++;
  _eqSet(productDivisionSystems('פולירול', verifiedEndSystems: {WaterSystem.drainage}),
      {WaterSystem.drainage}, '4 spec-over-brand'); n++;
  _eqSet(productDivisionSystems('x', verifiedEndSystems: {WaterSystem.supply}),
      {WaterSystem.supply}, '9 spec-single'); n++;

  // — spec ריק ⇒ נופל לענף-המותג —
  _eqSet(productDivisionSystems('כלשהו', verifiedEndSystems: {}),
      {WaterSystem.drainage}, '5 empty-spec-default'); n++;
  _eqSet(productDivisionSystems('פולירול', verifiedEndSystems: {}),
      {WaterSystem.supply}, '6 empty-spec-polirol'); n++;

  // — עדשה-עוינת: השוואת-מותג מדויקת —
  _eqSet(productDivisionSystems('', verifiedEndSystems: null),
      {WaterSystem.drainage}, '7 empty-brand'); n++;
  _eqSet(productDivisionSystems('פולירול ', verifiedEndSystems: null),
      {WaterSystem.drainage}, '8 trailing-space'); n++;

  // assert חי (חוק: --enable-asserts) —
  assert(productDivisionSystems('פולירול', verifiedEndSystems: null)
      .contains(WaterSystem.supply), 'assert-live guard');

  print('OK productDivisionSystems: $n asserts passed');
}
