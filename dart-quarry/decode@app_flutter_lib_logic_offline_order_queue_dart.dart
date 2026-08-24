// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _decode — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/offline_order_queue.dart:320-345 (26 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): jsonDecode, fromJson, debugPrint
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  List<OfflineOrderIntent> _decode(String? raw) {
    if (raw == null || raw.isEmpty) return <OfflineOrderIntent>[];
    try {
      final out = <OfflineOrderIntent>[];
      for (final e in jsonDecode(raw) as List<dynamic>) {
        try {
          out.add(OfflineOrderIntent.fromJson(e as Map<String, dynamic>));
        } on Object catch (err) {
          debugPrint('OfflineOrderQueue: skipped corrupt intent: $err');
        }
      }
      return out;
    } on Object catch (e) {
      debugPrint('OfflineOrderQueue: corrupt queue payload (dropped): $e');
      return <OfflineOrderIntent>[];
    }
  }
}

/// The queue provider — container-lifetime singleton, like every repository
/// provider. Read by the orders-engine init path (the drain wiring) and by
/// any future checkout interception / pending-badge consumer.
final offlineOrderQueueProvider = Provider<OfflineOrderQueue>(
  OfflineOrderQueue.new,
);

