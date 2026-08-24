// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · add — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:1507-1635 (129 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): containsKey, putIfAbsent, contains, buildInstallation, qtyOf, addAll, where, toList, manifoldOutlets, skip, findShortestPath, toSet
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  void add(LipskeyCatalogProduct p, {String? zone}) {
    if (!qty.containsKey(p.sku)) items.add(p);
    qty[p.sku] = (qty[p.sku] ?? 0) + 1;
    if (zone != null) {
      final zl = zones.putIfAbsent(zone, () => []);
      if (!zl.contains(p.sku)) zl.add(p.sku);
    }
  }

  // trunk: feed → … → manifold (linear), zone = "גזע"
  LipskeyCatalogProduct? manifold;
  if (trunk.isNotEmpty) {
    final tp = buildInstallation(trunk,
        maxDepthPerSegment: maxDepthPerSegment, tempC: tempC);
    for (final p in tp.items) {
      for (var k = 0; k < tp.qtyOf(p.sku); k++) {
        add(p, zone: 'גזע');
      }
    }
    gaps.addAll(tp.gaps);
    manifold = trunk.last;
  }

  // each branch: manifold → target, zone = "ענף א/ב/…"
  final root = manifold ?? (branchTargets.isNotEmpty ? branchTargets.first : null);
  final builtZones = <String>[];

  // A target equal to the manifold itself isn't a branch. CAP the branches at
  // the manifold's physical outlet count: a 4-branch design on a 2-outlet
  // manifold can only feed 2 — the overflow targets are recorded as gaps (so the
  // plan is NOT reported complete) plus a warning, instead of silently emitting
  // phantom branches (each with its own TMTV/balancing valve) off ports that
  // don't exist. Within capacity (and for non-manifold roots) behaviour is unchanged.
  final realTargets = root == null
      ? const <LipskeyCatalogProduct>[]
      : branchTargets.where((t) => t.sku != root.sku).toList();
  final outlets = manifold != null ? manifoldOutlets(manifold) : 0;
  final cap = (outlets > 0 && outlets < realTargets.length)
      ? outlets
      : realTargets.length;
  if (manifold != null && outlets > 0 && realTargets.length > outlets) {
    final overflow = realTargets.skip(outlets).toList();
    engineWarnings.add(
        'המחלק "${manifold.nameHe}" תומך ב-$outlets יציאות — נדרשו '
        '${realTargets.length} ענפים; ${overflow.length} לא חוברו '
        '(נדרש מחלק עם יותר יציאות).');
    for (final t in overflow) {
      gaps.add(InstallationGap(manifold, t));
    }
  }

  var routed = 0; // actually-routed branches (each burns a zone letter)
  for (var bi = 0; bi < cap; bi++) {
    final t = realTargets[bi];
    final zl = _branchLabel(routed++);
    builtZones.add(zl);
    final seg = findShortestPath(root!, t,
        maxDepth: maxDepthPerSegment, tempC: tempC);
    if (seg == null) {
      final bridge = _findBridge(root, t, tempC);
      if (bridge != null) {
        add(bridge, zone: zl);
        add(t, zone: zl);
      } else {
        gaps.add(InstallationGap(root, t));
        add(t, zone: zl);
      }
      continue;
    }
    for (final p in seg.skip(1)) {
      add(p, zone: zl);
    }
  }

  // Auto-add TMTV anti-scald per branch for hot lines (tempC ≥ 60).
  // One per actual routed branch — skipped targets don't get a valve.
  if (manifold != null && tempC >= _kHotThresholdC && builtZones.isNotEmpty) {
    final tmtv = _skuOf('HW-TMTV-15');
    if (tmtv != null) {
      for (final zl in builtZones) {
        add(tmtv, zone: zl);
      }
    }
  }

  // Auto-add pre-set balancing valve per branch for commercial pump systems.
  final trunkSkus = items.map((p) => p.sku).toSet();
  if (trunkSkus.contains('HW-PUMP-40') && builtZones.isNotEmpty) {
    final bal = _skuOf('HW-BALANCE-20');
    if (bal != null) {
      for (final zl in builtZones) {
        add(bal, zone: zl);
      }
    }
  }

  // accessories: clamps + insulation per pipe unit, one sealant roll per line.
  if (accessories.isNotEmpty && items.isNotEmpty) {
    final pipeUnits =
        items.where(_isPipe).fold<int>(0, (s, p) => s + (qty[p.sku] ?? 1));
    for (final accSku in accessories) {
      final prod = _skuOf(accSku);
      if (prod == null) continue;
      final n = accSku == 'HW-SEALANT' ? 1 : (pipeUnits > 0 ? pipeUnits : 1);
      items.add(prod);
      qty[accSku] = n;
    }
  }

  // Auto-compliance: track which SKUs are new after the call so they can be
  // assigned to the "בטיחות" zone rather than appearing outside all zones.
  if (autoCompliance && items.isNotEmpty) {
    final skusBefore = qty.keys.toSet();
    // Thread `loop` through so a recirculation-loop tree (a hot-water ring feeding
    // a manifold) gets its loop-only safety group — 3rd isolation valve, check
    // valve, balancing valve, air vent, Legionella sampling point. Without it the
    // tree path silently dropped ALL of these (the linear buildInstallation passes
    // loop; buildTreeInstallation used to default it to false).
    _autoAddCompliance(items, qty, tempC, loop: loop);
    final added = qty.keys.toSet().difference(skusBefore);
    if (added.isNotEmpty) {
      zones['בטיחות'] = added.toList();
    }
  }

  return InstallationPlan(items, gaps, qty,
      zones: zones, warnings: engineWarnings);
}

