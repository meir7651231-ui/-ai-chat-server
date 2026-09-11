# Validation Report — M09 (tasks.txt: תזכורת entity)

## Verified Findings

| ID | Verdict | Evidence | Fix |
|---|---|---|---|
| audit-compile-px1-c7 | **CONFIRMED P1** | new/dart-gen-bs/gen_app_tasks_px1.dart:21: `EmptyState(label: gen_app_tasks_px1_c7)` uses 'ריק אין תזכורות' but spec line 9 requires 'אין תזכורות' (c8) | Change line 21 to `EmptyState(label: gen_app_tasks_px1_c8)` |
| audit-coverage-ent2-c7 | **FALSE-POSITIVE** | new/dart-data-bs/auto/gen_app_tasks_ent2_content.dart:7 has entity-level empty-state 'אין תזכורת עדיין...' but spec only defines particle empty-state 'אין תזכורות'; ent2 is auto-generated per entity pattern (compare: ent1_c7='אין משימה עדיין...'); police report confirms empty-state is data:px1 (particle), not ent2 | No fix needed — spec does not require entity content c7 to match particle text |

## All Police Checks Verified
- ✅ regen_ok: Generator ran correctly with תזכורת entity
- ✅ byte_identical_others: No unintended changes to other apps
- ✅ gates_pass: Cascade deletion (mashimot→tzkzorot policy=1) registered correctly
- ✅ compiles: analyzer 0 errors
- ✅ ent2: 1 entity generated as expected
- ✅ empty: particle empty-state in px1 as expected

## Coverage Assessment

**Entity definition** ✅: three fields (משימה*, מועד*, נשלחה) correctly generated in gen_app_tasks_ent2.dart
**Cascade deletion** ✅: gen_app_tasks_relations.dart registers mashimot→tzkzorot with policy=1 (delete parent → delete children)
**Table screen** ✅: gen_app_tasks_ent2.dart:155 ForgeDataGrid renders three columns; view toggles at line 69
**Required fields** ✅: lines 46-47 validate משימה (idx 0) and מועד (idx 1) before save
**Particle (px1)** ⚠️ ONE DEFECT: line 21 uses wrong constant label; table rendering correct (line 20)

FIX-LIST: gen_app_tasks_px1.dart:21 change `gen_app_tasks_px1_c7` → `gen_app_tasks_px1_c8`
