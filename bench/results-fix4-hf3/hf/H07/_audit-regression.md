# Audit Report: sechirut task — תקרה מחייבת computed field

## Task Verification
**Requirement**: Add computed field תקרה מחייבת = max(תקרה לפי 3 חודשים, תקרה לפי שליש) to בטוחה entity; don't break anything.

**Spec change**: gen_app_sechirut_ent2.dart line 51 correctly generates:
```dart
gen_app_sechirut_ent2_c24: (max( (num.tryParse(_v[6] ?? '') ?? 0) ,  (num.tryParse(_v[7] ?? '') ?? 0) )).toStringAsFixed(2),
```
Where _v[6]=תקרה לפי 3 חודשים, _v[7]=תקרה לפי שליש. Correctly uses top-level dart:math max(), imported line 9.

**Police verdict**: All checks passed (calc=true fn=true, 53 gates, 0 orphans, byte_identical_others ✅, compiles 0 errors).

## Findings

No defects found.

## Coverage

✅ **Verified correct**: 
- max() computed field correctly wired at בטוחה.ent2, indices 6–7 map to correct fields
- max() top-level function from dart:math, not a method call (correct per Dart semantics — num has no .max() method)
- Calculation pipes through num.tryParse(…) ?? 0 defensively, then .toStringAsFixed(2) for storage
- Field display label gen_app_sechirut_ent2_c24 = 'תקרה מחייבת' ✓
- No state leakage: records('app_sechirut_ent2') unchanged, display paths consistent
- Report "חישוב בטוחות" does not reference new field (not required by task)
- All other 6 sechirut apps (main, hub, scr5, shell, settings + 13 content files) unchanged; no orphans

⚠️ **Pre-existing issue (not builder responsibility)**:  
gen_app_sechirut_ent2_content.dart c21 = 'תקרה לפי חודשים' (should be 'תקרה לפי 3 חודשים' per spec). Same issue in ent1 (תיק entity). Generator systematically strips the "3" from display labels; affects UI only, not field logic or max() correctness.
