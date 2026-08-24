// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _drainNow — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/offline_order_queue.dart:269-312 (44 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): getInstance, getString, read, placeOrder, debugPrint, sublist, setString
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  Future<int> _drainNow() async {
    var replayed = 0;
    try {
      final prefs = await SharedPreferences.getInstance();
      var pending = _decode(prefs.getString(kOfflineOrdersKey));
      if (pending.isEmpty) return 0; // common path: never touches the repo
      if (offlineSuspect) return 0; // still offline — keep the queue
      final repo = _ref.read(ordersRepositoryProvider);
      while (pending.isNotEmpty) {
        final intent = pending.first;
        try {
          // NO id passed — the repository assigns the next BS-#### over the
          // post-reconnect cache (the whole point, see header). queuedAt is
          // replayed as createdAt so the order keeps its true placement time.
          repo.placeOrder(
            who: intent.who,
            site: intent.site,
            items: intent.items,
            sum: intent.sum,
            createdAt: intent.queuedAt,
            lines: intent.lines,
            shipTo: intent.shipTo,
            notes: intent.notes,
          );
        } on Object catch (e) {
          // Keep this intent (and the rest) for the next drain — losing a
          // customer's order is worse than replaying late.
          debugPrint('OfflineOrderQueue: replay failed (kept queued): $e');
          break;
        }
        pending = pending.sublist(1);
        replayed++;
        // Persist the remainder NOW — a crash here cannot double-place.
        await prefs.setString(kOfflineOrdersKey, _encode(pending));
      }
      return replayed;
    } on Object catch (e) {
      debugPrint('OfflineOrderQueue: drain failed (queue intact): $e');
      return replayed;
    }
  }

  // ── payload codec (versioned via the key, tolerant like the cache base) ────

