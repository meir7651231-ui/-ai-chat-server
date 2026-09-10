# Audit: Computed Field תקרה נמוכה Coverage

## Findings

No defects found in the commit. The new computed field תקרה נמוכה (minimum ceiling) is correctly implemented across all required surfaces.

## Verified Coverage

✅ **Entity List Screen** (gen_app_sechirut_ent1.dart):
- Line 54: Field computed correctly in `_save()` method using `min(_v[10], _v[11])`
- Line 208: Field displayed in calculated section with `_calc(gen_app_sechirut_ent1_c29, min(...))`
- Line 105-108: Card display includes c29 in both labels and values lists
- Line 118-126: CSV export includes all 13 fields including c29

✅ **Particle Table** (gen_app_sechirut_px1.dart):
- Line 34: DataGrid includes gen_app_sechirut_px1_c19 ('תקרה נמוכה') in columns
- Line 34: Table items reference (r[gen_app_sechirut_px1_c32] ?? '') to display field value

✅ **Root/Hub Detail Screen** (gen_app_sechirut_root.dart):
- Line 36: DsFold facts section includes field with conditional `if ((r0[gen_app_sechirut_root_c64] ?? '').trim().isNotEmpty)`
- Display uses KvLine with label c48 and value c49, both set to 'תקרה נמוכה'

✅ **Computation Logic** (gen_app_sechirut_ent1.dart):
- Line 54, 208: Correctly implements `min((num.tryParse(_v[10]) ?? 0), (num.tryParse(_v[11]) ?? 0))`
- _v[10] = תקרה לפי שליש (computed as שכירות * 3)
- _v[11] = תקרה לפי שליש (computed as שכירות * חודשים / 3)
- dart:math imported (line 11) and min() function is stateless, correctly typed

✅ **Compilation** (per _police.md):
- `compiles`: ✅ 0 analyzer errors
- `calc`: ✅ consts=1 calc=1 (one constant, one computed formula)
- `min`: ✅ calc=true fn=true (correctly uses min function from dart:math)

✅ **No Regressions**:
- `byte_identical_others`: ✅ Only sechirut spec-generated files changed
- `no_orphans`: ✅ No orphaned files created
- `gates_pass`: ✅ All 53 gates passed

**All surfaces mentioned in task covered. No breaking changes.**
