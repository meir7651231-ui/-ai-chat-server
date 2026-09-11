# ADR: Sort cases table by key-handover date in peruk02 app

## Context
The task required making the cases table (תיק) in the app generated from machtzev/generator/specs-ds/peruk02.txt sorted by the key-handover date field (תאריך מסירת מפתח), with earliest dates first.

## Decision
Modified the table particle definition in peruk02.txt to add sorting specification using the spec-lang syntax for table sorting.

## Rationale
1. The spec language already supports table sorting via the `[טבלה] | מיון: field direction` syntax (confirmed in SPEC-LANG.md line 17 and particles.mjs)
2. The field תאריך מסירת מפתח exists in the תיק entity definition (line 6 of peruk02.txt)
3. Sorting should be applied at the spec level, not the engine level, to maintain proper layer separation
4. The direction עולה (ascending) means earliest dates appear first, as required

## Alternatives rejected
- Modifying engine code (particles.mjs, app-ds.mjs): Would be layer violation
- Hand-editing generated files: Violates protocol (no_hand_edit check)
- Adding columns specification: Not required; all fields are already included in table

## Consequences
- Changed line 10 of machtzev/generator/specs-ds/peruk02.txt from:
  `חלקיק תיק: [טבלה]`
  to:
  `חלקיק תיק: [טבלה] | מיון: תאריך מסירת מפתח עולה`
- Regenerated app with: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk02.txt --name peruk02 --skin`
- All checks passed (regen_ok, byte_identical_others, no_orphans, gates_pass, no_hebrew_in_engine, dart_math_sane, compiles, sort)

## Verification
- Machine's police-bench.mjs confirms: **VERDICT: DONE**
- Sort check specifically verified: ✅ px1
- Byte-identical check passed for other apps: ✅
- All compilation and gate checks passed: ✅
- No hand-edits in generated files: ✅
- No orphans created: ✅
