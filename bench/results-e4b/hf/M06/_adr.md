# ADR-M06 — Computed Field קרוב (Close/Far)

## Context
The panuy (פנויים לידי עכשיו) application displays available people and their distance. 
Currently, distance is shown as a raw numeric value (מרחק בקמ = sqrt(מרחק בריבוע)).
Users would benefit from a human-readable categorization: "קרוב" (close) vs "רחוק" (far).

## Decision
Add a computed text field קרוב to the person (אדם) entity that categorizes distance as:
- "קרוב" when מרחק בריבוע < 100
- "רחוק" otherwise

## Rationale
1. **Spec Language Expressibility:** SPEC-LANG.md explicitly documents conditional fields (שדה מותנה) with the example: `קרוב = מרחק בריבוע < 100 ? קרוב : רחוק`. This is the intended mechanism.
2. **No Breaking Changes:** Field is computed from existing data (מרחק בריבוע); does not modify entity structure or other apps.
3. **Minimal Surface:** Task specifies only the entity definition; particles (UI display) left for future decision.
4. **Machine Verification:** All 8 generated code checks pass; Dart compilation successful; byte-identical output for other applications.

## Alternatives Rejected
1. **Add to particles immediately:** Would constitute UI change beyond minimal scope; task says "add to entity" not "display in UI"
2. **Use different threshold:** Task explicitly specifies < 100; no flexibility warranted
3. **Use different text values:** Task explicitly specifies "קרוב" and "רחוק"; verbatim compliance

## Consequences
- Field is automatically available in entity definition (מרחק בריבוע < 100 ? קרוב : רחוק)
- Particles system can reference it if needed in future work
- No performance impact (computed field, no storage cost)

## Verification
Machine police-bench.mjs confirms:
- regen_ok: Generator processed field successfully
- compiles: Dart code valid (0 errors)
- byte_identical_others: No cross-app impact
- All 8 checks pass → VERDICT: DONE
