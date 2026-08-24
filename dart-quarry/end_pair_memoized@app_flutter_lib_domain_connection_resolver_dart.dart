// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _endPairMemoized — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/domain/connection_resolver.dart:223-238 (16 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): putIfAbsent
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  ConnectResult _endPairMemoized(ProductEnd endA, ProductEnd endB) {
    final key = '${endA.connectorTypeId}|${endA.sizeValue}'
        '|${endB.connectorTypeId}|${endB.sizeValue}';
    return _memo.putIfAbsent(key, () => _endPair(endA, endB));
  }

  /// Evaluates one end-pair against [rules] in list order.
  ///
  /// A rule matches the pair in FORWARD orientation when
  /// `rule.aTypeId == endA.connectorTypeId && rule.bTypeId == endB.connectorTypeId`,
  /// or in REVERSE orientation when the ids match swapped. (A same-type rule
  /// matches as forward — the orientations coincide.) The first rule that
  /// matches the pair AND passes its size check wins. A rule that matches the
  /// pair but FAILS its size check does not stop the scan — a later rule may
  /// still mate the pair; if none does, the FIRST such size-miss rule shapes
  /// the returned miss (`severity: rule.onMismatch`).
