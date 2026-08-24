// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · smartProductInSystem — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/system_division.dart:118-130 (13 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): smartProductSystems, contains, filterSmartBySystem, where, toList
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool smartProductInSystem(SmartProduct sp, WaterSystem? system) {
  if (system == null) return true;
  final sys = smartProductSystems(sp);
  return sys.isEmpty || sys.contains(system);
}

/// Pure: keep smart-tree products that belong to [system] (null → all).
List<SmartProduct> filterSmartBySystem(
        List<SmartProduct> list, WaterSystem? system) =>
    system == null
        ? list
        : list.where((p) => smartProductInSystem(p, system)).toList();

