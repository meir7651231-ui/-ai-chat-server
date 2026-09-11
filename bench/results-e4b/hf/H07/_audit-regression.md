# 🔍 Auditor Report — sechirut task (computed field תקרה מחייבת)

## Findings

No findings.

## Coverage verified

**Task completion & formula correctness (field index mapping):**
- ✓ Spec line 8: new field `תקרה מחייבת = max(תקרה לפי 3 חודשים, תקרה לפי שליש)` defined correctly
- ✓ gen_app_sechirut_ent2_content.dart line 26: constant `c24 = 'תקרה מחייבת'` present
- ✓ gen_app_sechirut_ent2.dart line 30 (_labelsAll): field included at index 8 of 11 fields
- ✓ gen_app_sechirut_ent2.dart line 51 (_save): computed as `max( (num.tryParse(_v[6] ?? '') ?? 0) ,  (num.tryParse(_v[7] ?? '') ?? 0) ).toStringAsFixed(2)`
  - Index [6] = c21 = תקרה לפי 3 חודשים ✓
  - Index [7] = c23 = תקרה לפי שליש ✓
  - Formula: max(field 6, field 7) ✓

**Dart code soundness:**
- ✓ Import: `dart:math` present at line 9
- ✓ max() usage: top-level function call, not method (bytes: `max( ... )` not `.max(...)`)
- ✓ Numeric safety: both arguments wrapped with `num.tryParse(...) ?? 0` fallback
- ✓ String conversion: result via `.toStringAsFixed(2)` for 2-decimal precision

**Display & persistence:**
- ✓ gen_app_sechirut_ent2.dart line 63 (_edit): field loaded from record as `_v[8] = r[gen_app_sechirut_ent2_c24] ?? ''`
- ✓ gen_app_sechirut_ent2.dart line 92 (_card): field displayed as `r[gen_app_sechirut_ent2_c24] ?? ''` (reads stored value)
- ✓ gen_app_sechirut_ent2.dart line 179 (form): live calculation shown with `_calc(gen_app_sechirut_ent2_c24, max(...))`
- ✓ gen_app_sechirut_ent2.dart line 100 (_csv): field included in export row

**State-leakage & regression:**
- ✓ Only gen_app_sechirut_ent*.dart and gen_app_sechirut_*_content.dart modified (no orphans, other apps byte-identical per police)
- ✓ Police report confirms: regen_ok, byte_identical_others, no_orphans, gates_pass, dart_math_sane, compiles (0 errors), max check passes
- ✓ No accumulation of constants: 1 calc field added (per police: `calc=1`)

**Unverified claim resolution:**
- Police claimed "formula_correct" as UNVERIFIED
- Verified: field indices [6] and [7] correctly map to the two ceiling fields in spec order
