# Inspection Checklist — Task E04 (Add בוטל stage to משימה)

## Coverage verification
- ✅ **task-coverage:** Spec file (tasks.txt) contains משימה entity with 3 stages (פתוח, נעשה, בוטל)
- ✅ **entity list:** apps/tasks.json correctly reflects new stage in "stages" array
- ✅ **generation:** BreadcrumbTrail and stage widgets auto-indexed for 3-stage workflow
- ✅ **atom index:** stage_cancel gate confirms 1× cancelled stage was added

## Data verification
- ✅ **money-numeric:** Task entity has סכום field (num type); addition of stage doesn't affect numeric integrity
- ✅ **text-parity:** בוטל (cancelled) is Hebrew text matching spec source

## Workflow verification
- ✅ **navigation:** 3-stage progression (פתוח → נעשה, or פתוח → בוטל) is logically sound
- ✅ **state-leakage:** No shared state issues; stages are data-driven, engine is generic

## Cross-app impact
- ⚠️ **other-apps:** gen_balagan_moments.dart and gen_balagan_topics.dart were regenerated
  - These files are part of balagan app (not tasks app)
  - Regeneration expected because balagan aggregates across all modules
  - Byte_identical_others check failed due to these changes
  - Investigation needed: are balagan files supposed to change on tasks spec update?

## Machine gates
- ✅ regen_ok — pipeline completed successfully
- ✅ gates_pass — all gates passed
- ✅ stage_cancel — 1× cancelled stage detected and indexed
- ❌ byte_identical_others — files outside tasks app changed (balagan app)
- ✅ no_hebrew_in_engine — spec parser handled בוטל correctly

## VERDICT: CONDITIONAL GO
- **Task completion:** YES — stage was successfully added and indexed
- **Test status:** FAILED — byte_identical_others check failed
- **Root cause:** balagan app files regenerated when tasks spec changed
- **Resolution needed:** Understand if balagan regeneration is expected behavior or error
