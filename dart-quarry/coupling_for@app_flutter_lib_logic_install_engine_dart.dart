// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _couplingFor — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:1259-1318 (60 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): contains, where, directMatesWith, pipeSharedWith
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
LipskeyCatalogProduct? _couplingFor(String dn, Set<String> mats) {
  LipskeyCatalogProduct? fallback;
  for (final p in chainUniverse) {
    if (_isPipeProductE(p)) continue;
    final s = kVerifiedSpecs[p.sku];
    if (s == null) continue;
    final m = s.material;
    final compat = mats.contains(m) ||
        (_kDrainageFamily.contains(m) && mats.any(_kDrainageFamily.contains));
    if (!compat) continue;
    final dnEnds = s.ends
        .where((e) => e.type == EndType.hdpeCompression && e.size == dn)
        .length;
    if (dnEnds >= 2) return p; // straight coupling — ideal
    if (dnEnds >= 1) fallback ??= p;
  }
  return fallback;
}

/// The component that physically spans the joint between [a] and [b]:
///   • two fittings sharing a compression DN  → the PIPE that bridges them;
///   • two PIPES sharing a compression DN      → the COUPLING that joins them;
///   • a pipe meeting a fitting (pipe-into-fitting) or a direct thread/press
///     mate → null (the joint is already a real direct connection).
LipskeyCatalogProduct? _pipeBetween(
    LipskeyCatalogProduct a, LipskeyCatalogProduct b) {
  final sa = kVerifiedSpecs[a.sku], sb = kVerifiedSpecs[b.sku];
  if (sa == null || sb == null) return null;
  // A direct thread/press/drain mate needs nothing between.
  for (final ea in sa.ends) {
    for (final eb in sb.ends) {
      if (ea.directMatesWith(eb)) return null;
    }
  }
  final aPipe = _isPipeProductE(a), bPipe = _isPipeProductE(b);
  for (final ea in sa.ends) {
    for (final eb in sb.ends) {
      if (ea.pipeSharedWith(eb)) {
        if (aPipe && bPipe) {
          // pipe ↔ pipe → a coupling joins them.
          return _couplingFor(ea.size, {sa.material, sb.material});
        }
        if (!aPipe && !bPipe) {
          // fitting ↔ fitting → a pipe spans them.
          return _realPipeOf(ea.size, {sa.material, sb.material}) ??
              _syntheticPipe(sa.material, ea.size);
        }
        // pipe ↔ fitting → already a direct pipe-into-fitting joint.
        return null;
      }
    }
  }
  return null;
}

/// Expand [chain] into a fully explicit, 100%-direct sequence: insert the actual
/// pipe segment at every fitting↔fitting compression joint. After this, every
/// adjacent pair is a real direct joint (thread / press / pipe-into-fitting).
/// Items that don't share a compression DN (e.g. a branch device on a tee) are
/// left untouched — they keep their single connection.
