// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · productDivisionSystems — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/system_division.dart:22-69 (48 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): filterBySystem, where, contains, toList, catalogRepo, allProducts
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
Set<WaterSystem> productDivisionSystems(LipskeyCatalogProduct p) {
  final ends = kVerifiedSpecs[p.sku]?.endSystems;
  if (ends != null && ends.isNotEmpty) return ends;
  if (p.brand == 'פולירול') return const {WaterSystem.supply};
  return const {WaterSystem.drainage};
}

/// Pure: keep only products whose division belongs to [system]. Products with no
/// classifiable system are dropped when a system is selected (R8 — don't guess).
List<LipskeyCatalogProduct> filterBySystem(
    List<LipskeyCatalogProduct> list, WaterSystem? system) {
  if (system == null) return list;
  return list.where((p) => productDivisionSystems(p).contains(system)).toList();
}

/// True fixtures genuinely bridge both systems, so they show in BOTH departments
/// and their sub-categories split. Everything else belongs to its dominant
/// system only (Benzi #1, option 2 — clean, non-overlapping lists).
const _fixtureTitles = {'אסלות', 'מקלחות ואמבטיות', 'גופי תברואה'};

/// Per-category supply/drainage tallies, built ONCE over the (const) catalog so
/// a leaf's contribution is an O(1) map lookup instead of a full
/// `catalogRepo().allProducts()` rescan per leaf per call. Byte-equivalent: the
/// (sup, dr) for a category is exactly how many of its products carry each
/// system, the same numbers the per-leaf scan summed.
Map<String, ({int sup, int dr})>? _catSystemTally;
Map<String, ({int sup, int dr})> get _catSystemTallyIndex {
  if (_catSystemTally != null) return _catSystemTally!;
  final m = <String, ({int sup, int dr})>{};
  for (final p in catalogRepo().allProducts()) {
    final s = productDivisionSystems(p);
    final prev = m[p.categoryHe] ?? (sup: 0, dr: 0);
    m[p.categoryHe] = (
      sup: prev.sup + (s.contains(WaterSystem.supply) ? 1 : 0),
      dr: prev.dr + (s.contains(WaterSystem.drainage) ? 1 : 0),
    );
  }
  return _catSystemTally = m;
}

/// Memoised `nodeHasSystem` results keyed by `node.id|system` — the tree drill
/// asks the SAME (node, system) pair repeatedly (count + desc per row, every
/// frame). Pure over const data, so caching is byte-equivalent.
final Map<String, bool> _nodeHasSystemCache = {};

/// True if [node] belongs to [system]: fixtures → both sides; otherwise the
/// node's dominant system (over all products under it). Drives the department
/// division at the sub-category level.
