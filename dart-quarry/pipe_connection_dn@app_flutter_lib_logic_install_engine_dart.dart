// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · pipeConnectionDn — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:596-669 (74 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): pipeSharedWith, compatibleWith, putIfAbsent, where, canConnect, productSuitableForTemp, toList, compareTo, findAlternativePaths, findShortestPath, contains
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String? pipeConnectionDn(LipskeyCatalogProduct a, LipskeyCatalogProduct b) {
  final vA = kVerifiedSpecs[a.sku], vB = kVerifiedSpecs[b.sku];
  if (vA == null || vB == null) return null;
  for (final eA in vA.ends) {
    for (final eB in vB.ends) {
      if (eA.pipeSharedWith(eB)) return eA.size;
    }
  }
  return null;
}

// Memoized: the result depends only on (anchor.sku, tempC) because the
// universe is fixed for the run (overlay hydrates pre-runApp), so this avoids
// a full O(N) catalog scan on every BFS expansion.
final _compatCache = <String, List<LipskeyCatalogProduct>>{};
List<LipskeyCatalogProduct> compatibleWith(
        LipskeyCatalogProduct anchor, {int tempC = 20}) =>
    _compatCache.putIfAbsent('${anchor.sku}|$tempC', () => chainUniverse
        .where((p) => canConnect(anchor, p) && productSuitableForTemp(p, tempC))
        .toList()
      ..sort((a, b) => (a.categoryHe == anchor.categoryHe ? 0 : 1)
          .compareTo(b.categoryHe == anchor.categoryHe ? 0 : 1)));

/// Up to [k] alternative paths from [from] to [to], ordered by cost.
/// Each returned path is distinct from the others (no path is a prefix or
/// duplicate of another). When fewer than [k] viable paths exist, returns
/// what was found. Useful for offering the plumber 2–3 installation options
/// instead of a single forced choice.
List<List<LipskeyCatalogProduct>> findAlternativePaths(
  LipskeyCatalogProduct from,
  LipskeyCatalogProduct to, {
  int k = 3,
  int maxDepth = 6,
  int tempC = 20,
}) {
  if (k <= 0) return const [];
  final results = <List<LipskeyCatalogProduct>>[];
  final first = findShortestPath(from, to, maxDepth: maxDepth, tempC: tempC);
  if (first == null) return const [];
  results.add(first);

  // Yen-style: for each edge in the current best path, find the shortest
  // path that avoids using that specific (prev → next) edge, then keep the
  // top k by cost. Each "blocked edge" is a (sku_a, sku_b) pair.
  final blocked = <(String, String)>{};
  while (results.length < k) {
    var bestCandidate = <LipskeyCatalogProduct>[];
    int bestCost = 1 << 30;
    final lastPath = results.last;
    for (var i = 0; i < lastPath.length - 1; i++) {
      final edge = (lastPath[i].sku, lastPath[i + 1].sku);
      if (blocked.contains(edge)) continue;
      blocked.add(edge);
      final p = _findShortestPathExcluding(from, to,
          maxDepth: maxDepth, tempC: tempC, blocked: blocked);
      blocked.remove(edge);
      if (p == null) continue;
      // skip duplicates
      if (results.any((r) =>
          r.length == p.length &&
          List.generate(r.length, (i) => r[i].sku == p[i].sku)
              .every((b) => b))) continue;
      final c = _pathCost(p);
      if (c < bestCost) {
        bestCost = c;
        bestCandidate = p;
      }
    }
    if (bestCandidate.isEmpty) break;
    results.add(bestCandidate);
  }
  return results;
}

