# Task Audit: Add Third Stage בוטל (Cancelled) to משימה Entity

## Summary
Task completed successfully. The new third stage `בוטל` (cancelled) has been properly integrated across all surfaces.

## Coverage Verification

### Entity Definition & Screen (gen_app_tasks_ent1.dart)
✅ **Line 32, gen_app_tasks_ent1_content.dart**: Three stage constants properly defined
   - c13='פתוח', c14='נעשה', c15='בוטל'

✅ **Line 92, gen_app_tasks_ent1.dart**: DsRecordCard stage display
   - `stages: const [gen_app_tasks_ent1_c13, gen_app_tasks_ent1_c14, gen_app_tasks_ent1_c15]`
   - `stageDone: appStore.stageOf('app_tasks_ent1', rid) >= 2` — בוטל (stage 2) marks as done

✅ **Line 135**: DsWorkflow steps display
   - `DsWorkflow(steps: const [gen_app_tasks_ent1_c13, gen_app_tasks_ent1_c14, gen_app_tasks_ent1_c15])`

✅ **Line 156**: Kanban board (3 columns)
   - `final kS = const [gen_app_tasks_ent1_c13, gen_app_tasks_ent1_c14, gen_app_tasks_ent1_c15]`
   - Column movement logic: forward (i+1) and backward (i-1) preserved, with boundary checks

### Home/Today Screen (gen_app_tasks_home.dart)
✅ **Lines 5-7, gen_app_tasks_home_content.dart**: Three stage labels
   - c3='פתוח', c4='נעשה', c5='בוטל'

✅ **Line 44**: `open()` function filters correctly
   - `appStore.stageOf('app_tasks_ent1', r[AppStore.idKey] ?? '') < 2` — stages 0,1 are open

✅ **Line 186**: `done()` function identifies finished tasks
   - `appStore.stageOf('app_tasks_ent1', r[AppStore.idKey] ?? '') >= 2` — stage 2 is done

✅ **Line 189**: Card subtitle stage display
   - `const [gen_app_tasks_home_c3, gen_app_tasks_home_c4, gen_app_tasks_home_c5][...clamp(0, 2)]`

### Root/Detail Screen (gen_app_tasks_root.dart)
✅ **Lines 34-38, gen_app_tasks_root_content.dart**: Three stage labels
   - c34='פתוח', c35='נעשה', c36='בוטל'

✅ **Line 27**: Subtitle stage display
   - `const [gen_app_tasks_root_c34, gen_app_tasks_root_c35, gen_app_tasks_root_c36][...clamp(0, 2)]`

✅ **Line 30**: "סגור תיק" button correctly moves to stage 2
   - `appStore.update('app_tasks_ent1', id, {AppStore.stageKey: '2'})`

### Hub Navigation (gen_app_tasks_hub.dart)
✅ **Line 6, gen_app_tasks_hub_content.dart**: Stage count updated
   - `'4 שדות · 3 שלבים'` (4 fields · 3 stages)

### Specification Files
✅ **machtzev/generator/specs-ds/tasks.txt, line 6**:
   - `שלבים: פתוח, נעשה, בוטל`

✅ **machtzev/generator/apps/tasks.json, lines 28-32**:
   - Three stages in `"stages"` array

## Machine Verification
All police checks passed (from ./_police.md):
- ✅ regen_ok: Entity regenerated successfully
- ✅ byte_identical_others: Other spec-ds apps (calendar, panuy, peruk*, sechirut) unchanged
- ✅ no_orphans: No orphaned generated files
- ✅ gates_pass: stage_cancel gate confirmed 1×
- ✅ compiles: 0 analyzer errors
- ✅ no_hand_edit: Only tasks.txt modified; no manual Dart edits
- ✅ stage_cancel: New stage בוטל detected and validated

## Verified Correct
**All four required surfaces covered:**

1. **Entity list screen**: Displays three stages in list view, board view (Kanban with 3 columns), calendar view, and table view
2. **Particle table**: Kanban board correctly partitions records into 3 columns by stage
3. **Hub**: Navigation header shows "3 שלבים"
4. **Report/Detail screen**: Root screen displays all three stages, "סגור תיק" moves to בוטל

Stage logic is sound: stages 0–1 (פתוח, נעשה) are "open", stage 2 (בוטל) is "done". Advancement, backward movement, filtering, and display all respect the three-stage model. No breaking changes to other apps detected.

## No Findings
