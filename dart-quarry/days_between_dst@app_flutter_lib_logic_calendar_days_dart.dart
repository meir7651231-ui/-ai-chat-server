// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · daysBetweenDst — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/calendar_days.dart:21-32 (12 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): difference, subtract
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
int daysBetweenDst(DateTime from, DateTime to) =>
    DateTime.utc(to.year, to.month, to.day)
        .difference(DateTime.utc(from.year, from.month, from.day))
        .inDays;

/// Local midnight of the Sunday that opens [d]'s week (Israeli week, Sun..Sat).
/// Built by CALENDAR arithmetic — `DateTime(y, m, d - k)` — not by
/// `subtract(Duration(days: k))`: subtracting a fixed 24h*k span across a DST
/// night drifts off the intended midnight (a fall-back week can land on 23:00
/// of the PREVIOUS calendar day), whereas constructing from year/month/day
/// always yields the correct date's local midnight. `weekday % 7` maps
/// Sun→0..Sat→6, so subtracting it walks back to the week's Sunday.
