// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _strMap — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/config_op.dart:143-145 (3 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): toString
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
Map<String, dynamic> _strMap(Map<dynamic, dynamic> m) =>
    m.map((k, v) => MapEntry(k.toString(), v));

