# ADR: Sort Cases by Deadline in peruk21

## Context
The peruk21 app displays legal case records (תיקים) in two places:
1. **Entity list screen** (ent1.dart) — main interface showing all cases
2. **Particle table** (px1.dart) — tabular view of cases

Cases have a deadline field (`עד מתי`) representing when action must be taken. Currently, cases are unsorted, making it harder for users to prioritize by urgency.

## Decision
Use the spec language sorting syntax to sort cases by deadline ascending (soonest first) in both display contexts.

**Implementation:**
- Entity definition (line 7): Added `| מיון: עד מתי עולה` to entity specification
- Particle definition (line 10): Added `| מיון: עד מתי עולה` to table particle specification

## Rationale
1. **Spec-first approach:** Sorting expressed in spec language (not engine logic) keeps the generator clean and the decision transparent in the specification
2. **Consistency:** Both display contexts use identical sorting logic (ascending by deadline)
3. **Correctness:** The sorting syntax handles:
   - Date field parsing (ISO 8601 format)
   - Empty values (sorted last)
   - Numeric comparison (dates sortable as date objects)
4. **No side effects:** Only peruk21 app is modified; all other apps verified byte-identical
5. **Machine-verified:** Task-specific gates (sort_px, sort_ent) confirm sorting applied correctly

## Alternatives Rejected
1. **Manual Dart edits in generated files** — Would violate protocol (no hand-edits to generated code) and break byte-identity verification
2. **Engine modification** — Unnecessary complexity; spec language already supports sorting
3. **Single sort point** — Could have added sorting only to entity, but spec syntax allows both particle and entity level, improving clarity

## Consequences
- Cases now display in urgency order (deadline) across all views
- Users see most urgent cases first
- No performance impact (sorting at render time, small dataset)
- Fully tested and verified by machine gates

## Verification
✅ Machine verdict: DONE (all checks pass)
✅ Task-specific gates: sort_px ✅, sort_ent ✅
✅ Dart compilation: 0 errors
✅ Other apps: byte-identical
