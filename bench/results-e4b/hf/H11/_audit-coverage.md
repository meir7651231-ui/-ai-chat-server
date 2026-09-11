# Task Coverage Audit — sechirut.txt: תקרה נמוכה = min(3m, third)

## Findings

**new/dart-gen-bs/gen_app_sechirut_ent1.dart:54** · Computed field תקרה נמוכה uses stale input values instead of freshly calculated ceilings · **P1 wrong result** · Recalculate min() from newly computed c27/c28 values: extract c27 and c28 calculations to variables, then use those in c29 calc: `final c27v = (num.tryParse(_v[3]??'')??0)*3; final c28v = (num.tryParse(_v[3]??'')??0)*(num.tryParse(_v[4]??'')??0)/3; gen_app_sechirut_ent1_c29: (min(c27v, c28v)).toStringAsFixed(2)` (similar fix needed at line 209 in _calc hook).

## Coverage

**Verified Correct:**
- Entity definition: field declared in spec, label is 'תקרה נמוכה' (ent1_content.dart:31) ✓
- Particle table (px1): field appears as column c19='תקרה נמוכה' and data value c32 (px1_content.dart:19, 34; px1.dart:34 shows all 13 columns and items) ✓
- Entity form: field loaded/saved in _edit and _save flows (ent1.dart:66, 54) ✓
- Home/list screen: field accessible via entity records ✓
- Report: field not declared in spec דוח lines, so correctly omitted ✓
- Compiles: flutter analyze passes 0 errors per police report ✓
- min() function: correctly imported from dart:math (ent1.dart:11) ✓

**Could not verify:** Runtime behavior when user edits שכירות/חודשים — the stale-value bug only manifests on save after editing those inputs; machine does not run app.
