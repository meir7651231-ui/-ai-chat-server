// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _edgeCost — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:875-934 (60 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): contains, directMatesWith, clamp, isFitting, connectionFailReason
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
int _edgeCost(LipskeyCatalogProduct a, LipskeyCatalogProduct b) {
  final sa = kVerifiedSpecs[a.sku];
  final sb = kVerifiedSpecs[b.sku];
  final ma = sa?.material;
  final mb = sb?.material;

  int transition;
  if (ma == null || mb == null || ma == mb) {
    transition = 0;
  } else if (_drainageFamily.contains(ma) && _drainageFamily.contains(mb)) {
    transition = 1; // PVC↔PP↔multi-layer↔ceramic — common drainage transition
  } else {
    transition = 4; // brass↔HDPE, copper↔PEX — needs adapter + sealant choice
  }

  // Direct-mate detection: any thread/press end pair that mates without a
  // pipe between the two. When neither pair direct-mates the connection is
  // pipe-bridged and we add a small penalty so the search prefers cleaner
  // joints when both options are available.
  var pipeBridge = 2; // assume bridged until proven direct
  if (sa != null && sb != null) {
    outer:
    for (final eA in sa.ends) {
      for (final eB in sb.ends) {
        if (eA.directMatesWith(eB)) {
          pipeBridge = 0;
          break outer;
        }
      }
    }
  } else {
    pipeBridge = 0; // unverified products fall back to the legacy cost
  }

  // Bore-aware penalty — under 15 mm gets penalised so the BFS naturally
  // builds wider chains instead of needing a post-build "swap the
  // bottleneck" step. The penalty caps at 10 cost units so it never
  // outweighs the deviceFiller (50) or transition-family (4) terms but
  // does break ties between two otherwise-equal candidates.
  final bore = _minBoreMmOf(b);
  final boreCost = bore == null || bore >= 15
      ? 0
      : (15 - bore).round().clamp(0, 10);

  final deviceFiller = isFitting(b) ? 0 : 50;
  return 10 + deviceFiller + transition + pipeBridge + boreCost;
}

/// One gap between two anchors in a built installation.
class InstallationGap {
  InstallationGap(this.from, this.to)
      : why = connectionFailReason(from, to);
  final LipskeyCatalogProduct from;
  final LipskeyCatalogProduct to;
  /// Hebrew explanation of why the connection could not be made.
  final String why;
}

/// Branch letter labels for Hebrew zone display (א, ב, ג, …).
const _branchLetters = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י'];
