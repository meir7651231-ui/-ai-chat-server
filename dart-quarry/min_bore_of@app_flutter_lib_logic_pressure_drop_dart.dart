// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _minBoreOf — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/pressure_drop.dart:104-182 (79 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): where, toList
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
double? _minBoreOf(LipskeyCatalogProduct p) {
  final spec = kVerifiedSpecs[p.sku];
  if (spec == null) return null;
  double? min;
  for (final e in spec.ends) {
    final b = _boreMeters(e);
    if (b == null) continue;
    if (min == null || b < min) min = b;
  }
  return min;
}

/// A concrete suggestion to resolve a flow problem in the chain. Each
/// suggestion pairs a one-line problem statement with an actionable fix —
/// not "velocity too high" but "swap the 1/2" bushing for a 3/4" model" so
/// the user has something to do, not just a warning to read.
class FlowSuggestion {
  const FlowSuggestion({
    required this.problem,
    required this.solution,
    this.actionKind = SuggestionKind.advice,
    this.replaceProduct,
    this.addProductSku,
  });

  /// One-line problem statement (e.g. "צוואר-בקבוק 10mm").
  final String problem;
  /// Concrete fix the user should perform (e.g. "החלף ל-בושינג 3/4" — DN20").
  final String solution;
  /// Severity / category for UI styling.
  final SuggestionKind actionKind;
  /// When non-null, this product is the one the user should swap out
  /// (the UI can offer a "החלף" button next to it).
  final LipskeyCatalogProduct? replaceProduct;
  /// When non-null, the user should ADD this SKU to the BOM (e.g. an
  /// auto-recommended booster pump SKU).
  final String? addProductSku;
}

enum SuggestionKind {
  swap,    // user should replace a product in the chain
  add,     // user should add a new product (pump, insulation, …)
  advice,  // generic engineering advice (no specific action)
  ok,      // green check — nothing to do, line is healthy
}

class PressureDropResult {
  const PressureDropResult({
    required this.dropBar,
    required this.totalK,
    required this.frictionMetres,
    required this.minBoreMm,
    required this.bottleneck,
    required this.suggestions,
  });

  /// Total pressure loss in bar.
  final double dropBar;
  /// Sum of fitting loss coefficients K.
  final double totalK;
  /// Total straight-run friction length contributing to the calc, in metres.
  final double frictionMetres;
  /// The narrowest internal diameter the flow must squeeze through, in mm.
  final double minBoreMm;
  /// The product whose narrow bore defined [minBoreMm] — the chain's
  /// flow bottleneck. Null when no end in the chain has a parseable bore.
  final LipskeyCatalogProduct? bottleneck;
  /// Actionable suggestions ("do X to fix the line") in severity order.
  final List<FlowSuggestion> suggestions;

  /// Convenience — the old "warnings" surface; only the problem text.
  List<String> get warnings =>
      suggestions.where((s) => s.actionKind != SuggestionKind.ok)
          .map((s) => s.problem)
          .toList();

  bool get exceedsBudget => dropBar > 1.0;

  @override
