# Audit Report: Tasks Sorting by Due Date (H03)

## Findings

### 1. CRITICAL: String Comparison Bug for Date Sorting
**File:** `new/dart-gen-bs/gen_app_tasks_ent1.dart:159`  
**Defect:** Table rows sorted lexicographically instead of chronologically. Code: `rs.toList()..sort((a, b) => (a[gen_app_tasks_ent1_c10] ?? '').compareTo(b[gen_app_tasks_ent1_c10] ?? ''))` casts date field to string and uses `.compareTo()` (string comparison). If dates stored as "9.9.2026" or "ביום רביעי" format, sorts wrong. Even ISO "2026-01-15" vs "2026-09-01" sorts reverse (01 > 09 in ASCII). **Severity: P1 (wrong result)** — Fix: Parse dates to DateTime objects or verify ISO-only format + use proper date comparison with DateTime.parse().

### 2. Same Bug Replicated in Render-DS Engine  
**File:** `machtzev/generator/render-ds.mjs:586` (and generated peruk/sechirut files)  
**Defect:** Engine change produces identical lexicographic sort for ALL apps using render-ds. Line: `rs.toList()..sort((a, b) => (a[${firstDateConst}] ?? '').compareTo(b[${firstDateConst}] ?? ''))` applied to peruk01-04, peruk19-21, sechirut apps. **Severity: P1 (wrong result + state-leakage)** — Fix: Same as above, in engine source before cascading to all generated files.

### 3. Equivalent Bug in Particles Engine
**File:** `machtzev/generator/particles.mjs:389`  
**Defect:** Same string-comparison pattern: `${recs}.toList()..sort((a, b) => (a[${k(dateField.label)}] ?? '').compareTo(b[${k(dateField.label)}] ?? ''))` — cascades to particle tables across all apps. **Severity: P1** — Fix: Same DateTime parsing and comparison.

### 4. Police Sort Verification Failed
**File:** `_police.md` line 11  
**Defect:** `sort ❌ sortlines=0` — Sort check failed; verification logic found zero sort lines despite sorting code being present in generated output. May indicate: (a) verification regex doesn't match Dart `.sort()` syntax, or (b) detection ran before generation. **Severity: P1 (task not done per verification)** — Fix: Verify sort gate passes after date comparison fix above.

### 5. State-Leakage: Unintended File Changes
**File:** Police report `byte_identical_others ❌`  
**Defect:** Changes to shared engines (render-ds.mjs, particles.mjs) altered: `gen_app_peruk01_px1_content.dart`, `gen_app_peruk02_px1_content.dart`, `gen_app_peruk03_px1_content.dart`, `gen_app_peruk04_px1_content.dart`, `gen_app_peruk19_px1_content.dart`, `gen_app_peruk20_px1_content.dart`, `gen_app_peruk21_px1_content.dart`, `gen_app_sechirut_px1_content.dart`. Per LEARNINGS.md (L2026-09-09), this is expected for shared engine changes but requires documented justification. LEARNINGS.md was added to explain it, so intent is clear. **Severity: P2 (documented side effect, not a bug)** — Status: Justified by added learning.

## Coverage Verified

✅ **Checked:**
- Generated sort code in `gen_app_tasks_ent1.dart:159` — confirmed string `.compareTo()` on date values
- Engine sources `render-ds.mjs:586` and `particles.mjs:389` — same bug replicated in both
- Cascading effect to peruk01-04, peruk19-21, sechirut apps confirmed via grep
- Police report analysis — `byte_identical_others` and `sort` checks documented
- LEARNINGS.md added to justify state-leakage — learning captured but bug not fixed

❌ **Could not verify:**
- Actual runtime date values format (ISO vs Hebrew natural language) — would determine if string comparison works by accident
- Date parsing library availability in Dart/Flutter context — assumption is DateTime.parse() exists
- Sort gate detection logic — unable to access police-bench.mjs verification code

## Summary

**NOT DONE** — Task asked to sort tasks table by due date; code was added but uses WRONG comparison method (lexicographic string comparison instead of chronological date comparison). Both engine changes and generated code carry this defect. Police also flagged `sort ❌` verification failure. State-leakage to other apps is documented but not resolved.

**Fix required:** Replace string `.compareTo()` with DateTime parsing and comparison in both generator engines before regenerating all affected apps.
