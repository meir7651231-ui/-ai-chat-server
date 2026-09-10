# ✓ Validator Report — M09 (tasks) — תזכורת (Reminder) Entity

## Findings

**AUDIT-001** · **CONFIRMED** · Empty state widget uses particle shape description instead of message text · `new/dart-gen-bs/gen_app_tasks_px1.dart:21` — Line reads `EmptyState(label: gen_app_tasks_px1_c7)` where c7='ריק אין תזכורות' (full DSL with shape marker [ריק]), should use c8='אין תזכורות' (clean message from spec) · Change to `EmptyState(label: gen_app_tasks_px1_c8)`

## Verification Summary

✅ **Entity تزکورت (ent2) generation**  
- Spec declares correct fields: משימה* (required link), מועד* (required date), נשלחה{כן|לא}
- Entity ent2 content file (gen_app_tasks_ent2_content.dart) defines all three field labels
- Entity screen form has DsSelect (משימה), DsDateField (מועד), DsEnumField (נשלחה)
- Validation on lines 46-47 enforces both required fields

✅ **Cascade deletion**  
- Spec declares `מחיקה: משימה=מפל` (cascade on משימה field)
- Relations file registers relation with mode=1 (cascade): `s.registerRelation('app_tasks_ent2', 'משימה', 'app_tasks_ent1', 1, multi: false)`
- Entity delete handler calls `appStore.removeById('app_tasks_ent2', rid)` on line 92
- Cascade semantics enforced by AppStore framework

✅ **Particle wiring**  
- Particle plan (particle-plan-tasks.json) declares both shapes correctly:
  - [טבלה] → DsTable
  - [ריק] אין תזכורות → EmptyState@premium/feedback
- Both particles wired successfully (ok:true for both entries)
- Content constants c7–c8 properly exported

✅ **Null safety & field access**  
- All Map field accesses use coalesce: `r[field] ?? ''` on lines 19–20 (table cells), 46–47 (validation), 51 (record map)
- Date/enum inputs use coalesce: `_v[1] ?? ''`, `_v[2] ?? ''` on lines 143–144
- Link display uses coalesce: `appStore.displayOf('app_tasks_ent1', r[field] ?? '')` on line 92

✅ **Scope isolation**  
- Police report confirms `byte_identical_others ✅` — changes confined to tasks app
- git status shows only tasks-related files modified; no spillover to other apps

❌ **Single defect**  
- Line 21 of gen_app_tasks_px1.dart wires the wrong constant to EmptyState.label
- Rationale: Generator correctly extracted both c7 (full DSL for documentation) and c8 (message for display), but wired c7 by mistake
- Symptom: When reminders table is empty, screen displays "ריק אין תזכורות" instead of "אין תזכורות"
- Impact: User-facing text defect (wrong label shown), but no data corruption or runtime crash

---

## Dart Compliance Notes

- Sound null safety: all accesses guarded ✓
- No calls to `dart:math` functions (sqrt/min/max/pow on num) ✓
- All imports present and correct (EmptyState, DsTable, ForgeDataGrid, etc.) ✓
- Widget tree well-formed; AnimatedBuilder/ListenableBuilder pattern correct ✓

---

FIX-LIST: AUDIT-001
