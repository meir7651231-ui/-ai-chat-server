// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · recommendedKitFor — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_kit.dart:155-158 (4 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
List<KitItem> recommendedKitFor(List<LipskeyCatalogProduct> chain) {
  if (chain.length < 2) return const [];
  final out = <String, KitItem>{};

