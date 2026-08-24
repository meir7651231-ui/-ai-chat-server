// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _boreMeters — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/pressure_drop.dart:73-103 (31 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): tryParse, replaceAll
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
double? _boreMeters(ConnectorEnd e) {
  // Drain/compression sizes are nominal DN in millimetres — "32" → 0.032 m.
  if (e.type == EndType.hdpeCompression ||
      e.type == EndType.pexPress ||
      e.type == EndType.copperPress ||
      e.type == EndType.drainOpening) {
    final dn = int.tryParse(e.size);
    if (dn != null) return dn / 1000.0;
  }
  // BSP thread: rough inside diameter ≈ nominal inches.
  if (e.type == EndType.bspMale || e.type == EndType.bspFemale) {
    final s = e.size.replaceAll('"', '').trim();
    // common conversions: 1/2 ≈ 15, 3/4 ≈ 20, 1 ≈ 25, 1-1/2 ≈ 40, 2 ≈ 50
    final mm = kBspInchToMm[s];
    if (mm != null) return mm / 1000.0;
  }
  return null;
}

/// Auto-inserted safety parts that branch OFF the line (a side test-tap, a top
/// air vent, a side expansion tank) rather than carrying the through-flow in
/// series. They must NOT count toward the line's bottleneck bore or its K-sum:
/// a ¼" Legionella sampling port is a test tap, not the pipe's narrowest point.
const _kOffLineSkus = {
  'HW-SAMPLE', // Legionella sampling port ¼" (side tap)
  'HW-AIRVENT', // automatic air vent (top port)
  'HW-BTANK-35', 'HW-BTANK-18', 'HW-EXPVESSEL', // expansion tanks (side)
};

/// The smallest bore (m) found across [p]'s ends — pressure drop scales with
/// the narrowest point.
