# Audit Coverage — M09 (tasks.txt: תזכורת entity)

## Findings

new/dart-data-bs/auto/gen_app_tasks_ent2_content.dart:7 · empty-state text mismatch: spec requires "אין תזכורות" but generated code has "אין תזכורת עדיין — הרשומה הראשונה תופיע כאן" (gen_app_tasks_ent2_c7) · P1 wrong result · regenerate with correct particle text to match spec line 9

## Coverage Verified

✅ **Entity definition** — spec correctly defines תזכורת with three fields:
  - משימה* (required link to משימה entity) at index 0
  - מועד* (required date) at index 1
  - נשלחה (yes/no, optional) at index 2

✅ **Cascade deletion** — gen_app_tasks_relations.dart:6 registers cascade with policy=1 (`s.registerRelation('app_tasks_ent2', gen_app_tasks_relations_c0, 'app_tasks_ent1', 1, multi: false)`)

✅ **Table screen** — gen_app_tasks_ent2.dart line 155 implements ForgeDataGrid with all three columns, view toggles exist (line 69 shows "☰ רשימה · 📅 לוח-שנה · ▦ טבלה")

✅ **Required fields validated** — line 46-47 checks משימה (index 0) and מועד (index 1) as required before save

✅ **Scope/cascading delete mechanics** — line 150 filters by scopeId correctly, line 92 calls removeById which triggers cascade

✅ **Police report** — all checks pass including ent2=1× (two particles generated) and empty=data:px1

❌ **Cannot verify**: deletion actually cascades at runtime (no Dart VM available to test), exact rendering of empty state display (uses generated atom EmptyState@premium/feedback, not DsEmpty directly as visible in particle plan)

**Summary**: 4 of 5 surfaces covered correctly (entity, cascade, table, validation). Empty-state text is the sole defect—spec-driven generation read the particle text wrong ("אין תזכורות" was present in source but different default was used in content output).
