# ✔️ VALIDATOR REPORT — E15 (tasks computed field)

## Machine Checks (all ✅)
- regen_ok ✅
- byte_identical_others ✅  
- compiles ✅ (0 analyzer errors)
- dart_math_sane ✅
- no_hebrew_in_engine ✅
- gates_pass ✅

**No failed generic checks → no automatic P0 findings.**

## Auditor Finding Verification

### Finding: Dead Constants c16 & c17
**Location:** `new/dart-data-bs/auto/gen_app_tasks_ent1_content.dart:18-19`

**Verification:**
- c16 = 'סכום' (line 18) — defined but never referenced
- c17 = '' (line 19) — defined but never referenced  
- Grep confirms: zero references across entire codebase (`new/` directory)
- Duplicates c11 ('סכום'); c17 is empty string artifact

**Root Cause:** Generator produced extra constants during computed field parsing. Builder correctly updated spec only (no hand-edits); generator created these as side effect.

**Impact:** Code-cleanliness P2; no functional impact. Removing these constants breaks nothing (confirmed by reference scan).

**Verdict:** CONFIRMED  
**Fix:** Delete lines 18-19 in `new/dart-data-bs/auto/gen_app_tasks_ent1_content.dart`  
**Safety:** ✅ (zero references; removing is safe)

## Spec & Implementation Verified

✅ **Spec (machtzev/generator/specs-ds/tasks.txt:6):**  
   `סכום כולל מעמ = סכום * 1.18` — correct syntax per SPEC-LANG.md

✅ **Dart Formula (gen_app_tasks_ent1.dart:51, 160):**  
   `(num.tryParse(_v[2] ?? '') ?? 0) * 1.18`
   - Null-safe: `num?` coalesced to `num`
   - No misuse of dart:math (no `.sqrt()`, `.min()`, `.max()` on num)
   - Formatted correctly: `.toStringAsFixed(2)`
   - Type inference: `num * double` → `num` ✓

✅ **Integration:**
   - Field included in card view (line 92)
   - Exported to CSV (line 98)
   - Displayed as read-only calculated field (line 160)
   - Loaded on edit (line 63)

✅ **Spec-only change verified:**  
   - Builder edited only `machtzev/generator/specs-ds/tasks.txt`
   - No hand-edits to generated files (police: no_hand_edit ✅)

## FINAL SWEEP

Checked:
- Constant indexing: c9–c15 used; c0–c8 used for metadata/stages ✓
- Field count: spec shows 5 fields (מה, מועד, סכום, סכום כולל מעמ, הערה) ✓
- Computed field placement: between סכום (c11) and הערה (c13) ✓
- Cross-app side effects: gen_app_balagan_moments, gen_app_sechirut renumbered as expected ✓

---

## FIX-LIST

**dead-const-c16-c17:** CONFIRMED · P2 code-cleanliness · `new/dart-data-bs/auto/gen_app_tasks_ent1_content.dart:18–19` ("const String gen_app_tasks_ent1_c16 = 'סכום';", "const String gen_app_tasks_ent1_c17 = '';") · Delete both lines — unused constants, safe removal, zero references confirmed

**FIX-LIST:** dead-const-c16-c17
