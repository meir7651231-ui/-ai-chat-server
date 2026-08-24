// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · formatNis — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/money_format.dart:31-33 (3 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): groupThousands
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String formatNis(int n, {String prefix = ''}) =>
    '$prefix${n < 0 ? '-' : ''}₪${groupThousands(n)}';

