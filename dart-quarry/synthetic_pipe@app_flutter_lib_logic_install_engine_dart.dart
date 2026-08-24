// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _syntheticPipe — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:1228-1258 (31 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): putIfAbsent
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
LipskeyCatalogProduct _syntheticPipe(String material, String dn) {
  final sku = 'PIPE-$material-$dn';
  return _syntheticPipeCache.putIfAbsent(sku, () {
    kVerifiedSpecs.putIfAbsent(
        sku,
        () => VerifiedSpec(
              sku: sku,
              material: material,
              ends: [
                ConnectorEnd(EndType.hdpeCompression, dn),
                ConnectorEnd(EndType.hdpeCompression, dn),
              ],
              maxTempC: material == 'HDPE' ? 40 : 95,
            ));
    return LipskeyCatalogProduct(
      sku: sku,
      nameHe: 'צינור $material DN$dn (לפי מטר)',
      nameEn: '$material pipe DN$dn (cut to length)',
      categoryHe: 'צינורות',
      categoryEn: 'Pipes',
      categoryEmoji: '📏',
      page: 0,
      brand: 'AQUATEC',
    );
  });
}

/// A connecting coupling (non-pipe fitting) that joins two pipes of [dn] in a
/// compatible material — physically, two pipe ends can't butt together; a
/// coupling/socket goes between them. Prefers a straight coupling (two same-DN
/// ends); falls back to any compatible fitting with such an end.
