# 🔍 Auditor Coverage Report — תקרה מחייבת (H07 sechirut)

## Verified Correct (All checks passed)

**Computed Field Implementation — SOUND:**
- new/dart-gen-bs/gen_app_sechirut_ent2.dart:9 · `import 'dart:math';` correctly present (required for max/min/sqrt top-level functions, not methods)
- new/dart-gen-bs/gen_app_sechirut_ent2.dart:30 · _labelsAll correctly includes gen_app_sechirut_ent2_c24 at index 8 (field struct updated for new field)
- new/dart-gen-bs/gen_app_sechirut_ent2.dart:51 · _save() stores תקרה מחייבת with safe formula: `max((num.tryParse(_v[6]) ?? 0), (num.tryParse(_v[7]) ?? 0)).toStringAsFixed(2)` — uses safe parsing and currency formatting ✓
- new/dart-gen-bs/gen_app_sechirut_ent2.dart:63 · _edit() retrieves stored value correctly: `8: r[gen_app_sechirut_ent2_c24] ?? ''`
- new/dart-gen-bs/gen_app_sechirut_ent2.dart:92 · List card view displays field with values array including stored תקרה מחייבת
- new/dart-gen-bs/gen_app_sechirut_ent2.dart:97–98 · CSV export includes field in headers and data rows
- new/dart-gen-bs/gen_app_sechirut_ent2.dart:179 · UI display renders as _calc() (read-only computed field): `_calc(gen_app_sechirut_ent2_c24, max((num.tryParse(_v[6] ?? '') ?? 0), (num.tryParse(_v[7] ?? '') ?? 0)))`
- new/dart-gen-bs/gen_app_sechirut_ent2.dart:191 · Table grid view includes field in columns and computed values in items
- new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart:26 · Label constant added: `gen_app_sechirut_ent2_c24 = 'תקרה מחייבת'`
- new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart:1 (subtitle) · Field count updated from '10 שדות' to '11 שדות' to reflect new field

**No Regressions:**
- Other entities (ent1 תיק, ent3 ממצא, ent4 תשלום) byte-identical to previous versions · `byte_identical_others` ✅
- dart:math usage confirmed correct · `dart_math_sane` ✅ — max() is top-level function, not method
- Compilation successful with zero errors · `compiles` ✅ · `analyzer errors = 0`
- All gates pass · `gates_pass` ✅

**Machine Report Verdict:**
- calc ✅ (consts=1 calc=1 — one label constant, one computed arithmetic field)
- max ✅ (calc=true fn=true alt=false method=false — uses calculated field, top-level max function, not method)
- regen_ok ✅ · no_orphans ✅ · no_hebrew_in_engine ✅ · no_hand_edit ✅ · VERDICT: **DONE** ✓

**Coverage Verified:**
- Entity screen: form displays computed field as read-only ✓
- List view: card shows field and computed value ✓
- Table/grid view: field appears in columns and row values ✓
- CSV export: field in headers and cell values ✓
- Logic: formula correctly uses both input fields with safe parsing ✓
- No manual edits in generated code ✓
- All regenerated files are auto-generated verbatim from spec ✓

## No Findings

The builder correctly implemented the task: added תקרה מחייבת as a computed field = max(תקרה לפי 3 חודשים, תקרה לפי שליש) with safe parsing, currency formatting, and correct wiring across all surfaces (form, list, table, CSV, logic). All machine checks pass. No regressions in other entities or apps. Zero compile errors.
