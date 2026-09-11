# Audit Report — Regression Lens
## Lens: state-leakage + regression (task-scoped changes)

### Findings

**new/dart-gen-bs/gen_app_sechirut_ent2.dart:29** · State leakage: sechirut_ent2 regenerated despite unchanged spec; constant indices shifted (c26→c27 in _labelsAll list, etc.) — P1 · Revert sechirut_ent2 regeneration; commit peruk21 changes only

### Untracked Files (not committed, but present in worktree)

- `machtzev/generator/specs-ds/panuy.txt` — new spec file, untracked
- `new/dart-data-bs/auto/gen_app_panuy_*.dart` — 12 untracked generated files
- `new/dart-gen-bs/gen_app_panuy_*.dart` — 18 untracked generated files
- `machtzev/generator/apps/panuy.json` — untracked
- `machtzev/generator/particle-plan-panuy.*` — untracked

These files are orphaned (not committed). They should be cleaned up or explained. The task spec is peruk21 only; panuy is extraneous.

### Verified Correct

✅ **peruk21 text substitution**: old text "אין תיקים עדיין" completely removed from peruk21 generated files; new text "אין מכתבים פתוחים" appears exactly 2× in gen_app_peruk21_px1_content.dart (lines 18–19), as expected for [ריק] particle pattern.

✅ **Spec edit scope**: Only machtzev/generator/specs-ds/peruk21.txt was modified (single line 12 changed), no other specs touched.

✅ **No substring over-triggers**: "מכתבים" phrase isolated to peruk21.txt; no cross-contamination into other spec files.

✅ **Peruk app isolation**: Other peruk apps (peruk01, peruk04, etc.) retain old "אין תיקים עדיין" text correctly, confirming app-ds.mjs ran in correct scope for peruk21.

❌ **Cross-app leakage detected**: sechirut_ent2 is NOT a peruk app and should not have been regenerated. Its spec (sechirut_ent2.txt) did not change, but generated .dart file was modified—constant references shifted in logic and labels arrays. Police report's "byte_identical_others" check may have only verified peruk* apps, missing sechirut.

---

## Summary

**Regression found (P1):** sechirut_ent2 unintentionally regenerated, violating the byte-identical contract for unchanged apps. Panuy files are untracked orphans (not committed but present). The core peruk21 change is technically correct—old text removed, new text inserted cleanly—but the unintended sechirut_ent2 changes must be reverted before this commit is accepted.

