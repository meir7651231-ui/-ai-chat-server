// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _strList — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/domain/trade_schema.dart:36-40 (5 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): toList
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
List<String> _strList(Object? v) =>
    v is List ? v.whereType<String>().toList() : const [];
Map<String, String> _strMap(Object? v) => v is Map
    ? v.map((k, val) => MapEntry('$k', '$val'))
    : const {};
