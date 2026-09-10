# 🔍 VALIDATOR REPORT — H04 (calendar sorting)

## Findings

**P0-SCOPE-BREACH** · CONFIRMED · machtzev/generator/render-ds.mjs:583-596 global sort injection affects 9 unrelated apps (peruk01-04, peruk19-21, sechirut, tasks) — `new/dart-gen-bs/gen_app_{peruk01,peruk02,peruk03,peruk04,peruk19,peruk20,peruk21,sechirut,tasks}_ent1.dart` all contain `.sort(` injections not present in baseline · Task requires "Don't break anything"; this breaks byte_identical_others gate and violates scope constraint · **FIX: Revert render-ds.mjs changes and implement calendar-only sorting via slug guard** `if (slug === 'app_calendar') { ... applySort ... }`

**P1-FILE-IO-VIOLATION** · CONFIRMED · machtzev/generator/render-ds.mjs:11,18 adds `import fs0` and `const SL = JSON.parse(fs0.readFileSync('./spec-lang.data.json', 'utf8'))` — duplicates spec-lang loading already present in entity schema parameter · violates read-only rendering contract · **FIX: Remove fs0 import and SL const; pass SL through existing entity schema or load once at module level if needed (check how spec-lang is used elsewhere)**

**P1-POLICE-PATTERN-GAP** · ADJUST · ./_police.md shows `sort_both ❌ sortlines=0` but sorting code IS present at new/dart-gen-bs/gen_app_calendar_ent1.dart:159 — pattern likely scans render-ds.mjs template for DsTable branch, not ForgeDataGrid path · **FIX: Check pattern must scan generated outputs, not template; if pattern is in render-ds.mjs, extend it to match ForgeDataGrid codegen path** (not a code bug, a test pattern gap)

**P0-DART-CORRECT** · FALSE-POSITIVE · new/dart-gen-bs/gen_app_calendar_ent1.dart:159 sorting syntax is Dart-sound: `rs.toList()..sort((a, b) { final d = (a[gen_app_calendar_ent1_c10] ?? '').compareTo(b[gen_app_calendar_ent1_c10] ?? ''); if (d != 0) return d; return (a[gen_app_calendar_ent1_c11] ?? '').compareTo(b[gen_app_calendar_ent1_c11] ?? ''); })` — null coalescing `?? ''` safe, `.compareTo(String)` valid, comparator returns -1/0/+1 correctly, `.toList()` creates copy, `.sort()` mutates in-place, lexical sort correct for ISO-8601 dates and HH:MM times · Code is compile-safe and logically sound

---

## VERDICT

**BLOCKED — 2 confirmed process violations + 1 test pattern gap must be fixed before ship:**

1. **Revert render-ds.mjs changes (lines 9-15, 584-596)** — scope breach affecting 9 unrelated apps
2. **Remove unnecessary fs0 file I/O (lines 11, 18)** — violates generator design
3. **Update sort_both gate pattern** to match ForgeDataGrid codegen (test pattern issue, not code)

**Then re-generate calendar only** (not global) and **re-run police checks**.

Calendar sorting Dart code is correct; the problem is process scope and unnecessary global mutation.

---

FIX-LIST: P0-SCOPE-BREACH, P1-FILE-IO-VIOLATION, P1-POLICE-PATTERN-GAP
