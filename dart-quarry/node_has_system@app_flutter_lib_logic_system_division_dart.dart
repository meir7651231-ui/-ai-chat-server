// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · nodeHasSystem — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/system_division.dart:70-75 (6 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): contains
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool nodeHasSystem(CatalogNode node, WaterSystem system) {
  if (_fixtureTitles.contains(node.title)) return true;
  final cacheKey = '${node.id}|${system.name}';
  final cached = _nodeHasSystemCache[cacheKey];
  if (cached != null) return cached;
  var sup = 0, dr = 0;
