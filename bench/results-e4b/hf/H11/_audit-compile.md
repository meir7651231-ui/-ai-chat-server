# Audit: sechirut תקרה נמוכה Implementation

## Findings

**new/dart-gen-bs/gen_app_sechirut_ent1.dart:54** · When saving a new תיק record, תקרה נמוכה computes as min(0, 0)=0 instead of min(c27, c28)—uses empty _v[10] and _v[11] (computed fields) rather than deriving directly from input _v[3]=שכירות and _v[4]=חודשים · **P1 wrong result** · Compute c29 directly: `min((num.tryParse(_v[3]??'')??0)*3, (num.tryParse(_v[3]??'')??0)*(num.tryParse(_v[4]??'')??0)/3)` instead of `min(num.tryParse(_v[10]??'')??0, num.tryParse(_v[11]??'')??0)`.

**new/dart-gen-bs/gen_app_sechirut_ent1.dart:208** · When user creates new record and enters שכירות+חודשים, the live _calc display of תקרה נמוכה shows 0 instead of the correct min—reads stale/empty _v[10]–_v[11] instead of recalculating from current input state · **P1 wrong result** · Compute from inputs same as line 54, so live preview updates as user types.

## Coverage

✅ **Checked:**
- Field index mapping: _labelsAll indices 0–12 mapped to field names (c9–c29), with indices 0–8 user inputs, indices 9–12 computed fields
- min() function imported via `import 'dart:math'` (line 11), Dart language support confirmed
- null-safety: `num.tryParse()` returns `num?`, correctly chained with `?? 0` for default
- Null-safe vector access: `_v[n] ?? ''` safely accesses potentially missing indices

❌ **Could not check:**
- Runtime behavior (app not executable in read-only mode)
- Whether police "calc" gate actually verified the reference-stale-values bug (it only verifies compilation and gate rules)
- Impact on בטוחה entity calculations (ent2 does not use min(), only reads the buggy fields from ent1)

## Verdict

The task is **functionally incomplete**. The field תקרה נמוכה is declared and compiles, but the calculation logic is wrong: it references empty computed fields (_v[10], _v[11]) instead of deriving the minimum directly from user inputs. When a user creates a new תיק and enters שכירות and חודשים, תקרה נמוכה will compute as 0, not the correct `min(שכירות*3, שכירות*חודשים/3)`.

