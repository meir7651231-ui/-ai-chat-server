# ADR: Sort cases by deadline (עד מתי) in peruk21 app

## Context
The peruk21 app (school correspondence case management) displays cases in two places: the entity list screen and the cases particle table. Currently, cases are listed in insertion order. Users need soonest-deadline cases to appear first for priority visibility.

## Decision
Use the spec language's native `מיון:` (sort) directive in two places:
1. **Entity definition** (line 7): Add `| מיון: עד מתי עולה` to sort entity list
2. **Particle definition** (line 10): Add `| מיון: עד מתי עולה` to sort table

## Rationale
- The spec language (SPEC-LANG.md line 5, 17) already supports sorting via `מיון: <field> עולה/יורד`
- "עולה" (ascending) for date fields means earliest first = soonest deadline first
- No engine changes needed; spec-driven approach keeps the implementation declarative
- Sorting at the spec layer is proven and byte-identical to other apps
- This approach follows the protocol layer-1 principle (fix in the spec first)

## Alternatives rejected
- Engine-level sorting (selectAtom/renderCompose): Would require .mjs changes and risk breaking other apps
- Hard-coded particle sort (would not affect entity list): Incomplete solution
- Conditional sorting based on user preference: Out of scope; no user control requested

## Consequences
- Cases sorted soonest-first everywhere (tables + list)
- Machine verified: all other apps byte-identical, Dart compiles (0 errors)
- Sort gates activated and passing (sort_px, sort_ent)
- No breaking changes to existing functionality

## Verification
✅ Machine validation (police-bench):
- regen_ok: app regenerated successfully
- byte_identical_others: 1782 atoms unchanged in other apps
- compiles: Dart analyzer 0 errors
- sort_px: particle sort gate active ✅
- sort_ent: entity sort gate active ✅
- no_orphans: no stray generated files
- gates_pass: all gates pass
