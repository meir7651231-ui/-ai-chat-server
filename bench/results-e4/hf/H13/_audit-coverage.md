# Audit Coverage: Table Columns Filtering (Task H13)

## Findings

### P0: Table shows all 14 columns instead of specified 4 columns
**File:** `new/dart-gen-bs/gen_app_panuy_ent1.dart:187`
**Defect:** The ForgeDataGrid widget displays all 14 entity fields instead of filtering to the 4 specified table columns (שם, זמין, מרחק בקמ, מחיר לשעה).
**Failure Scenario:** User opens entity list table view → sees all 14 columns (שם, זמין, קו רוחב, קו אורך, קו רוחב שלי, קו אורך שלי, מחיר לשעה, שעות, הפרש רוחב, הפרש אורך, מרחק בריבוע, מרחק בקמ, יש נקודה, מחיר לשעתיים) instead of only 4 (שם, זמין, מרחק בקמ, מחיר לשעה).
**Expected:** `ForgeDataGrid(bare: true, columns: const [gen_app_panuy_ent1_c9, gen_app_panuy_ent1_c10, gen_app_panuy_ent1_c25, gen_app_panuy_ent1_c19], items: ...)`
**Actual:** `ForgeDataGrid(bare: true, columns: const [gen_app_panuy_ent1_c9, gen_app_panuy_ent1_c10, gen_app_panuy_ent1_c13, gen_app_panuy_ent1_c14, gen_app_panuy_ent1_c15, gen_app_panuy_ent1_c17, gen_app_panuy_ent1_c19, gen_app_panuy_ent1_c20, gen_app_panuy_ent1_c22, gen_app_panuy_ent1_c23, gen_app_panuy_ent1_c24, gen_app_panuy_ent1_c25, gen_app_panuy_ent1_c26, gen_app_panuy_ent1_c27], items: ...)`
**Fix:** Filter the columns list in render-ds.mjs or app-ds.mjs to respect the `[טבלה]` particle syntax and pass only selected columns to ForgeDataGrid.

### P1: CSV export also includes all columns instead of filtered 4
**File:** `new/dart-gen-bs/gen_app_panuy_ent1.dart:96-102`
**Defect:** The `_csv()` function exports all 14 columns to CSV instead of just the 4 table columns.
**Expected:** CSV header and rows should contain only: שם, זמין, מרחק בקמ, מחיר לשעה
**Actual:** CSV contains all 14 columns.
**Fix:** Filter the CSV export to match the displayed table columns.

### P1: Entity list card view also shows unnecessary fields
**File:** `new/dart-gen-bs/gen_app_panuy_ent1.dart:89-92`
**Defect:** The DsRecordCard displays all 14 labels/values in card view, not just the table columns.
**Note:** This may be intentional for card/list view, but should verify if card view should also be restricted to table columns.

## Coverage Verified

✓ **Spec file correctly parsed:** `machtzev/generator/specs-ds/panuy.txt:6` correctly specifies `[טבלה] שם, זמין, מרחק בקמ, מחיר לשעה`

✓ **Particle plan correctly generated:** `machtzev/generator/particle-plan-panuy.json:5` correctly shows particle with expr: `"[טבלה] שם, זמין, מרחק בקמ, מחיר לשעה"`

✓ **Column mappings verified:** 
- c9 = שם
- c10 = זמין  
- c19 = מחיר לשעה
- c25 = מרחק בקמ

✗ **TASK NOT COMPLETE:** The specification was parsed but NOT implemented in the generated Dart code. The render-ds.mjs or app-ds.mjs generator does not filter the schema to respect the `[טבלה]` particle's column list. All 14 entity fields are still rendered instead of just the 4 specified columns.

## Summary

The task requires specifying table columns in the spec file (done ✓) AND filtering the generated Dart code to respect those columns (NOT done ✗). The particle parser correctly identified and stored the column specification in the plan, but the code generation phase did not use this specification to filter ForgeDataGrid.columns, _csv headers, or DsRecordCard labels. This breaks the task requirement.
