# ADR — E15 Task: סכום כולל מעמ Computed Field

## Context
The task requires adding a computed field to the `משימה` (task) entity in `machtzev/generator/specs-ds/tasks.txt`.
The field should be named `סכום כולל מעמ` and should equal the existing `סכום` field multiplied by 1.18 (18% VAT addition).

## Opening Question (per MASTER_PROTOCOL ג.1)
**Q:** Can a computed field be added directly to the spec language syntax, or must the computation be defined in the engine?
**A (Assumed):** The spec language supports computed fields via formula syntax (likely `=` notation as seen in spec-lang patterns). The engine will parse and generate the computation. The spec file is the source of truth; the engine handles implementation.

## Decision
Add the computed field to the spec file using the existing formula syntax, in the correct layer (spec .txt, not in generated outputs).

## Rationale
- The MASTER_PROTOCOL §ג.2 mandates 10-step decomposition; this task is minimal (one line in spec).
- The spec layer is the only place to add new fields; the engine respects the spec as source of truth.
- Multiplying by 1.18 is a pure arithmetic operation, not a complex business rule.
- The field name follows Hebrew naming conventions: `סכום כולל מעמ` (total amount with VAT).

## Alternatives Rejected
- Hand-editing generated `.dart` files: Would violate byte-identity checks (PROTOCOL layer 3).
- Creating a new helper file: Over-engineered for a simple multiplication.

## Consequences
- The machine report (`police-bench.mjs`) will re-run the generator and verify byte-identity.
- If the spec syntax is invalid, the gate will fail and guide correction.
- No breakage expected: adding a field to an entity is additive.

## Verification (Final)
✅ **DONE** — Machine report confirms:
- `regen_ok` ✅: Generator ran all pipelines successfully
- `byte_identical_others` ✅: No files outside task namespace changed
- `gates_pass` ✅: All five gates (app-from-sentences, retarget, skin-golden, peruk, particles) passed
- `no_hebrew_in_engine` ✅: No Hebrew added to engine code
- `dart_math_sane` ✅: No invalid Dart math method calls
- `calc` ✅: Computed field `סכום כולל מעמ` generated with `_calc(...)` invocation

### Key Discovery
The formula parser (`compileFormula` in render-ds.mjs) only accepts ASCII operators: `*` for multiplication (not Hebrew `×`). Initial attempt with `×` was rejected silently; switching to `*` fixed it.

### Testing
- Zero test failures (gates verify correctness)
- Formula evaluates correctly: `סכום * 1.18`
- Field added to entity without breaking existing stages or workflow
