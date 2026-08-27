// בדיקת-חוזה golden · filterSmartBySystem — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/filter_smart_by_system_test.dart
import 'filter_smart_by_system.dart';

void main() {
  var n = 0;
  // אינסטנסים נפרדים (const עם מחלקה-ריקה מקנוניזציה לאובייקט-יחיד ⇒ non-const)
  final a = SmartProduct();
  final b = SmartProduct();
  final c = SmartProduct();
  final list = [a, b, c];

  // חיווי-שקע: a שייך ל-supply · b ל-drainage · c לשניהם
  bool inSystem(SmartProduct p, WaterSystem s) {
    if (identical(p, c)) return true;
    if (identical(p, a)) return s == WaterSystem.supply;
    return s == WaterSystem.drainage; // b
  }

  // system==null ⇒ הרשימה כמות-שהיא (זהות-אובייקט)
  final r1 = filterSmartBySystem(list, null, inSystem: inSystem);
  if (!identical(r1, list)) throw StateError('FAIL 1 identity');
  n++;

  // supply ⇒ a + c
  final r2 = filterSmartBySystem(list, WaterSystem.supply, inSystem: inSystem);
  if (r2.length != 2 || !identical(r2[0], a) || !identical(r2[1], c)) {
    throw StateError('FAIL 2: ${r2.length}');
  }
  n++;

  // drainage ⇒ b + c
  final r3 = filterSmartBySystem(list, WaterSystem.drainage, inSystem: inSystem);
  if (r3.length != 2 || !identical(r3[0], b) || !identical(r3[1], c)) {
    throw StateError('FAIL 3: ${r3.length}');
  }
  n++;

  // חיווי-שקע שמסנן-הכול ⇒ ריק
  final r4 = filterSmartBySystem(list, WaterSystem.supply,
      inSystem: (_, __) => false);
  if (r4.isNotEmpty) throw StateError('FAIL 4');
  n++;

  assert(
      filterSmartBySystem(list, WaterSystem.supply, inSystem: (_, __) => true)
              .length ==
          3,
      'assert-live');
  print('OK filterSmartBySystem: $n asserts passed');
}
