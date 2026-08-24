// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · allowedValues — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/registry_view.dart:192-197 (6 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): findDescriptor
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  Set<String> allowedValues(String id, String propKey) {
    final vals = findDescriptor(_descriptors, id)?.allowedValues[propKey];
    return vals == null ? _empty : Set<String>.of(vals);
  }

  @override
