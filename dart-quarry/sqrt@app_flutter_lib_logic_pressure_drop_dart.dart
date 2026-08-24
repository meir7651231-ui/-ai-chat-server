// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _sqrt — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/pressure_drop.dart:334-503 (170 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): estimatePressureDrop, contains, widerSiblingOf, toStringAsFixed, checkDrainageSlope
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
double _sqrt(double x) {
  // Newton's method, 5 iterations — sufficient for the resolution we need
  var r = x / 2;
  for (var i = 0; i < 5; i++) {
    r = 0.5 * (r + x / r);
  }
  return r;
}

/// Estimate pressure drop of a chain of plumbing products.
///
/// [chain] is the product sequence (output of [findShortestPath]).
/// [pipeLengthMeters] is the straight-pipe length between the chain endpoints
///   (the user knows their installation distance — there's no way to infer it
///   from product geometry alone). Defaults to 5m, a reasonable typical run.
/// [flowRateLPS] is the design flow in litres/second. Defaults to 0.3 L/s,
///   the WSP house-supply standard for a single fixture.
/// [verticalRiseMeters] is the height the water column climbs from inlet to
///   outlet — each metre costs ≈ 0.1 bar of static head (ρ·g·h). Negative
///   values (descent) ADD pressure. Defaults to 0 (single-storey).
PressureDropResult estimatePressureDrop(
  List<LipskeyCatalogProduct> chain, {
  double pipeLengthMeters = 5.0,
  double flowRateLPS = 0.3,
  double verticalRiseMeters = 0.0,
}) {
  // Sum K across the chain (skip endpoints and OFF-LINE side branches —
  // a sampling tap / air vent / expansion tank doesn't sit in the flow path).
  var totalK = 0.0;
  for (final p in chain) {
    if (_kOffLineSkus.contains(p.sku)) continue;
    totalK += _kForType(p.productType);
  }

  // The narrowest IN-LINE bore — this dominates the loss. Off-line side
  // branches (the ¼" Legionella tap especially) are excluded so they can't
  // masquerade as the bottleneck. We remember which product owns the bore so
  // the UI can name the real bottleneck.
  double? minBore;
  LipskeyCatalogProduct? bottleneck;
  for (final p in chain) {
    if (_kOffLineSkus.contains(p.sku)) continue;
    final b = _minBoreOf(p);
    if (b == null) continue;
    if (minBore == null || b < minBore) {
      minBore = b;
      bottleneck = p;
    }
  }
  // Fallback: assume 20mm if no end has a parseable bore (rare).
  minBore ??= 0.020;

  const rho = 1000.0; // water density kg/m³
  const mu = 0.001; // dynamic viscosity Pa·s @ 20°C
  const g = 9.81;
  final area = 3.14159265 * minBore * minBore / 4.0; // m²
  final q = flowRateLPS / 1000.0; // m³/s
  final v = q / area; // m/s
  // Reynolds-aware Darcy friction factor (replaces the old f = 0.025 const).
  final reynolds = rho * v * minBore / mu;
  final f = _frictionFactor(reynolds);
  final frictionTerm = f * pipeLengthMeters / minBore;
  // Dynamic loss = (K + f·L/D)·½ρv² ; static gain/loss = ρ·g·h
  final dynamicPa = (totalK + frictionTerm) * (rho * v * v / 2.0);
  final staticPa = rho * g * verticalRiseMeters;
  final dropPa = dynamicPa + staticPa;
  final dropBar = dropPa / 1e5;

  // Build actionable suggestions instead of bare warnings. Each problem
  // is paired with a concrete fix the user can apply — swap the bottleneck
  // for a wider sibling, add a booster pump, etc.
  final suggestions = <FlowSuggestion>[];

  // ── Bottleneck (narrow bore choking flow) → swap for wider sibling ────
  final wider = bottleneck == null ? null : widerSiblingOf(bottleneck);
  if (minBore * 1000 < 13 && flowRateLPS >= 0.3) {
    suggestions.add(FlowSuggestion(
      problem:
          'צוואר-בקבוק — קוטר ${(minBore * 1000).toStringAsFixed(0)}mm '
          'צר מדי לזרימה ${flowRateLPS.toStringAsFixed(1)} L/s',
      solution: wider != null
          ? 'החלף את "${bottleneck!.nameHe}" ב-"${wider.nameHe}"'
          : 'החלף את "${bottleneck?.nameHe ?? "המוצר הצר"}" במידה גדולה יותר',
      actionKind: SuggestionKind.swap,
      replaceProduct: bottleneck,
    ));
  } else if (v > 2.0 && bottleneck != null) {
    // High velocity even though bore isn't tiny — still suggest a wider variant
    suggestions.add(FlowSuggestion(
      problem:
          'מהירות זרימה ${v.toStringAsFixed(1)} מ"ש (מעל 2 מ"ש = רעש/קוויטציה)',
      solution: wider != null
          ? 'הגדל את הקוטר: החלף "${bottleneck.nameHe}" ב-"${wider.nameHe}"'
          : 'הגדל את הקוטר של "${bottleneck.nameHe}"',
      actionKind: SuggestionKind.swap,
      replaceProduct: bottleneck,
    ));
  }

  // ── ΔP over budget → suggest booster pump (catalog SKU placeholder) ──
  if (dropBar > 1.0) {
    suggestions.add(FlowSuggestion(
      problem: 'ירידת לחץ ${dropBar.toStringAsFixed(2)} בר — '
          'מעל תקציב 1 בר. הברז יסבול מחוסר זרימה.',
      solution: 'הוסף משאבת הגברה (booster) להעלאת לחץ הכניסה',
      actionKind: SuggestionKind.add,
      addProductSku: 'HW-PUMP-40',
    ));
  }

  // ── Tall vertical rise → suggest booster + insulation ─────────────────
  if (verticalRiseMeters >= 10) {
    suggestions.add(FlowSuggestion(
      problem:
          'עלייה אנכית ${verticalRiseMeters.toStringAsFixed(0)} מ׳ — '
          '${(verticalRiseMeters * 0.098).toStringAsFixed(1)} בר אובדים על הגובה',
      solution: 'הוסף משאבת הגברה לפני העלייה האנכית',
      actionKind: SuggestionKind.add,
      addProductSku: 'HW-PUMP-40',
    ));
  }

  // ── Laminar flow → suggest narrowing (the inverse problem) ───────────
  if (reynolds < 2300 && flowRateLPS >= 0.2 && bottleneck != null) {
    suggestions.add(FlowSuggestion(
      problem: 'זרימה לאמינרית (Re=${reynolds.toStringAsFixed(0)}) — '
          'הקוטר גדול מהנדרש, מבזבז חומר',
      solution: 'הקטן את הקוטר — בחר וריאנט צר יותר של "${bottleneck.nameHe}"',
      actionKind: SuggestionKind.swap,
      replaceProduct: bottleneck,
    ));
  }

  // ── If nothing wrong, surface a green-check "ok" so the UI can show
  // an explicit "all good" state instead of an empty section.
  if (suggestions.isEmpty) {
    suggestions.add(const FlowSuggestion(
      problem: 'הקו תקין',
      solution: 'אין פעולות נדרשות לשיפור הזרימה',
      actionKind: SuggestionKind.ok,
    ));
  }

  return PressureDropResult(
    dropBar: dropBar,
    totalK: totalK,
    frictionMetres: pipeLengthMeters,
    minBoreMm: minBore * 1000,
    bottleneck: bottleneck,
    suggestions: suggestions,
  );
}

/// Drainage-slope check. ת"י 1205 requires a minimum 2% slope on horizontal
/// drainage runs so wastewater doesn't pool. Given [horizontalRunMeters] and
/// the actual [verticalDropMeters] from one end to the other, returns true
/// when the slope is at least 2% (or null when the chain isn't drainage).
({double slopePercent, bool ok, String message})? checkDrainageSlope({
  required double horizontalRunMeters,
  required double verticalDropMeters,
}) {
  if (horizontalRunMeters <= 0) return null;
  final slope = (verticalDropMeters / horizontalRunMeters) * 100;
  final ok = slope >= 2.0;
  final msg = ok
      ? 'שיפוע ${slope.toStringAsFixed(1)}% — תקין (≥ 2% לפי ת"י 1205)'
      : 'שיפוע ${slope.toStringAsFixed(1)}% — מתחת ל-2% מינימום של ת"י 1205';
  return (slopePercent: slope, ok: ok, message: msg);
}

