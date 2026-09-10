# Audit: sechirut app table sorting (compile + null-safety + type-safety)

## Findings

**No compile-break or runtime-safety defects found in sechirut app.**

### Verified Correct

**Sorting implementation (line 34, gen_app_sechirut_px1.dart)**
- Sort field: `gen_app_sechirut_px1_c19 = 'שכירות'` ✓ (correct rent field)
- Sort order: `return -c;` reverses comparison for descending order ✓ (highest-first)
- Numeric handling: `num.tryParse()` with null-check before `.compareTo()` ✓
- Empty value handling: Placed at end via `if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1;` ✓
- Null safety: All record field accesses use `?? ''` or `?? 0` ✓
- Type safety: 
  - `num.tryParse(String)` → `num?` (correct static method)
  - `.compareTo()` on `num` when `nx != null && ny != null` (flow-analyzed as non-null) ✓
  - `.compareTo()` on `String` (String has this method) ✓
  - `.trim().isNotEmpty` on String values ✓

**Table columns (line 34, columns array)**
All 12 column references map to defined constants in _content.dart (c7–c18) ✓

**Data extraction (line 34, items array)**
All row field references (c20–c31) map to defined constants ✓
Pattern: `(r[fieldConstant] ?? '')` properly handles nulls ✓

**Other particles on same screen (lines 33, 35–40)**
- Line 33: `ForgeStatusChip` with `(r[c1] ?? '')` ✓
- Line 37: `(num.tryParse(r[c55] ?? '') ?? 0).toStringAsFixed(0)` — correctly chains null-coalescing ✓
- Line 38–39: Complex message building with `.referencing()` and `.join()` chains; all `.trim().isNotEmpty` guards properly placed ✓

**Generator spec change**
Line 22 of specs-ds/sechirut.txt changed from `[טבלה]` to `[טבלה] | מיון: שכירות יורד` correctly ✓

## Task Coverage

✅ **Sort clause present**: `| מיון: שכירות יורד` in spec line 22
✅ **Descending order implemented**: Reversal with `-c` in comparator  
✅ **Numeric sort**: `num.tryParse()` comparison for rent values
✅ **Compiles without errors**: Flutter analyze 0 errors (police report confirmed)
✅ **Sorting gates pass**: `sort` + `desc` gates confirmed by police

## Unrelated Issue (Cleanup, Not Functional)

⚠️ **Orphan generated files** (no spec — separate issue):
Files like `gen_app_audit_content.dart`, `gen_app_bind4_content.dart`, `gen_app_ent1_content.dart` etc. exist in new/dart-data-bs/auto/ but have no corresponding .txt spec files. These belong to other failed/incomplete apps and should be deleted, but they do not affect the sechirut app's functionality.

## Verdict

**Sechirut app table sorting: CORRECT** — No compile, null-safety, or type-safety defects in the generated sechirut code. The rent-field sort in descending order is properly implemented and passes all functional gates.

