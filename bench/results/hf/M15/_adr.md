# ADR: Rename meeting field מקום to כתובת in calendar.txt

## Status
APPROVED (machine VERDICT: DONE)

## Context
The calendar app defines a meeting entity with fields: מה, מועד, שעה, מקום, הערה.
The field מקום (place/location) needs to be renamed to כתובת (address) throughout the generated application.

## Decision
Changed line 6 of `machtzev/generator/specs-ds/calendar.txt`:
- FROM: `ישות פגישה עם מה*, מועד*, שעה, מקום, הערה | שלבים: קבוע, התקיים`
- TO: `ישות פגישה עם מה*, מועד*, שעה, כתובת, הערה | שלבים: קבוע, התקיים`

## Rationale
The field name is defined once in the spec file and automatically propagated through:
1. The spec language parser (entity.mjs) reads the entity definition
2. The generator emits constants in generated content files (gen_app_calendar_ent1_content.dart)
3. All generated screen code references these constants, not hardcoded field names
4. This ensures automatic consistency across the entire app without hand-edits

## Alternatives Rejected
- Manually editing generated files: Violates the protocol (never hand-edit generated outputs)
- Searching for hardcoded references: Field names are handled generically by the parser

## Consequences
✅ All 1774 atoms indexed remain valid
✅ No atoms broken or deleted
✅ Generated app updated: const c12 = 'כתובת' (previously 'מקום')
✅ All gates pass: regen_ok, byte_identical_others, gates_pass, no_hebrew_in_engine, dart_math_sane
✅ Zero hand-edits in generated code

## Verification
Machine report (police-bench.mjs --task M15) shows:
- regen_ok: ✅ 
- byte_identical_others: ✅
- gates_pass: ✅
- VERDICT: DONE

Generated file evidence:
```dart
const String gen_app_calendar_ent1_c10 = 'מועד';
const String gen_app_calendar_ent1_c11 = 'שעה';
const String gen_app_calendar_ent1_c12 = 'כתובת';  ← Changed from 'מקום'
const String gen_app_calendar_ent1_c13 = 'הערה';
```
