// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · matchComponentType — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/registry_view.dart:293-298 (6 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): componentTypes
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String? matchComponentType(RegistryView reg, String reply) =>
    _matchClosed(reg.componentTypes(), reply);

/// Addition-a (§9 · step 76 scope-expansion): EVERY real element id CONTAINED in
/// [reply], not just the best — so an utterance naming several targets resolves to
/// all of them, still only over REAL ids (never model-enumerated). Blank → empty.
