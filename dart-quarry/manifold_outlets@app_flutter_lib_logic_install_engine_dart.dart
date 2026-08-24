// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · manifoldOutlets — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:1471-1506 (36 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): fold, buildTreeInstallation
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
int manifoldOutlets(LipskeyCatalogProduct p) {
  // Only a real distribution manifold ("מחלק") exposes parallel outlets. A tee /
  // מסעף also has 3+ same-size ends but is a single branch off a run, not a
  // multi-outlet manifold — classify by the catalog taxonomy, not raw end-count
  // (e.g. 116565 "מסעף 45° תבריג כפול" has 3×DN50 ends but must NOT be a manifold).
  if (p.productType != 'מחלק' && p.categoryHe != 'מחלקים') return 0;
  final spec = kVerifiedSpecs[p.sku];
  if (spec == null || spec.ends.length < 3) return 0;
  final counts = <String, int>{};
  for (final e in spec.ends) {
    counts[e.size] = (counts[e.size] ?? 0) + 1;
  }
  final maxc = counts.values.fold(0, (a, b) => a > b ? a : b);
  return maxc >= 2 ? maxc : 0;
}

/// A branched (tree) installation: one trunk (feed → manifold) plus N parallel
/// branches off the manifold, one per target. Returns a zone-tagged
/// bill-of-materials — trunk items in "גזע", each branch in "ענף א/ב/…".
/// When [tempC] ≥ 60 and a manifold is detected, one TMTV anti-scald valve
/// (HW-TMTV-15) is auto-added to every branch for hot-water compliance.
InstallationPlan buildTreeInstallation(
  List<LipskeyCatalogProduct> trunk,
  List<LipskeyCatalogProduct> branchTargets, {
  int maxDepthPerSegment = 6,
  int tempC = 20,
  Set<String> accessories = const {},
  bool autoCompliance = false,
  bool loop = false,
}) {
  final items = <LipskeyCatalogProduct>[];
  final qty = <String, int>{};
  final gaps = <InstallationGap>[];
  final zones = <String, List<String>>{};
  final engineWarnings = <String>[];

