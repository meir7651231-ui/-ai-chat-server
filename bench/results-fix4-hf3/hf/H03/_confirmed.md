# ✅ Validator Report — H03 (tasks table sort by מועד)

## Findings (Severity Ranked)

### P0 — ORPHAN FILES (automatic per RULE: no_orphans ❌ in _police.md)

**CONFIRMED** · _police.md:7-15 · `no_orphans | ❌` · Delete all orphan generated content files not corresponding to specs (calendar, panuy, peruk01-28, sechirut, tasks)

Evidence: _police.md machine report lists as orphans: `gen_app_audit_content.dart`, `gen_app_bind4_content.dart`, `gen_app_ent1_content.dart`, `gen_app_ent2_content.dart`, `gen_app_ent3_content.dart`, `gen_app_ent4_content.dart` and more (~6+). These files have no corresponding spec in machtzev/generator/specs-ds/*.txt.

Fix: Delete all orphan files from `new/dart-data-bs/auto/` that don't match app names (gen_app_calendar_*, gen_app_panuy_*, gen_app_peruk0[1-9]*, gen_app_peruk[12][0-9]*, gen_app_sechirut_*, gen_app_tasks_*).

---

### P1 — DUPLICATE PARTICLE DEFINITION

**CONFIRMED** · machtzev/generator/specs-ds/tasks.txt:7-8 · `+חלקיק משימה: [טבלה] | מיון: מועד עולה` (line 7) and `+חלקיק משימה: [טבלה] | מיון: מועד עולה` (line 8) are identical

Evidence: git diff HEAD shows both new lines are character-for-character identical. spec parsing will register two particle definitions instead of one, causing generator to emit duplicate screen code. Line 8 is unintended duplication.

Fix: Delete line 8 from tasks.txt (the duplicate particle spec).

---

### P1 — DUPLICATE TABLES IN GENERATED CODE

**CONFIRMED** · new/dart-gen-bs/gen_app_tasks_px1.dart:19-20 · Two `ForgeDataGrid` widgets with sort logic for `מועד` field rendered on same screen

Evidence: Lines 19-20 both render `ForgeDataGrid(bare: true, columns: [...], items: [...sort((a,b) { ... c5 or c15 ... })...]). Both grids bind to `appStore.records('app_tasks_ent1')`, apply sort by מועד field (c5 and c15 respectively), ascending order. Tasks table will render twice.

Root cause: duplicate particle definition in spec (line 8, above). Regenerating the app after deleting duplicate particle will eliminate both tables from code.

Fix: Delete duplicate particle from spec (step above); regenerate app. Do NOT hand-edit generated file.

---

## Verified Correct ✅

- **Sort logic**: Null-safe field extraction with `?? ''`, num.tryParse() correctly checked for null, valid `.compareTo()` method calls on both num and String types — all Dart semantics sound
- **Sort order**: Ascending (empty values last, then numeric/lexical ascending) — matches "מיון: מועד עולה" requirement (ascending by due date)
- **Soonest first**: Sort direction is ascending; soonest date will appear first ✅
- **Compilation**: _police.md shows `compiles | ✅` (analyzer errors total=0)
- **Generator success**: _police.md shows `regen_ok | ✅` (generator ran without error)
- **Hebrew confinement**: _police.md shows `no_hebrew_in_engine | ✅` (Hebrew only in spec, not in generated code)
- **Dart math**: _police.md shows `dart_math_sane | ✅` (no invalid Dart math calls)

---

## False-Positives / Not Applicable

- **ship.mjs quarantine**: Not a bug. Task protocol intentionally quarantines ship.mjs for validator role. Quarantine message states "only pipeline you may run is the machine" — this is correct per task design.
- **no_hand_edit (info) ❌**: Expected. Adding particle definition to spec requires editing tasks.txt. Info-level flag is expected for this task type (not a blocking error).

---

## Summary

**Status: NOT DONE — 2 blockers before landing**

The sort logic is correct and compile-safe. However, two critical issues prevent shipping:

1. **Orphan files**: Delete generated content files with no spec backing
2. **Duplicate particle + tables**: Delete line 8 of tasks.txt, regenerate

Once fixed and verified clean by machine, the app will render a single task table, sorted by due date (מועד) ascending, soonest first.

---

**FIX-LIST:**

1. P0-ORPHANS: Delete orphan content files from new/dart-data-bs/auto/ (gen_app_audit_content.dart, gen_app_bind4_content.dart, gen_app_ent1_content.dart, gen_app_ent2_content.dart, gen_app_ent3_content.dart, gen_app_ent4_content.dart, and others with no spec)
2. P1-DUPLICATE-PARTICLE: Delete line 8 from machtzev/generator/specs-ds/tasks.txt ("חלקיק משימה: [טבלה] | מיון: מועד עולה")
3. P1-DUPLICATE-TABLES: Regenerate app from cleaned spec; do not hand-edit generated code
