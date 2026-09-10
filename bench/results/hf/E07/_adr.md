# ADR — Task E07: Add דחופים Counter to peruk21

## Context

The task requires adding a counter named **דחופים** (urgent/priority cases) to the peruk21 case screen that counts cases whose סיווג (classification) is הזמנה לוועדה (committee order/request).

## Opening Question

**Q:** How should a filtered counter be defined in the spec language, and what is the proper naming?

**Assumed Answer (drawn from pattern in peruk01.txt:9):**
The pattern for filtered counters is: `מונה(entity: field=value)`
- Peruk01 uses: `מונה(תיק), מונה(ממצא: צבע=אדום)` 
- For peruk21, this becomes: `מונה(תיק: סיווג=הזמנה לוועדה)`
- The counter label "דחופים" is derived from the filtered condition name
- This integrates into line 8: `לוח בקרה עם מונה(תיק), מונה(תיק: סיווג=הזמנה לוועדה)`

## Decision

Add a second counter to the control board using the existing filtered-counter syntax, mirroring peruk01 structure.

## Rationale

1. **Pattern consistency**: peruk01.txt line 9 shows this exact syntax working for filtered counters
2. **Spec language**: The generator already supports `field=value` filters on entities
3. **No new syntax**: This reuses existing spec language without inventing new constructs
4. **Non-breaking**: Adding a second counter is additive; doesn't change existing counter

## Alternatives Rejected

- Manual code generation: Violates THE-WAY principle (proof = runtime execution, never hand-draw)
- New syntax invention: Would require gate registration; pattern exists already
- Particle definition: Counter is built into spec language, not a particle

## Consequences

1. Control board will render two counters: total cases + urgent cases
2. Generator will automatically extract and label this counter
3. UI will show both counters on the screen

## Verification Plan

1. Byte-verify the spec change
2. Run machine report to confirm no hand-edits in generated outputs
3. Confirm gates pass (no_hebrew_in_engine, dart_math_sane, etc.)
4. Visual check: two counters appear on screen with correct filtering
