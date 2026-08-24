// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _sizeMatchFrom — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/domain/connection_schema.dart:46-50 (5 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): firstWhere
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
SizeMatch _sizeMatchFrom(Object? v) =>
    SizeMatch.values.firstWhere((e) => e.name == v, orElse: () => SizeMatch.exactSame);
RuleSeverity _ruleSeverityFrom(Object? v) => RuleSeverity.values
    .firstWhere((e) => e.name == v, orElse: () => RuleSeverity.warning);

