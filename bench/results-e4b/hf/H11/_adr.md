# ADR-H11 — Computed field תקרה נמוכה in sechirut app

**Status:** Accepted (verified by machine report)
**Date:** 2026-09-10
**Task:** H11 — Add computed field for minimum ceiling in rental case entity

## Context

The sechirut (שכירות/rental) app tracks rental agreements and their associated guarantees (בטוחות). Israeli housing law defines a maximum guarantee ceiling as the **lower of two amounts**:
- תקרה לפי 3 חודשים (ceiling based on 3 months' rent)
- תקרה לפי שליש (ceiling based on one-third of total contract period rent)

The two ceiling amounts are computed but the lower of the two was not explicitly exposed to the UI as a field.

## Decision

Add a computed field `תקרה נמוכה` (lower ceiling) to the `תיק` (case) entity that automatically calculates `min(תקרה לפי 3 חודשים, תקרה לפי שליש)`.

**Why:** 
- The law itself (תוכן חוק line 70) defines the cap as "הנמוך מבין" (the lower of the two)
- Both source ceilings are already computed; deriving the legal ceiling is a pure data calculation
- Spec language already supports `min()` function (documented in SPEC-LANG.md)
- This allows future UI elements to reference the single authoritative ceiling

## Rationale

1. **Spec-only change** — No engine logic modified. The min() function is already implemented in the generator.
2. **One-line edit** — Added field to line 7 of sechirut.txt following the spec language syntax.
3. **Zero risk** — Computed fields are read-only; no state mutations possible.
4. **Follows existing pattern** — Similar to the two existing computed ceilings in the same entity.

## Alternatives rejected

- **Compute in UI layer** — Would duplicate business logic across display screens; harder to maintain.
- **Compute in report template** — Reports can reference fields but can't define new ones; spec layer is the correct layer.
- **Add to entity בטוחה** — The legal ceiling applies per rental agreement (תיק), not per guarantee form (בטוחה).

## Consequences

- New field available for queries, reports, and display
- No impact on existing calculations (fields are independent)
- Backward compatible — field is additive, not modifying existing contract structure

## Verification

- Machine report: **DONE** ✅
  - regen_ok: app regenerates without errors
  - byte_identical_others: all other apps unchanged
  - calc: computed field properly declared
  - min: min() function confirmed working
  - compiles: Dart code has 0 analyzer errors
  - no_hand_edit: generator produced all code
- Inspection audit: **GO** ✅ (all 6 lenses pass)
