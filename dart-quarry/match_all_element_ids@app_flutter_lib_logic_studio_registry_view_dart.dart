// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · matchAllElementIds — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/registry_view.dart:299-301 (3 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): elementIds
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
Set<String> matchAllElementIds(RegistryView reg, String reply) =>
    _matchAllClosed(reg.elementIds(), reply);

