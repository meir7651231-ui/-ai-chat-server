// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · startOfWeekSunday — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/calendar_days.dart:33-35 (3 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
DateTime startOfWeekSunday(DateTime d) =>
    DateTime(d.year, d.month, d.day - (d.weekday % 7));

