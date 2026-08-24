// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _enqueueNow — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/offline_order_queue.dart:229-242 (14 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): getInstance, getString, setString, debugPrint
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  Future<void> _enqueueNow(OfflineOrderIntent intent) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final pending = _decode(prefs.getString(kOfflineOrdersKey))..add(intent);
      await prefs.setString(kOfflineOrdersKey, _encode(pending));
    } on Object catch (e) {
      debugPrint('OfflineOrderQueue: enqueue failed (ignored): $e');
    }
  }

  /// The currently queued intents, oldest first (FIFO — replay order). For
  /// tests and a future "ממתין לסנכרון" badge. Rides the chain so a read
  /// issued right after [maybeEnqueue] sees the intent it queued. Guarded:
  /// any failure → empty.
