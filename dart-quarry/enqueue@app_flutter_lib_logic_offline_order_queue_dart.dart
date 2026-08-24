// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · enqueue — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/offline_order_queue.dart:226-228 (3 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  Future<void> enqueue(OfflineOrderIntent intent) =>
      _serialized(() => _enqueueNow(intent));

