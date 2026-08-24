// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · productSuitableForTemp — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:65-157 (93 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): productMaxTempC, lineIsSupply, contains, connectionMethodLabel, specOf, canConnect, directMatesWith, pipeSharedWith
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool productSuitableForTemp(LipskeyCatalogProduct p, int tempC) {
  final t = productMaxTempC(p);
  return t == null || tempC <= t;
}

/// True when the line carries PRESSURISED SUPPLY water, so supply-side
/// compliance (isolation ball valve, PRV, expansion vessel, TMTV …) applies.
/// A pure gravity DRAINAGE line (floor traps + drainage pipe) is NOT supply —
/// it must never receive a supply ball valve, which can't even physically
/// connect to a drain trap. Decided by the products' actual end-systems.
bool lineIsSupply(List<LipskeyCatalogProduct> items) => items.any(
    (p) => kVerifiedSpecs[p.sku]?.endSystems.contains(WaterSystem.supply) ?? false);

// ── line compliance / completeness ──────────────────────────────────────────────

/// Severity of a compliance check failure.
/// critical → safety/code risk (PRV, ball valve, anti-scald)
/// warning  → durability/performance risk (insulation, galvanic, PEX expansion)
/// info     → good practice (clamps, sealant)
enum CheckSeverity { critical, warning, info }

class LineCheck {
  const LineCheck(this.label, this.satisfied, this.why,
      {this.severity = CheckSeverity.warning});
  final String label;
  final bool satisfied;
  final String why;
  final CheckSeverity severity;
}

/// s41: the delegation seam. Carried by the (future, s43) provider layer —
/// nothing live passes it yet; the kTradeStudioFlag gate lives at that layer.
/// R1-2 KEYSTONE CONTRACT: plumbing ('plumbing') NEVER delegates — its
/// hand-written physics branch below is permanent and non-deletable.
@immutable
class TradeResolution {
  const TradeResolution({required this.tradeId, required this.resolver, required this.specOf});
  final String tradeId;
  final ConnectionResolver resolver;
  final ProductConnectorSpec? Function(String sku) specOf;
}

/// The physical join method between two mating products, derived from end types
/// — so each transition states exactly how it's connected (Press / PTFE / …).
///
/// [trade]: optional s41 authored-trade delegation seam — see [TradeResolution].
String connectionMethodLabel(
  LipskeyCatalogProduct a,
  LipskeyCatalogProduct b, {
  TradeResolution? trade,
}) {
  // s41 delegation seam. R1-2 KEYSTONE: plumbing NEVER enters the resolver —
  // this runtime guard is unconditional and deliberately carries NO assert
  // (a plumbing TradeResolution must be silently ignored in every build mode;
  // the delegation tests enforce it by passing a throwing specOf).
  if (trade != null && trade.tradeId != 'plumbing') {
    try {
      final sa = trade.specOf(a.sku);
      final sb = trade.specOf(b.sku);
      if (sa == null || sb == null) return '';
      return trade.resolver.canConnect(sa, sb).methodLabelHe;
    } on Object {
      // Kill-switch (plan addition-B): any resolver failure falls through to
      // the legacy hand-written physics branch below — silently, no print.
    }
  }

  final vA = kVerifiedSpecs[a.sku], vB = kVerifiedSpecs[b.sku];
  if (vA == null || vB == null) return '';
  for (final eA in vA.ends) {
    for (final eB in vB.ends) {
      if (eA.directMatesWith(eB)) {
        switch (eA.type) {
          case EndType.pexPress:    return 'Press / טבעת כיווץ';
          case EndType.copperPress: return 'Press / O-ring';
          case EndType.bspMale:
          case EndType.bspFemale:   return 'תבריג + PTFE';
          case EndType.hdpeCompression: return 'אום הידוק';
          case EndType.drainOpening:    return 'כיסוי ניקוז';
        }
      }
      if (eA.pipeSharedWith(eB)) return 'אום הידוק (compression)';
    }
  }
  return '';
}

/// Galvanic corrosion needs a dielectric union only between DISSIMILAR metal
/// GROUPS: a copper-group metal (נחושת/פליז) joined to an iron-group metal
/// (פלדה/נירוסטה). Same-group joints (copper↔brass) are galvanically benign and
/// must NOT be flagged. Returns true only when BOTH groups are present in [mats].
/// (Fixes the old predicate that required copper specifically — so it missed
/// brass↔steel — and omitted stainless entirely.)
