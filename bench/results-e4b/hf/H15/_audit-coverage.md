# Task Audit: Sort cases by deadline עד מתי (soonest first)

## Coverage Check

**Task Requirement:** Sort cases by deadline עד מתי (soonest first) everywhere they are listed:
- Particle screen: cases table ✅
- Entity list screen: entity list ✅

**Changes Made:**
- Spec updated: `machtzev/generator/specs-ds/peruk21.txt` line 7 added `| מיון: עד מתי עולה` to entity definition
- Spec updated: `machtzev/generator/specs-ds/peruk21.txt` line 10 added `| מיון: עד מתי עולה` to particle definition
- Generated files: `new/dart-gen-bs/gen_app_peruk21_ent1.dart` and `new/dart-gen-bs/gen_app_peruk21_px1.dart` correctly emit sort logic

## Verification Results

**Entity List Screen (gen_app_peruk21_ent1.dart:155):**
- Sorts by `gen_app_peruk21_ent1_c24` which maps to `'עד מתי'` ✅
- Applies to all views: list, board/kanban, table ✅
- Sort logic: ascending numeric/date comparison, empties last ✅

**Particle Screen (gen_app_peruk21_px1.dart:28):**
- Sorts by `gen_app_peruk21_px1_c7` which maps to `'עד מתי'` ✅
- Sort logic: ascending numeric/date comparison, empties last ✅

**Sort Logic Validation:**
- Ascending comparison using `nx.compareTo(ny)` for numbers ✅
- String comparison using `x.compareTo(y)` for non-numeric values ✅
- Empty values placed last via `if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1` ✅

**Police Report Validation:**
- `sort_px` check: ✅ CONFIRMED
- `sort_ent` check: ✅ CONFIRMED
- All other checks passed: regen_ok, byte_identical_others, gates_pass, compiles, etc. ✅

## Findings

No findings — the implementation is correct and complete.

**Coverage verified:**
- Entity list screen particle table sorted by deadline ascending: confirmed at line 155 of ent1.dart
- Particle screen cases table sorted by deadline ascending: confirmed at line 28 of px1.dart
- Both use correct ascending sort with proper type handling (numeric dates, string fallback, empties last)
- All three views on entity screen (list/board/table) receive sorted data from same `rs` list
- Machine checks (sort_px, sort_ent) passed; no compilation errors
- No breakage in other screens or functionality
