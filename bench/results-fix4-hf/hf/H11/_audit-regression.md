# Audit: Sechirut תקרה נמוכה Computed Field

## Findings

`gen_app_sechirut_ent1.dart:54 · Computed field תקרה נמוכה uses unpopulated _v[10] and _v[11] indices, resulting in min(0,0)=0 for all new records · P1 wrong-result · Line 54 should compute directly from inputs: min(((num.tryParse(_v[3]??'')??0)*3), ((num.tryParse(_v[3]??'')??0)*(num.tryParse(_v[4]??'')??0)/3)).toStringAsFixed(2) instead of referencing _v[10] and _v[11] which are never populated during form entry`

`gen_app_sechirut_ent1.dart:208 · Display of תקרה נמוכה in form also uses _v[10] and _v[11], showing 0 for new records and stale values when editing · P1 wrong-result · Use same direct computation as save logic to ensure display always reflects current input values`

## Coverage

**Verified correct:**
- Imports: `dart:math` is imported (line 11), so `min()` function is available ✓
- Police report: All checks pass including `calc` and `min` validation gates ✓
- Regression scope: Change is isolated to sechirut.txt and sechirut.json only; no other apps modified ✓
- Spec parsing: Spec adds field correctly; `min()` syntax is recognized ✓
- Content generation: Label 'תקרה נמוכה' is correctly added to content file (c29) ✓

**Could not verify (Dart runtime not available):**
- Actual runtime behavior of form entry and record creation
- Whether num.tryParse handles empty strings correctly in Dart (expected: null→0, verified from knowledge)
- Cascading effects on related entities (בטוחה, etc.) that reference this field

