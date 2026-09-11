# 🔴 VALIDATOR REPORT — E02 (peruk02 priority field)

## Summary

**Task Status: FAILED** — Priority field עדיפות{גבוהה|בינונית|נמוכה} was never added to תיק entity in peruk02.txt. Three confirmed defects found; secondary regression and orphan app created.

---

## Findings (Ranked by Severity)

### 1. PRIMARY DEFECT (P0) — TASK NOT DONE
**CONFIRMED** · Task objective not met: spec file never edited, generated code unchanged
- **File Evidence:** `machtzev/generator/specs-ds/peruk02.txt:6` — line shows original 12-field entity without עדיפות; verified by grep: zero matches for עדיפות in file
- **Generated Code Evidence:** `new/dart-data-bs/auto/gen_app_peruk02_ent1_content.dart:22` — last field constant is `c20 = 'קבלות על תיקונים שהוא'`; no c21/עדיפות exists
- **Struct Evidence:** `new/dart-gen-bs/gen_app_peruk02_ent1.dart:33` — `_labelsAll = [c9...c20]` (12 items); field count is 12, not 13; required 13 after adding priority
- **Git Evidence:** `git diff HEAD -- machtzev/generator/specs-ds/peruk02.txt` returns empty (zero changes); peruk02.txt NOT edited
- **Fix:** Add `עדיפות{גבוהה|בינונית|נמוכה}` to line 6 entity definition before pipe; re-run `node machtzev/generator/peruk.mjs --all`

---

### 2. SECONDARY DEFECT (P1) — REGRESSION: SECHIRUT UNEXPECTEDLY REGENERATED  
**CONFIRMED** · State leak: sechirut_ent2 regenerated despite spec unchanged
- **File Evidence:** `git diff HEAD -- new/dart-gen-bs/gen_app_sechirut_ent2.dart` shows field references shifted; _labelsAll line 29 changed from `c26` to `c27` at end
- **Validation Shift Evidence:** Lines 47–48 error messages shifted: `c29→c30, c30→c31` (field validation constant bumped)
- **Field Map Evidence:** Line 51 changed from `gen_app_sechirut_ent2_c26` to `gen_app_sechirut_ent2_c27` in save map
- **Spec Integrity:** `git diff HEAD -- machtzev/generator/specs-ds/sechirut.txt` returns empty (sechirut.txt NOT modified); regeneration unintended
- **Git Status:** `git status` shows `modified: new/dart-gen-bs/gen_app_sechirut_ent2.dart` and `modified: new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart`
- **Fix:** Revert sechirut_ent2 files to HEAD; isolate peruk02 regeneration (do not run global `node machtzev/one.mjs`)

---

### 3. TERTIARY DEFECT (P2) — ORPHAN APP CREATED OUT-OF-SCOPE
**CONFIRMED** · New app panuy.txt created; unrelated to task
- **Spec File Evidence:** `machtzev/generator/specs-ds/panuy.txt` appears in `git ls-files --others --exclude-standard` (untracked); not in git history
- **Generated Files Evidence:** 28 Dart files created under `new/dart-gen-bs/gen_app_panuy_*.dart` and `new/dart-data-bs/auto/gen_app_panuy_*_content.dart`
- **App Config Evidence:** `machtzev/generator/apps/panuy.json` created (new)
- **Scope Violation:** panuy (worker availability) is unrelated to peruk02 (deposit/tenancy); task scope was single-app priority field only
- **Fix:** Remove `machtzev/generator/specs-ds/panuy.txt`, `machtzev/generator/apps/panuy.json`, and all `gen_app_panuy_*` files under `new/dart-{gen,data}-bs/`

---

## Machine Check Contradictions

| Check | Reported | Reality | Issue |
|---|---|---|---|
| `byte_identical_others` | ✅ | ❌ | sechirut_ent2 regenerated (16 lines changed in _labelsAll, error messages, field maps) |
| `no_orphans` | ✅ | ❌ | panuy.txt created (28 generated files, untracked) |
| `enum_high, enum_low, label` | ❌ 0× | ❌ 0× | Correct: no new enum fields in peruk02; task incomplete |

---

## FIX-LIST

1. **P0 — Add priority field to peruk02 spec:** Edit `machtzev/generator/specs-ds/peruk02.txt` line 6, add `עדיפות{גבוהה|בינונית|נמוכה}` to entity definition; regenerate only peruk02 via targeted generator invocation
2. **P1 — Revert sechirut regression:** Discard changes to `new/dart-gen-bs/gen_app_sechirut_ent2.dart` and `new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart` (restore to HEAD)
3. **P2 — Remove orphan app panuy:** Delete `machtzev/generator/specs-ds/panuy.txt`, `machtzev/generator/apps/panuy.json`, `machtzev/generator/particle-plan-panuy.*`, and all `new/dart-*/gen_app_panuy_*` files (28 files total)
