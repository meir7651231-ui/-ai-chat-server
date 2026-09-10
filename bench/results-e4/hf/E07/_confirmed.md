# 🔴 Validator Report — E07 (peruk21)

## Findings

**A1 · CONFIRMED P0 · Unintended regeneration & data loss in sechirut · new/dart-gen-bs/gen_app_sechirut_ent2.dart:51 · Remove _v[8] field deletion**

The regression auditor correctly identified state-leakage: `gen_app_sechirut_ent2.dart` was regenerated even though `sechirut.txt` spec has NO changes. Verification:

- **Evidence (git diff):** Only 2 files changed: `gen_app_peruk21_px1.dart` (expected) and `gen_app_sechirut_ent2.dart` (unintended)
- **spec check:** `git diff HEAD -- machtzev/generator/specs-ds/sechirut.txt` → empty (no changes)
- **Regression bytes:** Three critical deletions in gen_app_sechirut_ent2.dart:
  - Line 51 (original): `gen_app_sechirut_ent2_c24: _v[8] ?? ''` → new: `gen_app_sechirut_ent2_c24: ''` (data loss: _v[8] hardcoded to empty)
  - Lines 178-179 (original): Entire ForgeDsField widget for _v[8] input DELETED
  - Line 179 (original): Conditional month-key display for _v[8] DELETED
  - Constants re-indexed (c25→c30→c31, c26→c27→c28→c29), breaking UI field references
- **Impact:** Users can no longer input/edit _v[8]; any existing _v[8] values are lost on save (saved as empty string). One complete data field removed from the form.
- **Fix:** Revert `gen_app_sechirut_ent2.dart` to HEAD version (undo unintended regeneration).

---

## Summary

**peruk21 counter implementation:** VERIFIED CORRECT
- Spec line 17: `חלקיק תיק: דחופים = מונה(סיווג=הזמנה לוועדה)` ✅
- Generated code: KvLine counter correctly filters/counts cases where סיווג=='הזמנה לוועדה' ✅
- Constants: c89='דחופים' (label), c91='סיווג' (field), c92='הזמנה לוועדה' (value) ✅
- Null safety: `(r[...] ?? '') == value` pattern correct ✅
- Compiles: 0 analyzer errors ✅
- Peruk21 isolated: no side effects to peruk21 ecosystem ✅

**Police report vs. reality:** The machine report claimed `byte_identical_others=✅` but this is incorrect — `sechirut_ent2.dart` was modified. This represents a detection failure in the police gate, though the task itself (peruk21 counter) was implemented correctly.

---

FIX-LIST: A1
