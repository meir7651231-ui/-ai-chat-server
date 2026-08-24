// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · invoiceTitle — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/invoice.dart:45-47 (3 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String invoiceTitle(Order order, {required bool receipt}) =>
    '${receipt ? 'קבלה' : 'חשבונית'} — ${order.id}';

