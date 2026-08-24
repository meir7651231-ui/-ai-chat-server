// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _branchLabel — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:935-971 (37 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): toString, fold, qtyOf
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String _branchLabel(int i) =>
    'ענף ${i < _branchLetters.length ? _branchLetters[i] : (i + 1).toString()}';

/// Result of auto-completing an installation from ordered anchor products.
class InstallationPlan {
  const InstallationPlan(this.items, this.gaps, this.quantities,
      {this.zones = const <String, List<String>>{},
       this.warnings = const <String>[]});

  /// Distinct components in first-appearance order (anchors + connectors).
  final List<LipskeyCatalogProduct> items;

  /// Anchor pairs the engine could not connect within the catalog.
  final List<InstallationGap> gaps;

  /// How many physical units of each SKU the line needs (a connector reused
  /// across two joints counts twice) — turns the list into a shopping list.
  final Map<String, int> quantities;

  /// Zone label → ordered SKUs in that zone.
  /// Always non-empty after build: linear plans carry 'קו ראשי', tree plans
  /// carry 'גזע' + 'ענף א/ב/…' + optionally 'בטיחות' (auto-compliance items).
  final Map<String, List<String>> zones;

  /// Engineering warnings that are not hard gaps — e.g. manifold outlet
  /// count exceeded. Advisory; the plan is still usable.
  final List<String> warnings;

  bool get isComplete => gaps.isEmpty;

  /// Total number of physical pieces to order.
  int get totalPieces => quantities.values.fold(0, (sum, q) => sum + q);

  int qtyOf(String sku) => quantities[sku] ?? 1;

  /// Compliance checklist for this plan at the given operating temperature.
  /// Delegates to [lineComplianceChecklist] so callers never need to re-pass items.
