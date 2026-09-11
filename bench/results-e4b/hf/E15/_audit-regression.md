# 🔍 Audit Report — E15 (tasks computed field)

## Findings
No defects found.

## Coverage Verification

**What was checked (and holds up):**
- **Spec change**: tasks.txt correctly adds `סכום כולל מעמ = סכום * 1.18` to משימה entity (line 6)
- **Dart formula implementation**: Line 51 (save) and line 160 (display) both correctly compute `(num.tryParse(_v[2] ?? '') ?? 0) * 1.18`
- **Null safety**: Uses `num.tryParse()` with `?? 0` fallback; `.toStringAsFixed(2)` is valid method on `num` in Dart sound null safety
- **Field integration**: `gen_app_tasks_ent1_c12` correctly defined as label constant 'סכום כולל מעמ' in content.dart
- **Schema registration**: apps.json shows field with type "num", required=false (correct for computed field)
- **Display correctness**: Computed field rendered read-only via `_calc()` helper on line 160; not exposed as input field
- **Save correctness**: Formula recalculates from `_v[2]` (סכום) on every save, not reusing stored value; field index 3 in `_v` loaded but unused (acceptable for computed field)
- **Cascading updates**: Balagan aggregator module properly updated to include new field in metadata (`['סכום', 'סכום כולל מעמ']` list) and BalaganField array
- **No regressions**: Other app specs (calendar.txt, sechirut.txt, balagan.txt) unchanged; other app generated code modified only via cascading metadata (sechirut constant reindexing, balagan field list expansion — both expected)
- **No orphans**: git status shows only M (modified) entries, no new gen_app_tasks_*.dart files beyond those in new/dart-gen-bs/
- **Engine integrity**: ship.mjs quarantined per protocol (exits with message, not corrupted); machine (police-bench) is sole authorized runner
- **Police gates**: All 8 checks passed per `./_police.md`: regen_ok, byte_identical_others, no_orphans, gates_pass, no_hebrew_in_engine, dart_math_sane, compiles, calc (consts=1, calc=1)

**What could not be checked:**
- Runtime behavior at scale (data storage/retrieval with 1000+ records); formula performance; rounding edge cases in display vs. export vs. storage
- Field scoping by computed field (סכום כולל מעמ in scopeField via initial:); system may gracefully handle or reject — not tested
- CSV export display format (formula value shown as formatted string with .toStringAsFixed(2); old records load stale computed values into `_v[3]` but don't display)

**Verdict:** Task completed correctly. No compile breaks, no state leakage, no regressions.
