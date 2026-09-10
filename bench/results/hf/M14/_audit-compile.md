# 🔍 AUDITOR REPORT · panuy (stages) · edge-crash + compile lens

## Findings

new/dart-gen-bs/gen_app_panuy_ent1.dart:91 · Unsafe array access: `(const [...stages])[appStore.stageOf(...)]` lacks bounds check — if stageOf returns ≥3, crashes RangeError. The Kanban board (line 188) uses `.clamp(0, kS.length - 1)` defensively; line 91 should too · **P0 compile-break** · Fix: `(...)[appStore.stageOf('app_panuy_ent1', rid).clamp(0, 2)]`

## Coverage

✅ **Verified correct:**
- Stage labels defined in content file (gen_app_panuy_ent1_c32='פנוי', c33='הוזמן', c34='בוצע')
- Stage array length matches Dart indices [0..2]: 3 elements
- Stage added to spec syntax: "| שלבים פנוי, הוזמן, בוצע" on line 4 of panuy.txt
- Stage wiring in entity screen: onStage handlers, stageDone comparisons, DsWorkflow, Kanban board stage logic
- All num.tryParse calls proper null-coalescing with ?? 0
- String field editing maintains null-safety with ?? ''
- No introduction of undefined methods (sqrt handled separately via boqLineAmount external function)
- No Hebrew in generated code engine (spec-only change)

❌ **Not checked:**
- boqLineAmount function implementation (external import)
- appStore interface contract (stageOf return type bounds)
- Calculated field sqrt('מרחק בקמ') — missing calculation (pre-existing, not caused by stage addition)

## Verdict

Stage addition complete and working. **ONE defect found:** line 91 array access needs bounds clamping to match defensive pattern used 97 lines later in Kanban board. Critical edge case: if appStore.stageOf ever returns 3+ (e.g., corruption, multi-user race), app crashes mid-render.

