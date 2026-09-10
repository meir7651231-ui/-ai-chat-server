# AUDIT: panuy app — Distance Sort & Real Distance Calc

## Findings

### Issue 1: Column Order Mismatch
**File:** `new/dart-gen-bs/gen_app_panuy_px1.dart` · line 34  
**Defect:** Spec declares table columns as `[טבלה] שם, זמין, מרחק בקמ, מחיר לשעה` (name, available, distance, price), but generated ForgeDataGrid shows columns in order: [name, available, **price/hour**, **distance**]  
**Severity:** P2 (minor) — spec violation, no impact on sorting/distance functionality  
**Fix:** Reorder columns in px1.dart line 34: swap positions of c3 (price) and c4 (distance) to match spec: `columns: [gen_app_panuy_px1_c1, gen_app_panuy_px1_c2, gen_app_panuy_px1_c4, gen_app_panuy_px1_c3]` and corresponding items array values

---

## Verification Results (PASSED)

✅ **Sort by distance (nearest first):**  
- `px1.dart:34` sorts by `gen_app_panuy_px1_c5` ('מרחק בקמ') with numeric comparison `nx.compareTo(ny)`
- Returns negative for `nx < ny` → ascending order (smallest/nearest first) ✓

✅ **Real distance in km (sqrt of squared-distance):**  
- `ent1.dart:50` saves: `gen_app_panuy_ent1_c25: (sqrt( num.tryParse(_v[10]) ?? 0 )).toStringAsFixed(2)`
- `ent1.dart:175` displays: `_calc(gen_app_panuy_ent1_c25, sqrt( num.tryParse(_v[10]) ?? 0 ))`
- `_v[10]` maps to `gen_app_panuy_ent1_c24` ('מרחק בריבוע') ✓
- Formula: `sqrt(squared_distance)` produces real distance in km ✓

✅ **sqrt() correctly imported and used:**  
- `ent1.dart:8` imports `dart:math` → `sqrt(num)` is top-level function ✓
- null-safe: `num.tryParse()` returns `num?`, handled with `?? 0` ✓

✅ **Squared-distance calculation correct:**  
- `ent1.dart:50` computes: `(Δlat)² × 12321 + (Δlon)² × 8649`
- Constants 12321, 8649 are correct scaling for lat/lon at ~32°N ✓

✅ **Police report checks passed:**
- `regen_ok` ✅ — generation succeeded
- `byte_identical_others` ✅ — no unrelated files changed
- `gates_pass`, `compiles`, `no_orphans` ✅ — build valid
- `sqrt` ✅ — import=true, fn=true, method=false (correct usage)
- `sort_list` ✅ — px1 particle renders

---

## Coverage Summary

**Verified:**
- Sort direction (ascending = nearest first) ✓
- Sort field selection (distance in km) ✓
- Distance formula (sqrt of squared-distance) ✓  
- Null safety and type correctness (num.tryParse, compareTo) ✓
- Import availability (dart:math) ✓
- Code compiles, no analyzer errors ✓

**Could not verify (audit read-only, no runtime):**
- Actual numeric sort result (e.g., [1.0, 2.5, 4.2] vs [4.2, 2.5, 1.0]) — would need test data
- Rendering correctness in Flutter UI — requires runtime/device

**Not checked (deferred to builder, passed police):**
- Other apps' integrity (byte_identical_others ✅)
- Orphaned files (no_orphans ✅)

---

## Summary

**Task completion:** ✅ DONE (2/2 requirements met)
1. Sorted by distance nearest-first ✓
2. Real distance in km (sqrt of squared-distance) ✓

**Regression:** ⚠️ P2 minor — column order in table doesn't match spec (price/distance swapped)

**Recommendation:** Flag column order mismatch; core functionality is correct.
