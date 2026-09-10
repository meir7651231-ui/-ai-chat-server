# 🔍 Audit Coverage: סכום מעוגל (Rounded Amount) Computed Field

## Findings
No findings. Task is complete and correct.

## Coverage Verified

✅ **Spec Parsing (machtzev/generator/specs-ds/tasks.txt:6)**
- Field defined: `סכום מעוגל = round(סכום)` — correct syntax
- Parsed into apps/tasks.json with type "num" and required=false

✅ **Computed Field Definition (new/dart-gen-bs/gen_app_tasks_ent1.dart:18)**
- Wrapper function defined: `num _m_round(num x) => x.round();`
- Dart `.round()` method valid on `num` type (per protocol)
- Return type `num` correctly captures `int` result of `.round()`

✅ **Entity Screen — Form Display (gen_app_tasks_ent1.dart:162)**
- Computed field rendered as read-only `_calc` widget (not editable)
- Calculates on-the-fly from source field: `_m_round((num.tryParse(_v[2] ?? '') ?? 0))`
- Displays with `.toStringAsFixed(2)` for num formatting

✅ **Entity Screen — List View / Card Display (gen_app_tasks_ent1.dart:91–94)**
- Field included in _labelsAll (index 4)
- Included in DsRecordCard labels and values
- Card properly displays all 5 fields including סכום מעוגל

✅ **Entity Screen — Table View (gen_app_tasks_ent1.dart:174)**
- ForgeDataGrid columns include field: `const [gen_app_tasks_ent1_c9, ..., gen_app_tasks_ent1_c13]`
- Table rendering passes values from all records

✅ **Entity Screen — CSV Export (gen_app_tasks_ent1.dart:97–104)**
- CSV header includes field (line 99)
- CSV rows include field value (line 101)
- Export covers all fields with quote-escaping

✅ **Storage & Update Logic (gen_app_tasks_ent1.dart:52)**
- Save computes field once: `gen_app_tasks_ent1_c13: (_m_round(...)).toStringAsFixed(2)`
- Always recalculates from source (סכום), ignoring user input to _v[4]
- Correctly implements computed field semantics (read-only, derived)

✅ **Root Page / Report (new/dart-gen-bs/gen_app_tasks_root.dart:28)**
- Field included in KvLine display: `if ((r0[gen_app_tasks_root_c24] ?? '').trim().isNotEmpty) KvLine(label: gen_app_tasks_root_c16, value: _fmtNum(r0[gen_app_tasks_root_c17] ?? ''))`
- Report shows 5 fields: `const String gen_app_tasks_root_c25 = 'פרטים (5)';`
- Formatting applied via `_fmtNum` (adds thousand separators)

✅ **Content Labels (new/dart-data-bs/auto/gen_app_tasks_ent1_content.dart:15)**
- Field label correct: `const String gen_app_tasks_ent1_c13 = 'סכום מעוגל';`
- Summary updated: `gen_app_tasks_ent1_c1 = '5 שדות · 2 שלבים'` (was 4 fields)

✅ **Type Correctness**
- `num.tryParse()` returns `num?`, correctly null-coalesced to `0`
- `x.round()` on `num` is valid (methods: .round(), .abs(), .toStringAsFixed() per protocol)
- `int.toStringAsFixed(2)` is valid (inherited from num)

✅ **No Breaking Changes**
- Police: byte_identical_others ✅
- Police: compiles (0 analyzer errors) ✅
- Police: gates_pass ✅

## Task Coverage Trace
- ✅ Spec changed: field added with `= round(סכום)` syntax
- ✅ Generator ran: regen_ok confirmed
- ✅ Entity list screen: cards (4 views), CSV, table all display field
- ✅ Particle table: ForgeDataGrid shows field in columns
- ✅ Hub: navigation only, no field display needed
- ✅ Report (root page): KvLine displays field with formatting
- ✅ Computed semantics: field recalculated on save, read-only in UI
- ✅ Dart validation: round() method exists on num; no imports needed (dart:core)

**Result: TASK COMPLETE — All surfaces covered, no defects found, machine report agrees.**
