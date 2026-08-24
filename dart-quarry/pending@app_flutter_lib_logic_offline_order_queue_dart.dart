// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · pending — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/offline_order_queue.dart:243-268 (26 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): getInstance, getString, debugPrint, drainQueue
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  Future<List<OfflineOrderIntent>> pending() => _serialized(() async {
        try {
          final prefs = await SharedPreferences.getInstance();
          return _decode(prefs.getString(kOfflineOrdersKey));
        } on Object catch (e) {
          debugPrint('OfflineOrderQueue: pending read failed (empty): $e');
          return const <OfflineOrderIntent>[];
        }
      });

  /// Replay every queued intent, FIFO, through `ordersRepositoryProvider` —
  /// called on app start (the orders-engine init path wires it) and by
  /// whoever observes connectivity returning. Returns the number replayed.
  ///
  ///   • EMPTY queue (the overwhelmingly common path) → returns 0 without
  ///     touching the repository at all.
  ///   • Still [offlineSuspect] → no-op, queue kept intact ("נשלח בחזרת-רשת").
  ///   • CRASH-SAFE / NO DOUBLE-PLACE: the shrinking remainder is persisted
  ///     after EVERY replayed intent, so an interrupted drain never replays a
  ///     placed intent again; a CONCURRENT drain is serialized behind this
  ///     one and finds the queue already empty (replays nothing).
  ///   • A replay failure keeps THAT intent (and the rest) queued for the
  ///     next drain; everything is caught + logged, nothing ever throws
  ///     (rule #1 — this runs fire-and-forget from a provider build).
  Future<int> drainQueue() => _serialized(_drainNow);

