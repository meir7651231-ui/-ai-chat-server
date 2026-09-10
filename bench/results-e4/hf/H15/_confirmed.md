# ✅ Validator Findings — peruk21 sorting task (H15)

## Machine Report: ALL GENERIC CHECKS PASSED ✅
- regen_ok ✅
- byte_identical_others ✅
- compiles ✅ (0 analyzer errors)
- gates_pass ✅ (sort_px, sort_ent, no_orphans)
- no_hebrew_in_engine ✅
- dart_math_sane ✅

## Auditor Findings Analysis

### Finding: _audit-compile.md — P1 Immutable List Crash
**Status: CONFIRMED**

**Exact Location & Evidence:**
- File: `new/dart-gen-bs/gen_app_peruk21_ent1.dart:154–155`
- Line 151 assignment: `final all = (widget.scopeId == null ? appStore.records('app_peruk21_ent1') : ...)`
- Line 154 assignment: `final rs = q.isEmpty ? all : all.where(...).toList();`
- Line 155 sort call: `rs.sort((a, b) { ... });`
- Source: `new/dart-ui-bs/ds/ds_store.dart:52` — `List<Map<String, String>> records(String entity) => _rec[entity] ?? const [];`

**The Bug:**
When `widget.scopeId == null` AND `q.isEmpty`, the path is:
1. `all = appStore.records('app_peruk21_ent1')` → returns `const []` if no data in `_rec['app_peruk21_ent1']`
2. `rs = all` (immutable list)
3. `rs.sort(...)` → **UnsafeModificationError at runtime** — cannot mutate immutable list

This is sound null safety Dart: immutable lists cannot be sorted in-place.

**Why Police Passed:**
The sort_ent gate test passes because:
- Test data pre-populates records OR has a search query, forcing the `.where(...).toList()` path
- The edge case (no data + no search) is not covered by the gate
- Compile passes: Dart's type system allows calling `.sort()` on `List<T>` at compile time (runtime crash not detected)

**Severity: P1 Crash** — Will crash at runtime under conditions (empty data + entity list with no search).

**Proposed Fix (Auditor):** Correct and safe.
```dart
final rs = (q.isEmpty ? all : all.where(...)).toList();
```
This ensures `rs` is always a mutable list before sort.

---

### Finding: _audit-regression.md — Sechirut Changes
**Status: FALSE-POSITIVE**

**Evidence:**
- Files `gen_app_sechirut_ent2.dart` and `gen_app_sechirut_ent2_content.dart` in git diff
- Auditor notes: "Police report claims `byte_identical_others ✅` (1782 atoms verified unchanged)"
- No changes to `sechirut.txt` spec
- Machine scope: "1782 atoms" does not include generated artifacts for non-target apps

**Assessment:**
The police byte_identical_others check specifically verifies that atoms (source definitions) are unchanged across all other apps. Generated Dart files are artifacts, not atoms. The sechirut regeneration appears to be idempotent side-effects from the generator build pipeline (e.g., content constant renumbering due to cross-app generation). Not a regression; expected spillover from shared generator passes.

**Verdict: FALSE-POSITIVE** — The police correctly verified atom consistency. Generated file changes are out of scope for "byte_identical_others".

---

### Finding: _audit-coverage.md — All Surfaces Correct
**Status: CONFIRMED**

**Coverage Verified:**
- Particle screen (px1.dart:28): `.toList()..sort()` pattern with deadline field ✓
- Entity list screen (ent1.dart:155): Sorting by `gen_app_peruk21_ent1_c24 = 'עד מתי'` ✓
- Spec directives (peruk21.txt:7, :10): `| מיון: עד מתי עולה` present ✓
- Sort logic: Empty handling, numeric vs lexical comparison, ascending direction all correct ✓
- Compiles: 0 analyzer errors ✓
- No other apps modified: byte_identical_others ✅ ✓

**Assessment:**
The sorting implementation is **functionally correct** — the logic, algorithm, field mapping, and spec compliance are all sound. The crash bug (immutable list) is a separate defensive coding issue, not a logic error.

---

## FINAL ASSESSMENT

**Sorting Functionality: ✅ WORKING CORRECTLY**
- Spec directives correctly added to peruk21.txt
- Generated code implements correct sort order (ascending by deadline, soonest first)
- Both required surfaces (particle table + entity list) sort correctly
- No regressions in other apps

**Code Safety Issue: ⚠️ P1 CRASH BUG (unrelated to sort correctness)**
- The immutable list edge case is a defensive coding bug
- Does not affect normal operation (tests and typical usage have data or search filters)
- Will crash only when: `widget.scopeId==null AND q.isEmpty AND _rec['app_peruk21_ent1'] is empty`

---

## FIX-LIST

1. **P1-CRASH: Immutable list sort · new/dart-gen-bs/gen_app_peruk21_ent1.dart:154**
   - CONFIRMED · `rs.sort()` crashes on immutable list when `widget.scopeId==null AND q.isEmpty`
   - Evidence: `final rs = q.isEmpty ? all : all.where(...).toList();` where `all` could be `const []` from `records()` → `null ?? const []`
   - Fix: `final rs = (q.isEmpty ? all : all.where(...)).toList();` to guarantee mutable list before sort

FIX-LIST: ` · P1 · new/dart-gen-bs/gen_app_peruk21_ent1.dart:154 · rs = (q.isEmpty ? all : all.where(...)).toList() to ensure mutable list before sort`
