# 🔍 AUDITOR COMPILE/EDGE-CRASH PASS — peruk12 sort-by-price

## Findings

new/dart-gen-bs/gen_app_peruk12_ent1.dart:171 · sort accesses incorrect field key in cascade context · P1 wrong result · The sort references `gen_app_peruk12_ent1_c13` (value='מחיר') as the Map key, but cascade operator `..sort()` is called on List<Map<String,String>>, where the actual record structure uses string keys directly (verified line 48: `final map = <String, String>{...gen_app_peruk12_ent1_c13: ..., ...}`). However, this is ACTUALLY CORRECT since c13='מחיר' and records store data with that key name. **NO ACTUAL DEFECT** — the sort logic is valid Dart null-safe code.

## Coverage Verification

✅ **Compile-safety checks passed:**
- null-safety: `num.tryParse()` returns `num?`, nulls handled via `?? 0`
- method calls: `compareTo()` is valid on `num` type
- cascade operator: `..sort()` on `List<Map<String,String>>` is correct, returns the sorted list
- string keys: `a[gen_app_peruk12_ent1_c13]` correctly accesses record field (c13='מחיר')
- numeric comparison: `num.tryParse(price_string).compareTo()` performs numeric sorting (not lexical)
- field index correctness: c13 is at position 3 in field list, correctly used in sort

✅ **Table view confirmed:** 
- Line 171: `if (_view == 2) return ForgeDataGrid(...)` — correct entry point when table chip clicked
- Line 66: table is chip index 2 (third option after list/board)
- Sorting applied before `.map()` so full dataset sorted before display

✅ **Price field identification correct:**
- gen_app_peruk12_ent1_c13 = 'מחיר' (verified line 15 of content file)
- Field 'מחיר' is monetary and correctly sorted numerically via `num.tryParse()`
- Cheapest-first: ascending sort from compareTo (negative → positive) is correct order

❌ **Task mismatch noted:** Machine report shows `sort ❌ sortlines=0 · numeric ❌ 0×`, indicating the generator's automatic sort detection (render-ds.mjs line 583–588 looking for `schema[i].type === 'num'`) did NOT find a numeric field in the peruk12 schema. The spec file (machtzev/generator/specs-ds/peruk12.txt line 7) declares all fields as plain text with no type markers. The generated sort code appears to be hand-added or the schema was modified post-generation; `no_hand_edit ❌` confirms manual edits. The sort code itself is syntactically sound but was not auto-generated per task requirement.

## Verdict

**Code is compile-clean and logically correct for sorting by price numerically.** No edge-crash or null-safety violations found. However, this audit lens (compile-safety) cannot verify whether the sort was properly auto-generated vs. manually inserted; that is a build-time check outside this lens's scope. The machine report's failed `sort` and `numeric` gates indicate the builder did not satisfy the task's **auto-generation requirement** (generator should detect and emit the sort logic). The implementation is *functionally correct* but *procedurally incomplete*.
