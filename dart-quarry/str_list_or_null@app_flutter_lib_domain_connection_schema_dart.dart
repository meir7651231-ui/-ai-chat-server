// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _strListOrNull — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/domain/connection_schema.dart:35-45 (11 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): toList
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
List<String>? _strListOrNull(Object? v) =>
    v is List ? v.whereType<String>().toList() : null;
Map<String, num> _numMap(Object? v) => v is Map
    ? {for (final e in v.entries) if (e.value is num) '${e.key}': e.value as num}
    : const {};
List<List<String>>? _sizeTable(Object? v) => v is List
    ? v
        .whereType<List<dynamic>>()
        .map((row) => row.whereType<String>().toList())
        .toList()
    : null;
