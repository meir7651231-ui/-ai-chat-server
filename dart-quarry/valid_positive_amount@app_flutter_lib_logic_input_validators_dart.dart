// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · validPositiveAmount — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/input_validators.dart:91-96 (6 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): validDateRange, isAfter
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool validPositiveAmount(num? value) =>
    value != null && value.isFinite && value > 0;

/// Date range: [end] must be strictly after [start].
bool validDateRange(DateTime start, DateTime end) => end.isAfter(start);

