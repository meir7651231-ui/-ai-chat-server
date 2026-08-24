// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · materializeChain — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:1319-1350 (32 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): buildInstallation
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
List<LipskeyCatalogProduct> materializeChain(List<LipskeyCatalogProduct> chain) {
  if (chain.length < 2) return List.of(chain);
  final out = <LipskeyCatalogProduct>[chain.first];
  for (var i = 0; i < chain.length - 1; i++) {
    final pipe = _pipeBetween(chain[i], chain[i + 1]);
    if (pipe != null) out.add(pipe);
    out.add(chain[i + 1]);
  }
  return out;
}

/// Auto-complete a full installation from an ordered list of anchor products
/// (the fixtures + endpoints the installer cares about). Between every pair of
/// consecutive anchors the engine fills in the connector path, so the result is
/// a complete bill-of-materials ready to order. Each segment stays within one
/// system; a supply↔drainage transition only happens at a fixture anchor the
/// installer placed (e.g. a toilet between the supply line and the soil pipe).
/// When [autoCompliance] is true the engine also appends safety-critical items
/// (PRV, expansion vessel, ball valve, dielectric) that are required by code
/// but not part of the physical connection path.
InstallationPlan buildInstallation(
  List<LipskeyCatalogProduct> anchors, {
  int maxDepthPerSegment = 6,
  int tempC = 20,
  Set<String> accessories = const {},
  bool loop = false,
  bool autoCompliance = false,
}) {
  if (anchors.isEmpty) return const InstallationPlan([], [], {});
  final items = <LipskeyCatalogProduct>[];
  final qty = <String, int>{};
  final gaps = <InstallationGap>[];
