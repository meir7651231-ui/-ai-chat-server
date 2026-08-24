// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · contractorCredit — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/manager_dashboard.dart:263-278 (16 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
int contractorCredit(String name) {
  const lo = 30000;
  const hi = 120000;
  const span = hi - lo; // 90,000
  // Stable non-negative hash → bucket within the band, rounded to ₪100.
  final h = name.hashCode.abs();
  final raw = lo + (h % (span + 1));
  return (raw ~/ 100) * 100;
}

/// Group orders by buyer (`who`), summing their spend + counting their orders.
/// Mirrors the legacy `mgrCustomerList` group-by-buyer (the 👥 לקוחות source).
/// Pure + testable. The LIVE read-path passes the shared orders engine's live
/// orders here (`managerCustomersProvider`, `state/orders_engine.dart`); with no
/// argument it folds the [kManagerOrderSeed] — identical to the engine's seed,
/// so the four seed customers are preserved.
