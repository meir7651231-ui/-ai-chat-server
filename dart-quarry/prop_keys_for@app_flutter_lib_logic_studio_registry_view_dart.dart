// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · propKeysFor — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/registry_view.dart:185-191 (7 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): findDescriptor
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  Set<String> propKeysFor(String id) {
    final d = findDescriptor(_descriptors, id);
    if (d == null) return _empty; // fail-closed (R1-2)
    return {for (final a in d.editableProps) a.name};
  }

  @override
