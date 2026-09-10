# ADR: Add דגל מוגן counter to peruk25 dashboard

## Context
Task: "In machtzev/generator/specs-ds/peruk25.txt add to the dashboard (לוח בקרה) a counter of cases whose סיווג is דגל מוגן. Don't break anything."

Owner not available; opening question answered and documented here.

## Decision
Add a conditional counter to the dashboard spec using the syntax pattern found in other successful apps: `מונה(תיק: סיווג=דגל מוגן)`

## Rationale
1. **Spec-first approach**: Task is to modify a spec file, not generated code. Solution lives in peruk25.txt, not Dart.
2. **Pattern validation**: SPEC-LANG.md line 6 and grep of other apps (panuy.txt, peruk01–09.txt, sechirut.txt) confirm syntax: `מונה(ישות: שדה=ערך)` for conditional counts.
3. **Field exists**: סיווג enum in תיק entity includes דגל מוגן as a valid value (peruk25.txt line 6).
4. **No breaking change**: Spec modification adds a counter to existing dashboard line; doesn't remove or alter other functionality.

## Alternatives Rejected
1. Create a new dashboard screen — task says "add to the dashboard", implying same screen; also would break other functionality.
2. Modify the Dart code directly (bypass spec) — violates protocol layer-1 (FIRST the spec, ONLY touch engine if spec language cannot express it).
3. Create a separate entity/table for statistics — overkill; dashboard counter renders from existing data via appStore.records().where().

## Consequences
- Peruk25 dashboard now shows 2 metrics: total תיק count + count where סיווג=דגל מוגן
- Generated Dart (gen_app_peruk25_scr2.dart, gen_app_peruk25_scr2_content.dart) correctly filters using appStore.records().where((r) => r[סיווג]==דגל מוגן)
- Other 60+ apps remain byte-identical (verified by machine: ✅ byte_identical_others)

## Verification
✅ Spec syntax: peruk25.txt line 7 modified from `לוח בקרה עם מונה(תיק)` to `לוח בקרה עם מונה(תיק), מונה(תיק: סיווג=דגל מוגן)`
✅ Regeneration: app-ds.mjs --name peruk25 succeeded
✅ Machine checks: regen_ok, byte_identical_others, no_orphans, gates_pass, no_hebrew_in_engine, dart_math_sane, dash_counter all PASSED
✅ Generated code: Dart file contains correct filter logic
✅ No hand-edits: Generated files only, via tool
