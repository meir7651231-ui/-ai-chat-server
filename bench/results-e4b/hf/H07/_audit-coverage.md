# Audit Coverage Report: sechirut.txt תקרה מחייבת Task

## Findings

`machtzev/generator/specs-ds/sechirut.txt:38` · תקרה מחייבת field not included in report spec for "חישוב בטוחות" section · P1 task-incomplete · Update line 38 to add בטוחה.תקרה מחייבת to the doch spec: `דוח תיק: חישוב בטוחות = בטוחה.תקרה לפי 3 חודשים, בטוחה.תקרה לפי שליש, בטוחה.תקרה מחייבת, בטוחה.חורג, בטוחה.מעל התקרה`

## Verified Correct

**Math & Computation (ent2.dart)**:
- Line 51 & 179: max() correctly computes `max((num.tryParse(_v[6] ?? '') ?? 0), (num.tryParse(_v[7] ?? '') ?? 0))` where _v[6]=תקרה לפי 3 חודשים, _v[7]=תקרה לפי שליש
- Result formatted with .toStringAsFixed(2) ✅
- Saved to database as gen_app_sechirut_ent2_c24 ✅

**Entity Form (gen_app_sechirut_ent2.dart)**:
- Field displayed as _calc() widget at line 179 ✅
- Stored in map on save at line 51 ✅
- Loaded on edit at line 63 ✅
- Included in _labelsAll as index 8 (c24) ✅

**Entity List Surfaces**:
- Record cards display field at line 92 ✅
- CSV export includes field at line 100 ✅
- Table view shows field at line 191 ✅
- Field label "תקרה מחייבת" correct in content file (ent2_content.dart:26) ✅

**Spec Definition (sechirut.txt)**:
- Line 8 correctly updated: `תקרה מחייבת = max(תקרה לפי 3 חודשים, תקרה לפי שליש)` ✅
- Field placed after input ceilings, before dependent fields ✅
- No hand-edits in generated code ✅
- Compiles with zero errors ✅

**Unverified/Not Covered**: Report renders (would require running generator to see rp1 implementation); particles for בטוחה (spec shows חורג and מעל התקרה particles only, תקרה מחייבת not listed); hub nav (not defined in spec for בטוחה).

## Summary

Computed field תקרה מחייבת works correctly in entity form, list, and CSV export surfaces. **Spec line 38 (report definition) should have been updated in parallel with line 8 to include the new field in "חישוב בטוחות" section** — logically, a ceiling calculation report should display all three ceilings (the two inputs and their max). This is the only coverage gap.
