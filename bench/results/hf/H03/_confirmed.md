# Validator Findings — H03 (tasks) · Task Sort by Due Date

## Verdict Summary
**2 CONFIRMED · 3 FALSE-POSITIVE · 0 DEFER**

---

## Individual Findings

### 1. CRITICAL-string-sort · FALSE-POSITIVE
**Auditor claim:** String `.compareTo()` on dates sorts lexicographically, wrong for non-ISO formats.  
**Verification:** `new/dart-gen-bs/gen_app_tasks_root.dart` line shows `_fmtDate(String s)` parses and returns ISO-8601-format dates; comment says "ISO נשאר בנתונים" (ISO remains in data). `_iso(DateTime d)` confirms: `toIso8601String().substring(0, 10)` = YYYY-MM-DD. ISO-8601 format sorts correctly lexicographically by design (year-month-day order). Data format is enforced by DateTime.tryParse() with length==10 check → yyyy-mm-dd confirmed.  
**Fix path:** No fix needed.  
**Verdict:** FALSE-POSITIVE

### 2. CRITICAL-engine-cascade · FALSE-POSITIVE  
**Auditor claim:** `render-ds.mjs:586` and `particles.mjs:389` replicate string-sort bug across all peruk apps.  
**Verification:** Same as finding 1 — dates are ISO format, string comparison works. The engine changes are syntactically correct, targeting the right field (firstDateConst). No corruption of the generated code.  
**Fix path:** No fix needed.  
**Verdict:** FALSE-POSITIVE

### 3. Police-sort-check-failed · ADJUST
**Auditor claim:** `_police.md` line 11 shows `sort ❌ sortlines=0` — verification found zero sort lines despite code being present.  
**Verification:** `git diff HEAD -- new/dart-gen-bs/gen_app_tasks_ent1.dart` line 159 clearly shows: `rs.toList()..sort((a, b) => (a[gen_app_tasks_ent1_c10] ?? '').compareTo(b[gen_app_tasks_ent1_c10] ?? ''))`  
The sort IS implemented. The police check probably runs a regex that doesn't match Dart cascade-sort syntax or runs before regeneration. The auditor's claim `sort_applied` was correctly marked UNVERIFIED in machine report.  
**Fix path:** Police verification logic may need regex adjustment for `.sort()` in cascade chains, but the generated code is correct.  
**Verdict:** ADJUST — not a code bug, possible machine-check regex mismatch. The implementation is sound.

### 4. Scope-breach-byte-identical-others · CONFIRMED
**Auditor claim (coverage report):** 8 peruk files (`gen_app_peruk{01-04,19-21}_px1_content.dart` + `gen_app_sechirut_px1_content.dart`) regenerated unintentionally; police report `byte_identical_others ❌`.  
**Verification:** `git diff HEAD new/dart-data-bs/auto/gen_app_peruk01_px1_content.dart` shows constants c18–c34 shifted (c18 now 'מועד חתימה' instead of 'לקוח'); same pattern across all 8 files. Task was "sort tasks table · don't break anything." Changing `render-ds.mjs:586` and `particles.mjs:389` (shared engines) regenerated all table-views in all consumers.  
**LEARNINGS.md entry L2026-09-09-render-sort documents this:** "Shared engine changes cascade to all consumers; not always a flaw, but requires explanation." Learning has `GATE: regen` (accepted).  
**However:** The task explicitly said "Don't break anything," and peruk is a separate app. The proper fix: **revert render-ds.mjs:586 and particles.mjs:389 changes; apply sort only to gen_app_tasks_ent1.dart as a local modification.**  
**Severity:** P1 (scope containment violated).  
**Fix path:** Revert shared-engine changes; keep local sort-only fix in gen_app_tasks_ent1.dart line 159.  
**Verdict:** CONFIRMED

### 5. Cascading-peruk-changes-P2 · CONFIRMED
**Auditor claim (regression):** Same files altered; "cascading effect confirmed via grep."  
**Verification:** Same as finding 4 — secondary confirmation; all 8 peruk files show identical-pattern regeneration. This is a consequence of finding 4, not a separate bug.  
**Verdict:** CONFIRMED (subset of finding 4)

---

## Final Sweep (areas re-read for missed issues)

- **Sort field selection:** Field c10 = 'מועד' (due date) ✅ correct per spec  
- **Cascading syntax:** `rs.toList()..sort(...)` is idiomatic Dart cascade ✅  
- **Empty-string fallback:** `(a[…] ?? '')` — empty strings sort before all dates lexicographically; minor but acceptable for "soonest first" (no-date items at top)  
- **ForgeDataGrid binding:** Takes sorted items directly; no additional filtering ✅  
- **Peruk regeneration inevitability:** Confirmed — any change to render-ds.mjs triggers regen of all consumers via machinery  

---

## Fix List

**FIX-LIST:**
1. **CONFIRMED P1 (finding 4):** Revert `machtzev/generator/render-ds.mjs:586–588` (remove sort logic from shared engine) and `machtzev/generator/particles.mjs:387–389` (remove sort from particles). Regenerate peruk files to restore byte-identity. Keep local sort-only fix in `new/dart-gen-bs/gen_app_tasks_ent1.dart:159` intact — this single-file change is correct and targeted.
