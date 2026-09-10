# ✅ VALIDATOR REPORT — H03 (tasks sorting)

## FINDINGS

All checks passed. No defects found.

### Machine Report Status
- regen_ok: ✅
- byte_identical_others: ✅
- no_orphans: ✅
- gates_pass: ✅
- no_hebrew_in_engine: ✅
- dart_math_sane: ✅
- compiles: ✅ (analyzer errors: 0)
- sort gate: ✅ (ent1,px1)

### Audit Coverage
**Coverage Report (AUDIT-REGRESSION):** PASS
- Sorting field selection: ✅ מועד (both screens)
- Sort order: ✅ ascending (soonest first)
- Null safety: ✅ all map lookups guarded with `??`
- Dart correctness: ✅ String.compareTo() and num.compareTo() valid
- Both views using sorted data: ✅
- No unintended breakage: ✅

**Coverage Report (AUDIT-COMPILE):** PASS
- Entity screen (gen_app_tasks_ent1.dart:156): sorts by `gen_app_tasks_ent1_c17` = 'מועד'
- Particle screen (gen_app_tasks_px1.dart:18): sorts by `gen_app_tasks_px1_c5` = 'מועד'
- Comparator logic: empty values last, numeric fallback, lexical string comparison
- Integration: both screens wired in hub, sort applied to sorted collection

**Coverage Report (AUDIT-COVERAGE):** PASS
- Spec updated (tasks.txt only): entity and particle both declare `| מיון: מועד עולה`
- Entity screen handles all 4 views (list, kanban, calendar, table)
- Particle screen sorts table rows
- Home screen sorts by DateTime.due
- No cross-app leakage (byte_identical_others confirmed)

### Byte Evidence Verification
- machtzev/generator/specs-ds/tasks.txt: only changed file (added `| מיון: מועד עולה` to entity and particle)
- gen_app_tasks_ent1.dart:156: sorting applied after filtering, before view rendering
- gen_app_tasks_px1.dart:18: sorting applied via cascade operator on sorted list
- gen_app_tasks_ent1_content.dart:19: `gen_app_tasks_ent1_c17 = 'מועד'` ✓
- gen_app_tasks_px1_content.dart:7: `gen_app_tasks_px1_c5 = 'מועד'` ✓

---

**FIX-LIST: none**
