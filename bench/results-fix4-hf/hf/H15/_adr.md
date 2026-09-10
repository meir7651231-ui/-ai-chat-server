# ADR — Sort cases by deadline (עד מתי)

## Context
The app generated from `peruk21.txt` displays cases (תיק) in two screens:
1. Particle screen (table of cases)
2. Entity list screen (main cases list)

Cases have a deadline field "עד מתי" (when is the deadline). Currently they are displayed in the order they were created. Users need them sorted by deadline (soonest first).

## Opening Question (per ג.1)

**מה:** Sort cases by deadline field "עד מתי" (soonest first) in two locations
**מקור:** peruk21.txt lines 1–7 define the case entity with "עד מתי" as a field; the generated app is created from `node machtzev/generator/app-ds.mjs --name peruk21 -f machtzev/generator/specs-ds/peruk21.txt`
**תרגום ל-dial:** Not a dial. This is a **sorting operation on data display** — cases are presented as lists in existing screens. No new UI window/screen/bottom-sheet needed. The sort happens in the data layer (helper function) that feeds the UI.
**helper נדרש:** `sortCasesByDeadline(cases: List<Case>) → List<Case>` — pure function that sorts by "עד מתי" field in ascending date order
**מחרוזות verbatim:** None new (sorting is logic-only)
**חסום:** None identified

## Assumed Answer
1. This is a **data sorting task**, not a UI layout task.
2. No R2 violations — existing screens remain unchanged.
3. Implementation:
   - Create a pure `sortCasesByDeadline` helper in `logic/` with unit tests (FND-07, FND-08)
   - Inject this helper into the two display locations (particle screen + entity list)
   - Verify both locations sort identically
4. No state changes, no new providers, no schema changes — only data transformation on display.

## Verification Strategy
- Grep for where cases are rendered/listed in the generated code
- Add sorting logic to data providers or UI builders that fetch cases
- Unit test the sorting helper
- Visual check that both screens sort soonest-first
