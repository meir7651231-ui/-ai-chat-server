// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · plumbingConnectorTypes — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/domain/seeds/plumbing_trade_seed.dart:271-327 (57 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): toList, compareTo, plumbingProductSpecs
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
List<ConnectorType> plumbingConnectorTypes() {
  const nameHe = <EndType, String>{
    EndType.hdpeCompression: 'הידוק HDPE',
    EndType.pexPress: 'PEX פרס',
    EndType.copperPress: 'נחושת פרס',
    EndType.bspMale: 'תבריג זכר (BSP)',
    EndType.bspFemale: 'תבריג נקבה (BSP)',
    EndType.drainOpening: 'פתח ניקוז',
  };
  // Collect the distinct sizes per end-type across every verified spec.
  final sizesByType = <EndType, Set<String>>{
    for (final e in EndType.values) e: <String>{},
  };
  for (final spec in kVerifiedSpecs.values) {
    for (final end in spec.ends) {
      sizesByType[end.type]!.add(end.size);
    }
  }
  return <ConnectorType>[
    for (final e in EndType.values)
      ConnectorType(
        id: _connTypeId(e),
        tradeId: kPlumbingTradeId,
        nameHe: nameHe[e]!,
        sizeValues: sizesByType[e]!.toList()..sort(),
        systemId: _systemId(_systemOfEndType(e)),
      ),
  ]..sort((a, b) => a.id.compareTo(b.id));
}

/// One [ProductConnectorSpec] per [kVerifiedSpecs] entry, sorted by sku. The
/// material's galvanic group (R1-3) is derived via [_galvanicGroup]. `pexType`
/// is deferred in v1 — `envelope` is Map<String,num> so it cannot carry the
/// String, and we deliberately do NOT fold it into `ratingHe`.
List<ProductConnectorSpec> plumbingProductSpecs() => <ProductConnectorSpec>[
      for (final spec in kVerifiedSpecs.values)
        ProductConnectorSpec(
          productSku: spec.sku,
          tradeId: kPlumbingTradeId,
          ends: [
            for (final e in spec.ends)
              ProductEnd(
                connectorTypeId: _connTypeId(e.type),
                sizeValue: e.size,
              ),
          ],
          materialId: spec.material,
          ratingHe: spec.pressureRating,
          envelope: {'maxTempC': spec.maxTempC},
          materialGroupId: _galvanicGroup(spec.material),
        ),
    ]..sort((a, b) => a.productSku.compareTo(b.productSku));

/// The 5 same-type joint rules, sorted by id. `methodLabelHe` is KEYSTONE-CRITICAL
/// — each value is byte-identical to install_engine.dart `connectionMethodLabel`
/// (the engine's label for that joint type). A size mismatch on these is a hard
/// (critical) error.
