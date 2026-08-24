// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · toString — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/pressure_drop.dart:183-271 (89 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): toStringAsFixed, autoFlowFix, estimatePressureDrop, indexWhere, widerSiblingOf, where, toList, compatibleWith
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  String toString() =>
      'ΔP = ${dropBar.toStringAsFixed(2)} bar  (K=${totalK.toStringAsFixed(2)}, '
      'L=${frictionMetres.toStringAsFixed(1)}m, '
      'minBore=${minBoreMm.toStringAsFixed(1)}mm, '
      'bottleneck=${bottleneck?.sku ?? "—"})';
}

/// Apply automatic flow fixes to [chain]:
///   1. If ΔP > 1 bar (after evaluating the given run length, flow and rise),
///      prepend a booster pump to relieve the pressure budget.
///   2. If the chain's narrowest bore is < 13mm at flow ≥ 0.3 L/s and a
///      wider sibling of the bottleneck exists in the catalog AND that
///      sibling still mates with both neighbours in the chain — swap it.
/// Returns the (possibly modified) chain plus a list of human-readable
/// descriptions of every change made, so the UI can banner the auto-fixes.
({List<LipskeyCatalogProduct> chain, List<String> changes}) autoFlowFix(
  List<LipskeyCatalogProduct> chain, {
  double pipeLengthMeters = 5.0,
  double flowRateLPS = 0.3,
  double verticalRiseMeters = 0.0,
}) {
  if (chain.length < 2) return (chain: chain, changes: const []);
  final changes = <String>[];
  var working = [...chain];

  // ── 1. Bottleneck swap — repeat until no wider safe swap remains ──────
  for (var safety = 0; safety < 5; safety++) {
    final pd = estimatePressureDrop(
      working,
      pipeLengthMeters: pipeLengthMeters,
      flowRateLPS: flowRateLPS,
      verticalRiseMeters: verticalRiseMeters,
    );
    if (pd.bottleneck == null) break;
    if (pd.minBoreMm >= 13 && (pd.dropBar <= 1.0)) break;
    final bottleneck = pd.bottleneck!;
    final idx = working.indexWhere((p) => p.sku == bottleneck.sku);
    if (idx < 0) break; // bottleneck is auto-inserted, can't swap safely
    final wider = widerSiblingOf(bottleneck);
    if (wider == null) break;
    if (!_swapMatesWithNeighbours(working, idx, wider)) break;
    working[idx] = wider;
    changes.add(
        '🔄 הוחלף "${bottleneck.nameHe}" ב-"${wider.nameHe}" לפתיחת צוואר-בקבוק');
  }

  // ── 2. Booster pump if ΔP still over budget ──────────────────────────
  final pd2 = estimatePressureDrop(
    working,
    pipeLengthMeters: pipeLengthMeters,
    flowRateLPS: flowRateLPS,
    verticalRiseMeters: verticalRiseMeters,
  );
  if (pd2.dropBar > 1.0) {
    // HW-PUMP-40 lives in the hot-water catalog, so resolve against the full
    // chainUniverse (imported company catalog when active, else kCompatCatalog
    // verbatim) — the Lipskey-only subset never found it, so this auto-prepend
    // silently no-op'd on every high-ΔP chain (the auto-fix was dead).
    final pump =
        chainUniverse.where((p) => p.sku == 'HW-PUMP-40').toList();
    if (pump.isNotEmpty && !working.any((p) => p.sku == 'HW-PUMP-40')) {
      working = [pump.first, ...working];
      changes.add(
          '⚡ נוספה משאבת הגברה (${pump.first.nameHe}) — ΔP=${pd2.dropBar.toStringAsFixed(2)} בר חורג מ-1 בר');
    }
  }

  return (chain: working, changes: changes);
}

/// True when [candidate] still physically mates with [chain]'s neighbours
/// of [idx] — both the product before and after. Used to verify that a
/// "wider sibling" swap won't break the chain's connectivity.
bool _swapMatesWithNeighbours(List<LipskeyCatalogProduct> chain, int idx,
    LipskeyCatalogProduct candidate) {
  final candSpec = kVerifiedSpecs[candidate.sku];
  if (candSpec == null) return false;
  for (final ni in [idx - 1, idx + 1]) {
    if (ni < 0 || ni >= chain.length) continue;
    final neighborSpec = kVerifiedSpecs[chain[ni].sku];
    if (neighborSpec == null) continue;
    if (!candSpec.compatibleWith(neighborSpec)) return false;
  }
  return true;
}

/// Find a "wider sibling" of [p] — same productType + same brand + same
/// category, but with a larger nominal bore on at least one end. Used to
/// suggest "swap the bottleneck for a wider one" without leaving the catalog.
