// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · isShutoff — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:1037-1197 (161 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): contains, isolations, where, lineIsSupply, insertAt, indexWhere, insert, toSet, productMaterial, flowRole, productSystems
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  bool isShutoff(LipskeyCatalogProduct p) =>
      _kIsolationValveSkus.contains(p.sku) ||
      ((p.productType == 'ברז' || p.productType == 'ברז גן') &&
          (p.categoryHe == 'ברזי מעבר' ||
              p.categoryHe == 'ברזי ניל' ||
              p.categoryHe == 'ברזי דלי'));
  int isolations() => items.where(isShutoff).length;

  // Isolation ball valve is required on every SUPPLY line (cold too) for
  // maintenance shut-off — but NOT on a gravity drainage line (a supply ball
  // valve can't connect to a drain trap). Insert only if none present.
  final isSupply = lineIsSupply(items);
  if (isSupply && isolations() == 0) {
    insertAt(1, _kIsolationValveSkus, 'HW-BALL-1');
  }

  if (isSupply && hot) {
    // Hot-source protection group sits TOGETHER at the inlet (the boiler side):
    //   slot 1 = isolation shutoff · slot 2 = expansion vessel · slot 3 = PRV.
    // 2. Expansion vessel — slot 2 (cold feed, before heat source).
    insertAt(2, {'HW-BTANK-35', 'HW-BTANK-18', 'HW-EXPVESSEL'},
        'HW-BTANK-35');
    // 3. PRV — right after the expansion vessel, at the source (a relief valve
    //    protects the closed system at the heater, NOT down at the outlet).
    insertAt(3, {'HW-PRV-34'}, 'HW-PRV-34');
    // 4. TMTV anti-scald when a manifold or shower head is present. It must sit
    //    immediately UPSTREAM of the manifold/shower it protects, so the
    //    anti-scald limit applies to that outlet's feed — not be dumped at the
    //    end of the list. We find the landmark and insert just before it.
    if (hasManifoldOrShower) {
      final landmark = items.indexWhere((p) =>
          p.productType == 'מחלק' ||
          p.productType == 'ראש מקלחת' ||
          p.productType == 'מקלח' ||
          p.categoryHe == 'מחלקים' ||
          p.categoryHe == 'ראשי מקלחת' ||
          p.categoryHe == 'מערכות אמבטיה' ||
          p.categoryHe == 'ערכות רחצה' ||
          const {'HW-MANIFOLD-3', 'HW-MANIFOLD-4', 'HW-MANIFOLD-6',
                  'HW-SHOWER-HEAD'}
              .contains(p.sku));
      insertAt(landmark >= 0 ? landmark : items.length - 1,
          {'HW-TMTV-32', 'HW-TMTV-25', 'HW-TMTV-20', 'HW-TMTV-15'},
          'HW-TMTV-15');
    }
  }

  // Recirculation loop adds critical + warning extras.
  if (loop) {
    // 2 more isolation valves so total ≥ 3.
    while (isolations() < 3) {
      final p = _skuOf('HW-BALL-1');
      if (p == null) break;
      items.insert(items.length - 1, p);
      qty['HW-BALL-1'] = (qty['HW-BALL-1'] ?? 0) + 1;
    }
    insertAt(items.length - 1, {'HW-CHECK-15'}, 'HW-CHECK-15');
    insertAt(items.length - 1, {'HW-BALANCE-15'}, 'HW-BALANCE-15');
    insertAt(items.length - 1, {'HW-AIRVENT'}, 'HW-AIRVENT');
    // Legionella sampling point (warning) — recirc lines are tested.
    insertAt(items.length - 1, {'HW-SAMPLE'}, 'HW-SAMPLE');
  }

  // PEX expansion compensator (warning) — PEX expands when heated.
  final hasPex = items.any((p) =>
      kVerifiedSpecs[p.sku]?.material == 'PEX' ||
      (p.categoryHe == 'מחברי NTM'));
  if (hot && hasPex) {
    insertAt(items.length - 1, {'HW-EXP-COMP-20'}, 'HW-EXP-COMP-20');
  }

  // Commercial pump triggers extra protection.
  if (hasCommercialPump) {
    insertAt(items.length - 1,
        {'HW-YSTR-40', 'HW-YSTR-32', 'HW-YSTR-15'}, 'HW-YSTR-32');
    insertAt(items.length - 1, {'HW-FLEX-40', 'HW-FLEX-32'}, 'HW-FLEX-32');
    if (hot) insertAt(items.length - 1, {'HW-DISINFECT'}, 'HW-DISINFECT');
    // Balance valve per branch (warning) — only when manifold present too.
    if (hasManifoldOrShower) {
      insertAt(items.length - 1,
          {'HW-BALANCE-25', 'HW-BALANCE-20', 'HW-BALANCE-15'},
          'HW-BALANCE-25');
    }
  }

  // Dielectric union between dissimilar metal groups (copper/brass ↔ steel/
  // stainless) — same predicate as the checklist (see _galvanicallyDissimilar).
  // Recompute over the FINAL items: the auto-added STEEL expansion tank itself
  // creates a brass/copper↔steel couple, so the dielectric must be added for it
  // too (the top-of-function `mats` predates these insertions).
  final matsFinal = items.map(productMaterial).whereType<String>().toSet();
  if (_galvanicallyDissimilar(matsFinal)) {
    var seamPos = items.length - 1;
    for (var i = 0; i < items.length - 1; i++) {
      if (productMaterial(items[i]) != productMaterial(items[i + 1])) {
        seamPos = i + 1;
        break;
      }
    }
    insertAt(
        seamPos,
        {
          'HW-DIELECTRIC-15', 'HW-DIELECTRIC-20', 'HW-DIELECTRIC-25',
          'HW-DIELECTRIC-32', 'HW-DIELECTRIC-40',
        },
        'HW-DIELECTRIC-15');
  }

  // ── Accessories — tool-grade items the checklist asks the user to
  // confirm (insulation, clips, sealant). Auto-set them so the checklist
  // is fully satisfied without manual ticking.
  if (accessories != null) {
    accessories.add('HW-CLIP');     // always — every line needs supports
    accessories.add('HW-SEALANT');  // always — every joint needs sealant
    if (hot) accessories.add('HW-INSUL'); // hot lines need insulation
  }
}

/// When the verified BFS finds no path, scan the fitting/connector catalog for a
/// single product that bridges [from] → [to] using name-inference matching.
/// Prefers verified-spec products; returns null only when no fitting bridges the gap.
LipskeyCatalogProduct? _findBridge(
    LipskeyCatalogProduct from,
    LipskeyCatalogProduct to,
    int tempC) {
  // Two terminal devices belong to separate fixtures — never bridge one to
  // another (double-trap / two taps in series).
  if (flowRole(from) == FlowRole.fixture && flowRole(to) == FlowRole.fixture) {
    return null;
  }
  // Fail-closed across plumbing systems. The verified BFS rejects supply↔drainage
  // via system-intersection (sysAcc, see findShortestPath); this name-inference
  // fallback must match it — otherwise a spec-less fitting that merely size-matches
  // both a supply and a drainage product could silently bridge them. A live probe
  // found 0/3600 reachable cases today, so this is defence-in-depth (and an
  // invariant locked by install_engine_safety_test), not a fix for an active leak.
  final shared = productSystems(from).intersection(productSystems(to));
  if (shared.isEmpty) return null;
  LipskeyCatalogProduct? best;
  bool bestVerified = false;
  for (final p in chainUniverse) {
    if (!isFitting(p)) continue;
    if (!productSuitableForTemp(p, tempC)) continue;
    if (!canConnect(from, p) || !canConnect(p, to)) continue;
    final isVerified = kVerifiedSpecs[p.sku] != null;
    if (best == null || (!bestVerified && isVerified)) {
      best = p;
      bestVerified = isVerified;
      if (bestVerified) break; // first verified hit wins
    }
  }
  return best;
}

// ── chain materialization — make every joint a real direct connection ────────
// A compression joint between two FITTINGS (neither is a pipe) is the one place
// the chain is not "directly" connected — physically a length of pipe spans it.
// [materializeChain] inserts that pipe explicitly (a real catalog drainage pipe,
// or a synthetic "cut-to-length" supply pipe), turning fitting↔fitting into
// fitting↔pipe↔fitting where BOTH joints are real direct compression joints.

