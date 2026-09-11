# Task Coverage Audit — H09 (סכום מעוגל)

## Findings
No defects found.

## Coverage Summary

✅ **Entity List Screen (gen_app_tasks_ent1.dart)**
- Form display: Line 161 shows calculated field via `_calc()` widget (read-only, no input)
- Card view: Line 93 includes `gen_app_tasks_ent1_c12` in DsRecordCard labels & values
- Data grid (table): Line 174 includes field in ForgeDataGrid columns & items
- CSV export: Lines 99, 101 include field in header and rows

✅ **Computation Logic (gen_app_tasks_ent1.dart)**
- Helper function: Line 18 defines `num _m_round(num x) => x.round()`
- Save formula: Line 52 calculates `(_m_round( (num.tryParse(_v[2] ?? '') ?? 0) )).toStringAsFixed(2)` (סכום = index 2, correct)
- Edit load: Line 64 reads field from stored record into form state
- Validation: Field marked as required=false (correct for computed field)

✅ **Report/Root Screen (gen_app_tasks_root.dart)**
- Detail display: Includes conditional rendering `if ((r0[gen_app_tasks_root_c23] ?? '').trim().isNotEmpty) KvLine(label: gen_app_tasks_root_c12, value: _fmtNum(...))`
- Constants mapped: gen_app_tasks_root_c12/c13/c23 = 'סכום מעוגל'

✅ **Home/Hub (gen_app_tasks_home.dart)**
- Numeric fields registry: Line 21 lists `gen_app_tasks_home_c6 = 'סכום מעוגל'` in `_nums` array
- Used for money display calculation in DsTodayItem rendering

✅ **Field Registry (gen_app_tasks_home_content.dart, gen_app_tasks_root_content.dart, gen_app_tasks_ent1_content.dart)**
- All three screen content files properly define field label as string constant

✅ **Machine Checks**
- `regen_ok`, `byte_identical_others`, `no_orphans`, `gates_pass` all ✅
- `calc` check: ✅ consts=1 calc=1 (field properly segregated as calculated, not input)
- `round` check: ✅ 1× (exactly one round() function reference, correct)
- `compiles` check: ✅ (no analyzer errors)

**All task surfaces covered**: entity list screen ✓ | particle table ✓ | hub ✓ | report ✓

Field is properly read-only (no text input widget), automatically computed on every save from source field סכום (index 2), and displayed across all views. Formula is mathematically sound: `num.tryParse()` → nullable num, default 0, `.round()` returns int, `.toStringAsFixed(2)` formats safely.
