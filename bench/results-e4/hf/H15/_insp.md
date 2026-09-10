# Inspection — sort-cases-by-deadline (H15)

## Audit lenses

**task-coverage:** Cases sorted by עד מתי (deadline) in two places: entity list (line 7 sort) + particle table (line 10 sort). Both directives active per machine (sort_ent ✅, sort_px ✅). ✅

**money-numeric:** No monetary fields involved in sort; עד מתי is a date field, sorted chronologically. ✅

**edge-crash:** Empty cases list handled by existing `[ריק] אין תיקים עדיין` particle (line 12); sort on empty set is no-op. Cases with missing עד מתי field would sort to end (spec-lang default: null last). ✅

**state-leakage:** Sort is stateless spec directive (no mutable globals, no side effects); re-sorting on entity refresh is idempotent. No app state modified. ✅

**navigation:** Sort affects display order only; navigation paths unchanged (entity detail still accessible from sorted list). No routing logic modified. ✅

**text-parity:** All text in spec is Hebrew; no English hardcoded in engine. Sort field name "עד מתי" matches entity definition exactly. ✅

## VERDICT: GO
- Machine: DONE (all checks ✅)
- Spec syntax correct: `מיון: <field> עולה`
- No breaking changes
- Ready to ship
