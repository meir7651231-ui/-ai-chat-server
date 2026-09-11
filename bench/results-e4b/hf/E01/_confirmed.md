# 🔒 Validator Report — E01 (sechirut email field)

## Findings Verification

### P1: Orphaned Panuy App Files (Out-of-Scope Regeneration)
**Verdict:** CONFIRMED

**Byte Evidence:**
- `git status --short | grep panuy`: 28 untracked files (gen_app_panuy_*.dart, gen_app_panuy_*_content.dart, panuy.json, panuy.txt, particle-plan-panuy.json/md)
- `_plan.md:20`: "Must regenerate app with --name flag to avoid orphan files"
- Builder did not use `--name sechirut` flag; full generator ran and created panuy app

**Failure Path:**
Task scope: sechirut-only → Builder executed full generator → panuy app auto-generated as NEW UNTRACKED FILES

**Impact:** Scope creep; state contains files not part of task definition. Machine checks pass (byte_identical_others checks only tracked files; no_orphans likely checks data layer, not git status).

**Fix:** `git clean -fd new/dart-gen-bs/gen_app_panuy* new/dart-data-bs/auto/gen_app_panuy* machtzev/generator/apps/panuy.json machtzev/generator/specs-ds/panuy.txt machtzev/generator/particle-plan-panuy*`

---

## Email Field Implementation — VERIFIED CORRECT ✓

**Spec to Generated Code Traceability:**

1. **Spec modification** (`machtzev/generator/specs-ds/sechirut.txt`):
   - ✅ Line 7: אימייל field added to תיק entity between טלפון and עיר

2. **App schema** (`machtzev/generator/apps/sechirut.json`):
   - ✅ Lines 54–59: Email field object with type:'text', required:false

3. **Content constants** (`new/dart-data-bs/auto/gen_app_sechirut_ent1_content.dart`):
   - ✅ Line 13: `const String gen_app_sechirut_ent1_c11 = 'אימייל';`

4. **Form rendering** (`new/dart-gen-bs/gen_app_sechirut_ent1.dart`):
   - ✅ Line 32: c11 added to _labelsAll at index 2
   - ✅ Line 53: Email stored in save map as _v[2]
   - ✅ Line 65: Email loaded in _edit() from r[c11] → _v[2]
   - ✅ Line 196: ForgeDsField renders email at _v[2] with label c11

5. **Table display**:
   - ✅ Line 106: Email in DsRecordCard labels (c11)
   - ✅ Line 119: Email in CSV export labels
   - ✅ Line 219: Email column in ForgeDataGrid

6. **Dart soundness**:
   - ✅ Null coalescing: `_v[2] ?? ''` (String?→String)
   - ✅ No invalid dart:math calls (no sqrt/min/max on num)
   - ✅ Calculations: `toStringAsFixed(2)` on num results (lines 205–207)

7. **Machine verification**:
   - ✅ `email_in_ent ✅ 1×`: Field in entity ✓
   - ✅ `email_in_table ✅ 2×`: Header + data rows ✓
   - ✅ `compiles ✅`: Flutter analyze 0 errors ✓
   - ✅ `byte_identical_others ✅`: Unrelated apps unchanged ✓

---

## No Other Findings

- ✅ Compile audit: No defects (edge-crash & type-safety verified)
- ✅ Coverage audit: All surfaces verified; task implementation complete per spec
- ✅ Machine gates: regen_ok, gates_pass, dart_math_sane, no_hebrew_in_engine all ✅

---

## Summary

| Finding | Verdict | Severity | Fix |
|---------|---------|----------|-----|
| Panuy app files untracked (out-of-scope regeneration) | CONFIRMED | P1 | `git clean -fd` orphans per plan violation |

**Email field task:** ✅ Correctly implemented (form, table, constants, Dart correctness verified).

**Machine report alignment:** Accurate on email field and other checks; does not detect untracked file scope creep (by design — only tracks committed state).

**Status:** Task technical scope met, but build state includes out-of-scope files. Cleanup required before commit.

---

FIX-LIST:
1. P1 · CONFIRMED · git status | grep panuy: 28 untracked files (gen_app_panuy_*.dart×13, gen_app_panuy_*_content.dart×12, panuy.json, panuy.txt, particle-plan-panuy.json/md) · Builder regenerated full spec set instead of sechirut-only; plan line 20 requires --name flag. Fix: `git clean -fd new/dart-gen-bs/gen_app_panuy* new/dart-data-bs/auto/gen_app_panuy* machtzev/generator/apps/panuy.json machtzev/generator/specs-ds/panuy.txt machtzev/generator/particle-plan-panuy*`
