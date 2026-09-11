# ADR: Add קילומטראז׳ and מחיר לקמ to peruk12

## Context
Task E13 requires extending the תיק (case) entity in peruk12.txt with:
1. A numeric field קילומטראז׳ (vehicle mileage)
2. A computed field מחיר לקמ (price per kilometer)

## Opening Question
Q: Should both fields go in the ישות declaration or should the computed field be separate?
**Assumed Answer:** Both go in the ישות line as comma-separated fields, with the computed field declared inline as `מחיר לקמ = מחיר / קילומטראז׳`, following the pattern in panuy.txt.

## Decision
Added both fields to line 7 of peruk12.txt:
- `קילומטראז׳` — placed after `מחיר` (numeric type auto-detected from field name)
- `מחיר לקמ = מחיר / קילומטראז׳` — computed field using division formula

## Rationale
1. Field type detection is automatic: "קילומטראז׳" contains that word, so the generator treats it as numeric.
2. Computed fields in the spec language support arithmetic: `/ * + - ()` and functions.
3. Formula `מחיר / קילומטראז׳` gives price per km when both inputs are numeric.
4. Placement in entity declaration (not as separate particles) ensures schema-level availability.

## Alternatives Considered & Rejected
1. **Create a separate computed field outside the entity** — Spec language doesn't support that; computed fields must be inline.
2. **Add only the קילומטראז׳ field without computed field** — Task explicitly requires both.
3. **Use different formula (e.g., round, ceil)** — Task spec says "equal to מחיר divided by קילומטראז׳", so plain division is correct.

## Consequences
- Generated Dart code creates:
  - `final num קילומטראז׳` field (mutable, user input)
  - `num get מחיר לקמ` computed getter (read-only, calculated on access)
- Schema now supports vehicle mileage tracking and cost-per-km analysis.
- No impact on other apps (byte-identity verified by police-bench).
- Dart compilation passes (analyzer: 0 errors).

## Verification
- **Spec syntax**: Verified against SPEC-LANG.md and panuy.txt example.
- **Machine checks**: All 7 gates pass (regen_ok, byte_identical_others, no_orphans, gates_pass, no_hebrew_in_engine, dart_math_sane, compiles).
- **Field detection**: Police-bench confirms 1 field + 1 calc (consts=1 calc=1).
- **Byte-identity**: Other 31 apps remain unchanged.
- **Compilation**: 0 analyzer errors, dart_math_sane checks passed.
