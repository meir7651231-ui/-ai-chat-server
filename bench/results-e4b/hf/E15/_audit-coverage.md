# 🔍 Audit Coverage Report — E15 (tasks computed field)

## Findings
No defects found.

## Coverage Verified

**Spec layer (tasks.txt)**: ✅
- Computed field `סכום כולל מעמ = סכום * 1.18` correctly defined in ישות משימה line
- Proper formula syntax recognized by parser

**Generated schema (apps/tasks.json)**: ✅  
- Field "סכום כולל מעמ" present in root.fields array as num type (line 52-55)
- Required: false (correct for computed field)
- Field ordering: after סכום (c11), before הערה (c13)

**Entity form (gen_app_tasks_ent1.dart)**: ✅
- Display: Line 160 renders `_calc(gen_app_tasks_ent1_c12, (num.tryParse(_v[2] ?? '') ?? 0) * 1.18)`
- Calculation: Formula recalculates reactively from current סכום value
- Read-only: `_calc()` method creates display-only widget (no input field)
- Save: Line 51 stores computed value with `.toStringAsFixed(2)` formatting
- Edit load: Line 63 loads stored value into _v[3] (not edited, just preserved)

**List/card view (gen_app_tasks_ent1.dart)**: ✅
- Line 92: DsRecordCard includes c12 in both labels and values arrays
- Displays stored computed value alongside other fields

**Table view (gen_app_tasks_ent1.dart)**: ✅
- Line 173: ForgeDataGrid columns explicitly include gen_app_tasks_ent1_c12 (סכום כולל מעמ)
- Items mapped to include field value from records

**CSV export (gen_app_tasks_ent1.dart)**: ✅
- Line 98: Header row includes gen_app_tasks_ent1_c12
- Lines 99-101: Record rows include c12 values

**Content/labels (gen_app_tasks_ent1_content.dart)**: ✅
- Line 14: `const String gen_app_tasks_ent1_c12 = 'סכום כולל מעמ'` correctly set
- Line 3: Field count updated to "5 שדות · 2 שלבים" (reflects 5 fields: מה, מועד, סכום, סכום כולל מעמ, הערה)

**Dart code safety**: ✅
- Formula uses safe operators: `num.tryParse()` returns `num?`, null coalesces to 0, `* 1.18` valid, `.toStringAsFixed(2)` valid method
- No invalid methods like `.sqrt()` on num type
- Police `dart_math_sane` gate: ✅

**Compilation**: ✅
- Police `compiles` gate: ✅ (0 analyzer errors)
- No broken imports or type errors in generated code

**Computed field registration**: ✅
- Police `calc` gate: ✅ `consts=1 calc=1` (field registered as computed, not constant)
- Counter verification: machine confirms סכום כולל מעמ is a calc field

**Side effects**: ✅
- Police `byte_identical_others` gate: ✅ (no unintended changes to other apps)
- LEARNINGS.md: Learning entry L107 added, documents computed field methodology

**No orphans or invalid state**: ✅
- Police `no_orphans` gate: ✅
- Police `gates_pass` gate: ✅ (all 53 gates pass)

## Summary
All surfaces covered. Computed field `סכום כולל מעמ = סכום * 1.18` fully integrated:
- Visible in form (read-only), card list, table view, CSV export
- Calculates correctly: parses סכום, multiplies by 1.18, formats to 2 decimals
- Stored after save, loaded on edit, recomputed on סכום change
- No side effects, no compilation errors, gate verifications all pass

**VERDICT: Implementation complete and correct. No issues.**
