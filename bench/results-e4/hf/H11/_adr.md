# ADR-H11: Add תקרה נמוכה (Lower Ceiling) Computed Field

**Status:** Implemented
**Date:** 2026-09-10
**Related:** Spec language § computed fields

## Context
The `תיק` (case/rental contract review) entity in sechirut.txt has two calculated ceiling fields:
- `תקרה לפי 3 חודשים` = `שכירות * 3` (rental × 3 months)
- `תקרה לפי שליש` = `שכירות * חודשים / 3` (rental × contract months / 3)

The task requires adding a third computed field that represents the minimum of these two — `תקרה נמוכה` (lower ceiling) — to show which ceiling is actually applicable under law.

## Decision
Add `תקרה נמוכה = min(תקרה לפי 3 חודשים, תקרה לפי שליש)` to the תיק entity in the spec.

**Why this location:** Spec language already supports computed fields with arbitrary formulas using built-in math functions including `min()`. No engine changes needed.

## Rationale
1. **Spec-only approach:** The SPEC-LANG.md (line 12) explicitly lists `min(…)` as a supported function for computed fields.
2. **Legal requirement:** The Israeli rental agreement law caps security deposits at the lower of: (a) 3 months' rent, or (b) 1/3 of total rental period. This field materializes that requirement.
3. **No side effects:** Adding a computed field does not require touching any other entity or app.
4. **Type safety:** The generator emits Dart with automatic `num.tryParse()` wrapping and `.toStringAsFixed(2)` for numeric precision.

## Alternatives rejected
- Manual Dart helper in the app: Would require UI-layer logic; spec language is the correct layer.
- Conditional field: Would be more complex; min() is simpler and clearer.
- Stored field (not computed): Would violate data integrity — the value must always be current.

## Consequences
- **Generated code:** The machine generated Dart code including the `min()` call on line 54 of gen_app_sechirut_ent1.dart.
- **Test coverage:** Numeric edge cases (rent=0, months=0) are handled by the generator's null-coalescing defaults.
- **No regression:** All other apps remain byte-identical; only sechirut.txt changed.

## Verification
✅ Spec edited: Line 7 of sechirut.txt updated with new field.
✅ Regeneration: `node machtzev/generator/app-ds.mjs` ran successfully.
✅ Dart generated: gen_app_sechirut_ent1.dart contains `min()` call as expected.
✅ No orphans: Command used `--name sechirut` to prevent orphan ent files.
