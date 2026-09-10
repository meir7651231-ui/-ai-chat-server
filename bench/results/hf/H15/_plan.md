# Plan: Sort Cases by Deadline (עד מתי) in peruk21 App

## Goal
Sort cases by deadline (עד מתי) soonest first in both the cases table particle and entity list screen of the peruk21 app, without breaking any functionality.

## 10-Step Decomposition

1. **Search existing code** — Use search-record.mjs to find where tables and entity lists are rendered in the generator
2. **Identify peruk21 generation** — Locate the specific generator code that processes peruk21.txt spec
3. **Find table rendering** — Locate where "חלקיק תיק: [טבלה]" is handled
4. **Find entity list rendering** — Locate where entity list screen is generated
5. **Understand current sort** — Check if any current sorting is applied, what field is used
6. **Identify deadline field** — Confirm the "עד מתי" field exists and how it's represented
7. **Implement table sort** — Add sorting logic to table particle generation (soonest first)
8. **Implement list sort** — Add sorting logic to entity list generation (soonest first)
9. **Verify no hand-edits** — Ensure all changes are in engine/.mjs files, not in new/ generated output
10. **Run machine report** — Execute police-bench.mjs to validate the changes

## Success Criteria
- Cases sorted by deadline (soonest first) in both locations
- No hand-edits in generated outputs
- Machine report shows DONE
- All gates pass
