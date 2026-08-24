// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _pathCost — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:670-815 (146 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): flowRole, productSystems, intersection, canConnect, contains, firstKey, removeLast, remove, compatibleWith, putIfAbsent, findShortestPath
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
int _pathCost(List<LipskeyCatalogProduct> path) {
  var c = 0;
  for (var i = 0; i < path.length - 1; i++) {
    c += _edgeCost(path[i], path[i + 1]);
  }
  return c;
}

/// Same algorithm as [findShortestPath] but with a set of blocked directed
/// edges (sku→sku). Used by [findAlternativePaths] to generate Yen-style
/// alternatives.
List<LipskeyCatalogProduct>? _findShortestPathExcluding(
  LipskeyCatalogProduct from,
  LipskeyCatalogProduct to, {
  required int maxDepth,
  required int tempC,
  required Set<(String, String)> blocked,
}) {
  if (from.sku == to.sku) return [from];
  // Two terminal devices belong to two separate fixtures — they never join
  // directly to each other (a second trap = double-trap; two draw-off taps in
  // series = two fixtures on one feed). A line carries at most one terminal.
  if (flowRole(from) == FlowRole.fixture && flowRole(to) == FlowRole.fixture) {
    return null;
  }
  final sysFrom = productSystems(from);
  final sysTo = productSystems(to);
  if (sysFrom.intersection(sysTo).isEmpty) return null;
  if (canConnect(from, to) && !blocked.contains((from.sku, to.sku))) {
    return [from, to];
  }
  final buckets =
      SplayTreeMap<int, List<(List<LipskeyCatalogProduct>, Set<WaterSystem>)>>();
  buckets[0] = [([from], sysFrom)];
  final bestCost = <String, int>{from.sku: 0};
  while (buckets.isNotEmpty) {
    final cost = buckets.firstKey()!;
    final bucket = buckets[cost]!;
    final (path, sysAcc) = bucket.removeLast();
    if (bucket.isEmpty) buckets.remove(cost);
    final tail = path.last;
    if (tail.sku == to.sku) return path;
    if (cost > (bestCost[tail.sku] ?? 1 << 30)) continue;
    if (path.length > maxDepth) continue;
    for (final next in compatibleWith(tail, tempC: tempC)) {
      if (blocked.contains((tail.sku, next.sku))) continue;
      final isTarget = next.sku == to.sku;
      if (!isTarget && !_usableConnector(next)) continue;
      final sysNext = sysAcc.intersection(productSystems(next));
      if (sysNext.isEmpty) continue;
      if (isTarget && sysNext.intersection(sysTo).isEmpty) continue;
      final newCost = cost + _edgeCost(tail, next);
      if (newCost >= (bestCost[next.sku] ?? 1 << 30)) continue;
      bestCost[next.sku] = newCost;
      buckets.putIfAbsent(newCost, () => []).add(([...path, next], sysNext));
    }
  }
  return null;
}

/// BFS shortest path from [from] to [to] through the compatibility graph.
/// Returns null when no path exists within [maxDepth] hops.
/// tempC filters out materials unsuitable for the line temperature.
List<LipskeyCatalogProduct>? findShortestPath(
  LipskeyCatalogProduct from,
  LipskeyCatalogProduct to, {
  int maxDepth = 6,
  int tempC = 20,
}) {
  if (from.sku == to.sku) return [from];
  // Two terminal devices belong to two separate fixtures — they never join
  // directly to each other (a second trap = double-trap; two draw-off taps in
  // series = two fixtures on one feed). A line carries at most one terminal.
  if (flowRole(from) == FlowRole.fixture && flowRole(to) == FlowRole.fixture) {
    return null;
  }

  // The whole line must stay within one plumbing system. Track the running
  // intersection of every product's systems; an empty intersection = the line
  // would have to cross supply↔drainage, which only happens inside a fixture.
  final sysFrom = productSystems(from);
  final sysTo = productSystems(to);
  // Fast reject: the running system intersection starts at sysFrom and can only
  // shrink, so reaching `to` requires sysFrom ∩ sysTo ≠ ∅. If they share no
  // system (e.g. a supply faucet and a drainage pipe), no path can exist —
  // return immediately instead of exhausting the whole reachable subgraph.
  if (sysFrom.intersection(sysTo).isEmpty) return null;
  if (canConnect(from, to)) return [from, to];

  // Least-cost search (Dijkstra). Cost = 10·(parts) + (material transitions),
  // so the result is always a shortest-part path (no regression on hop counts),
  // and among equal-length paths the one with the fewest material changes wins —
  // e.g. an all-copper reduction is preferred over copper→brass→copper.
  final buckets =
      SplayTreeMap<int, List<(List<LipskeyCatalogProduct>, Set<WaterSystem>)>>();
  buckets[0] = [([from], sysFrom)];
  final bestCost = <String, int>{from.sku: 0};

  while (buckets.isNotEmpty) {
    final cost = buckets.firstKey()!;
    final bucket = buckets[cost]!;
    final (path, sysAcc) = bucket.removeLast();
    if (bucket.isEmpty) buckets.remove(cost);

    final tail = path.last;
    if (tail.sku == to.sku) return path; // popped goal at minimum cost
    if (cost > (bestCost[tail.sku] ?? 1 << 30)) continue; // stale entry
    if (path.length > maxDepth) continue;

    for (final next in compatibleWith(tail, tempC: tempC)) {
      final isTarget = next.sku == to.sku;
      // Auto-inserted connectors must be real flow connectors with verified
      // geometry — never accessories (hangers/clamps) or unverified loose matches.
      if (!isTarget && !_usableConnector(next)) continue;
      final sysNext = sysAcc.intersection(productSystems(next));
      if (sysNext.isEmpty) continue; // would cross systems — reject
      if (isTarget && sysNext.intersection(sysTo).isEmpty) continue;
      final newCost = cost + _edgeCost(tail, next);
      if (newCost >= (bestCost[next.sku] ?? 1 << 30)) continue;
      bestCost[next.sku] = newCost;
      buckets.putIfAbsent(newCost, () => []).add(([...path, next], sysNext));
    }
  }
  return null;
}

/// Pure connector/adapter categories — nipples, bushings, couplers, elbows,
/// gaskets, pipe segments. These are the parts a plumber adds *only* to bridge a
/// gap, so they're the right things to auto-insert. Functional devices (valves,
/// manifolds, shower arms, pumps) are NOT here: they belong in a line only when
/// the installer explicitly anchors them, never as filler.
const _fittingCats = {
  'אביזרי נחושת', 'אביזרי תבריג', 'מחברי HDPE', 'מחברי NTM', 'אביזרי שקע-תקע',
  'ברכיים', 'מסעפים וחיבורי אסלה', 'אטמים ופקקים', 'מצמדים וצינורות', 'צינורות',
  'צינורות אפורות', 'צינורות PP', 'אביזרי חיבור', 'סטי הידוק וחיבורים',
  'פקקים וצינורות', 'זקיף אסלה',
};

/// Name-derived fitting nouns — the fallback vocabulary for an IMPORTED
/// company catalog, whose category names never match [_fittingCats]. Gated on
/// [companyCatalogActive], so demo/off-overlay cost surfaces are untouched.
const _fittingTypes = {
  'מצמד', 'מחבר', 'מופה', 'ניפל', 'בושינג', 'רקורד', 'מתאם',
  'ברך', 'זווית', 'מסעף', 'מעבר', 'אביזר',
};

