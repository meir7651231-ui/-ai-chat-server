# 🔍 Audit Report: sechirut Computed Field Implementation

## Findings

new/dart-gen-bs/gen_app_sechirut_ent1.dart:54 · computed field `תקרה נמוכה` uses stale values `_v[10]` and `_v[11]` instead of freshly computed ceiling fields · P0 compile-break (wrong calculation) · replace with `min((num.tryParse(_v[3] ?? '') ?? 0) * 3, (num.tryParse(_v[3] ?? '') ?? 0) * (num.tryParse(_v[4] ?? '') ?? 0) / 3)`

new/dart-gen-bs/gen_app_sechirut_ent1.dart:208 · computed field `תקרה נמוכה` display reads stale values `_v[10]` and `_v[11]` instead of fresh computation · P0 compile-break (wrong displayed result) · replace with `min((num.tryParse(_v[3] ?? '') ?? 0) * 3, (num.tryParse(_v[3] ?? '') ?? 0) * (num.tryParse(_v[4] ?? '') ?? 0) / 3)`

## Coverage

**Verified correct:**
- Spec modification correctly adds `תקרה נמוכה = min(תקרה לפי 3 חודשים, תקרה לפי שליש)` to entity תיק
- Field label appears correctly in content strings (ent1_c29 = 'תקרה נמוכה')
- `min()` function properly imported from `dart:math` (line 11)
- Null-safety handling: `num.tryParse()` returns `num?`, fallback to 0 is sound
- No breaking changes to other entities (בטוחה, ממצא, תשלום)
- Gates pass, regen works, no compile errors reported by flutter analyze

**Could not verify:**
- Runtime behavior (Flutter not installed): whether stale values cause actual wrong output when user edits שכירות or creates new record
- Whether the police report's `min · calc=true fn=true` check validates the formula against test data

## Defect Summary

The implementation references `_v[10]` (old תקרה לפי 3 חודשים) and `_v[11]` (old תקרה לפי שליש) instead of computing inline using current input values `_v[3]` (שכירות) and `_v[4]` (חודשים). This causes:
- New records: min(0, 0) = 0 (wrong)
- Edited records: min uses previously-saved ceilings, not recalculated ones (wrong)

Lines 205–207 show the correct pattern (computing c26, c27, c28 inline); line 208 breaks that pattern by deferring to `_v` indices instead.
