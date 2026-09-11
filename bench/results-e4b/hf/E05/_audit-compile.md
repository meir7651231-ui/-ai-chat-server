# 🔍 Auditor Report — E05 (calendar) · Edge-Crash & Compile Lens

## Findings

`new/dart-gen-bs/gen_app_calendar_px1.dart:14` · EmptyState renders with prefixed label 'ריק אין פגישות השבוע' instead of task-specified 'אין פגישות השבוע'; code uses gen_app_calendar_px1_c0 (full particle identifier) but should use gen_app_calendar_px1_c1 (label only) · P1 wrong result · Change `EmptyState(label: gen_app_calendar_px1_c0)` to `EmptyState(label: gen_app_calendar_px1_c1)` on line 14.

---

## Coverage: Verified Sound

✅ **Participants field (משתתפים)**: Successfully added to פגישה entity as field c13 in gen_app_calendar_ent1_content.dart; field consistently wired across form (lines 142–148), save logic (line 51), edit handler (line 64), card display (line 92), and CSV export (line 96–101). Type-safe as String with ?? defaults.

✅ **Empty state condition**: Correctly checks `appStore.records('app_calendar_ent1').isEmpty` (safe null-coalescing, proper boolean logic) and renders EmptyState widget only when no meetings exist.

✅ **Compile safety**: All appStore method calls (records, add, update, removeById, stageOf, setStage, advance) type-correct and null-safe. No dart:math methods on unsupported types. String comparisons use proper lexical ordering. Nested parens balanced, all imports present (DsScaffold, ForgeDsField, EmptyState from empty_state.dart). Flutter analyzer reported 0 errors per police.

✅ **Other apps untouched**: Police byte_identical_others gate confirms only calendar files modified; panuy, tasks, peruk*, sechirut apps remain byte-identical.

✅ **Spec-to-code tracing**: Spec line `חלקיק פגישה: [ריק] אין פגישות השבוע` → particle-plan-calendar.json correctly identifies shape="empty", ops=["empty"], wired to EmptyState@premium/feedback. Label extraction (`[shape] text` → text) produced c1='אין פגישות השבוע' correctly, but code instantiation selected c0 instead.
