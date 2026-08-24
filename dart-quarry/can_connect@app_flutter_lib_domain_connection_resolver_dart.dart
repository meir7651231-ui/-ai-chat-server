// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · canConnect — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/domain/connection_resolver.dart:211-222 (12 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  ConnectResult canConnect(ProductConnectorSpec a, ProductConnectorSpec b) {
    ConnectResult? firstMiss;
    for (final endA in a.ends) {
      for (final endB in b.ends) {
        final r = _endPairMemoized(endA, endB);
        if (r.mates) return r;
        if (firstMiss == null && r.severity != null) firstMiss = r;
      }
    }
    return firstMiss ?? _noRule;
  }

