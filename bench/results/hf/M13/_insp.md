# INSP Audit — M13: Add [מספר] particle to peruk12

## Task Coverage
✅ **entity list** — ישות תיק includes new field אגרת העברה in entity definition (line 7)
✅ **particle table** — חלקיק תיק includes new [מספר] particle (line 16) in case screen
✅ **hub** — N/A (peruk12 has single entity-based spec, no hub needed)
✅ **report** — N/A (task did not require adding report, only particle)

## Numeric Validations
✅ **money-numeric** — אגרת העברה is a number field for transfer document costs, appropriate domain
✅ **edge-crash** — [מספר] particle has required help text; field added to entity, not left dangling

## State & Navigation  
✅ **state-leakage** — New field isolated to תיק entity, no cross-entity contamination
✅ **navigation** — Particle added to case screen where it displays; no screen/routing changes

## Text & Integrity
✅ **text-parity** — Hebrew text exactly as specified: "אגרת העברת בעלות משולמת לפני הרישום"
✅ **no hand-edits in generated** — Only machtzev/generator/specs-ds/peruk12.txt modified; all new/ files machine-generated

## Final Verdict
### VERDICT: GO
- All checks pass (regen_ok, gates_pass, byte_identical_others, no_hebrew_in_engine, dart_math_sane)
- Task requirement met: [מספר] particle named אגרת העברה added to case screen with correct text
- No breaking changes: entity field added in correct location, particle properly wired
- Machine report confirms: DONE ✅
