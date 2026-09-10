# 🔍 Auditor Report — E04 (tasks stage addition)

## Findings

new/dart-gen-bs/gen_app_tasks_ent1.dart:92 · `stageDone` condition inverts completion state for "done" (נעשה) tasks · P1 wrong result · change `>= 2` to `>= 1` to mark both "נעשה" (done) and "בוטל" (cancelled) as terminal states

## Details

**Issue**: Generator changed `stageDone` condition from `>= 1` (2-stage system) to `>= 2` (3-stage system):
- **OLD (2 stages)**: `stageDone: appStore.stageOf(...) >= 1` — marks stage 1 "נעשה" (done) as complete
- **NEW (3 stages)**: `stageDone: appStore.stageOf(...) >= 2` — marks ONLY stage 2 "בוטל" (cancelled) as complete

**Consequence**: Tasks in stage 1 "נעשה" are no longer visually marked as complete. The `stageDone` flag feeds `DsChip(..., tone: stageDone ? 1 : 0)` (ds.dart), so tasks shift from tone 1 (done styling) to tone 0 (open styling) when moved from "done" to "done" (stays there but appearance regresses).

**Root cause**: Generator pattern `stageDone: appStore.stageOf(...) >= ${stages.length - 1}` (render-ds.mjs) assumes only the final stage is "done". With stages [פתוח, נעשה, בוטל], this treats "בוטל" as the lone terminal state, ignoring that "נעשה" is also terminal (work is complete).

**Semantic model break**: Original spec: "open" vs "done". New spec should be: "open" vs ["done" OR "cancelled"]. Both נעשה and בוטל are terminal; both should yield `stageDone=true` for visual uniformity.

---

## Coverage

✅ **Checked**:
- Stage constant declarations (gen_app_tasks_ent1_content.dart): c13=פתוח, c14=נעשה, c15=בוטל — correct
- Canvas board logic (line 156): kanban columns correctly clamp stageOf to [0, 2], no overflow
- Old vs new code diff: confirmed stageDone changed from >= 1 to >= 2
- DsChip usage: verified stageDone controls visual tone (done vs open)
- Compilation: passed (flutter analyze 0 errors) — no syntax issue
- Stages array cardinality: 3 stages correctly indexed

❌ **Not checked** (Flutter/Dart not installed):
- Runtime behavior of DsChip tone rendering (tone 0 vs 1 actual visual output)
- appStore.advance(rid, 3) behavior with 3 stages (machine verified compiles; pattern is consistent with old code)

---

**Verdict**: One P1 logic defect identified. Code compiles but produces wrong behavior: "done" tasks lose visual "done" marker.
