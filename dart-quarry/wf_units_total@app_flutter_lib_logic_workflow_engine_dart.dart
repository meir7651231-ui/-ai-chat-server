// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · wfUnitsTotal — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/workflow_engine.dart:136-139 (4 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): fold
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
int wfUnitsTotal(WfCase a) =>
    a.names.fold(0, (t, x) => t + (x.units ?? 0));

/// "פעיל" — מוצג בלוח ברגע שקרתה אינטראקציה כלשהי.
