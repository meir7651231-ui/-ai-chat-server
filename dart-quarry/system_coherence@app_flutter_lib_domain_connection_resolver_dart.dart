// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · systemCoherence — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/domain/connection_resolver.dart:391-411 (21 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  SystemCoherence systemCoherence(List<ProductConnectorSpec> line) {
    String? firstSystemId;
    for (final spec in line) {
      for (final end in spec.ends) {
        final sysId = _systemIdByTypeId[end.connectorTypeId];
        if (sysId == null) continue;
        if (firstSystemId == null) {
          firstSystemId = sysId;
        } else if (sysId != firstSystemId) {
          return SystemCoherence(
            coherent: false,
            offendingSystem: _systemById[sysId],
            offendingSku: spec.productSku,
          );
        }
      }
    }
    return const SystemCoherence(coherent: true);
  }
}

