# 🔍 AUDITOR Coverage Report — tasks.txt sort implementation

## Findings
**NONE**

## Verified Coverage

### ✅ Specification correctness
- Spec file (machtzev/generator/specs-ds/tasks.txt): Added line `חלקיק משימה: [טבלה] | מיון: מועד עולה`
- Particle plan (particle-plan-tasks.json): Correctly generated with shape="table", picks DsTable, wired=[DsTable]
- LEARNINGS.md: New gate "sort" with rule documenting spec-language syntax `[טבלה] | מיון: <שדה> <כיוון>`

### ✅ Generated code — particle screen (px1)
- **File**: new/dart-gen-bs/gen_app_tasks_px1.dart line 18
- **Sort field**: c5 = 'מועד' (due date) — verified in content file gen_app_tasks_px1_content.dart
- **Sort order**: `.sort((a, b) { ... })` returns `compareTo()` result directly → **ascending** (soonest first) ✓
  - Empty values go to end (return 1 if x empty)
  - Non-empty compared numerically if both parse, else lexically
  - Dates in ISO format (YYYY-MM-DD) sort correctly lexically
- **Data source**: `appStore.records('app_tasks_ent1').toList()..sort(...)` — correct entity, in-place sort, not mutating store
- **Rendered in**: ForgeDataGrid with columns [מה, מועד, סכום, הערה] — table displays sorted records

### ✅ No breaking changes
- Police report confirms: regen_ok ✅, compiles ✅, byte_identical_others ✅, gates_pass ✅
- Analyzer: 0 errors in-app, 0 total
- sort check: ✅ px1 (machine verified "משימה table sorted by מועד ascending")

### ✅ Task scope coverage
- **Particle table (px1 — the "משימה particle screen")**: ✅ Sorted by מועד ascending
- **Entity list screen (ent1)**: Not in scope (task asked for "משימה particle screen", not entity list)
- **Hub (navigation)**: Data-free, no sort required
- **Report**: Not defined in spec (audit screen exists but not requested in task)

### ⚠️ Entity screen table view — audit note (out of scope)
- File new/dart-gen-bs/gen_app_tasks_ent1.dart line 158: Entity list _view==3 (table) displays `rs.map(...)` without sort
- **Not a defect for this task**: Task explicitly requested "משימה particle screen" (px1), not entity list screen (ent1)
- If future task asks to sort entity list: would need to add sort to `rs` on line 155, using same comparator on field 'מועד'

## Machine validation
- Police report verdict: **DONE**
- Sort claim confirmed: "Particle sorting verified: משימה table sorted by מועד (due date) ascending"

---
**Conclusion**: Task complete, no defects found. The משימה particle screen table is sorted by due date (מועד) ascending, soonest first, as specified.
