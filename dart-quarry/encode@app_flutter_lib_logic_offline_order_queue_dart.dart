// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _encode — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/offline_order_queue.dart:313-319 (7 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): jsonEncode, toJson, toList
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  String _encode(List<OfflineOrderIntent> intents) =>
      jsonEncode(intents.map((i) => i.toJson()).toList());

  /// Decode the persisted payload. A corrupt/legacy payload is dropped +
  /// logged (it cannot be replayed) — never crashes a drain; a single corrupt
  /// ENTRY is skipped, the rest of the queue survives (per-doc tolerance,
  /// the cache-base stance).
