# Audit Report: H15 (peruk21) — Cases Sorting by Deadline

## Findings

No defects found.

## Verified Correct

**Task completion:**
- ✅ Sorting by עד מתי (deadline) implemented in both required locations
  - Particle screen (`gen_app_peruk21_px1.dart` line 28): `.sort((a, b) { ... })` on `appStore.records('app_peruk21_ent1').toList()` by field `c7` ('עד מתי')
  - Entity list screen (`gen_app_peruk21_ent1.dart` line 155): `rs.sort((a, b) { ... })` by field `c24` ('עד מתי')
- ✅ Sorting order is ascending (עולה = soonest first): `.compareTo()` methods return negative for smaller values, putting them first
- ✅ Spec changes correctly applied to both entity and particle definitions (lines 7 and 10 of peruk21.txt)
- ✅ Field indices map correctly: `gen_app_peruk21_px1_c7` = 'עד מתי', `gen_app_peruk21_ent1_c24` = 'עד מתي'

**Sorting logic correctness:**
- ✅ Empty fields handled: returned last (empty → 1, non-empty → -1)
- ✅ Numeric parsing: `num.tryParse()` with `.compareTo()` for numeric sort (0, 1, 2... in ascending order)
- ✅ String fallback: lexical `.compareTo()` for non-numeric text (alphabetical order)
- ✅ No NaN/infinity edge cases: using safe `num.tryParse()` with null coalescing

**State/regression checks:**
- ✅ No shared list mutation: sort applied inline on `.toList()` copy, original data untouched
- ✅ No unintended side effects to other apps: police report confirms `byte_identical_others ✅`
- ✅ No over-triggering substring matches: sorting field is explicitly named (עד מתי), not inferred
- ✅ No constant duplication: field references use centralized content constants (c7, c24)
- ✅ Sorting applied only to target records (`app_peruk21_ent1`), no cross-app pollution

**Generated code integrity:**
- ✅ Dart math: no custom sqrt/min/max (uses standard Dart `compareTo()`)
- ✅ No Hebrew in engine (changes in spec only, not in generator code)
- ✅ Compilation verified: police report shows `compiles ✅`

**Coverage:** Particle table sort (px1), entity list sort (ent1), both screen navigations, empty records handling, numeric and string date values, content constant mapping.

**Machine reports:** All task checks confirmed by police:
- `sort_px ✅ px1` — cases sorted in particle table by deadline
- `sort_ent ✅ ent1` — cases sorted in entity list by deadline
- `byte_identical_others ✅` — no regressions in other apps
- `compiles ✅` — generated Dart is valid
