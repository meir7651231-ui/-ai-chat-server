# 🔍 VALIDATOR — M01 (peruk02 payment entity)

## Findings

**P1-display**: new/dart-gen-bs/gen_app_peruk02_px3.dart:22 · CONFIRMED · תיק column in particle table displays raw case ID instead of case name · wrap first item in items array with `appStore.displayOf('app_peruk02_ent1', r[gen_app_peruk02_px3_c4] ?? '')` 

## Verdict Justification

**CONFIRMED — real bug, correct fix, safe to apply:**

1. **Bug is real:** Line 22 of px3.dart produces items containing `[(r[gen_app_peruk02_px3_c4] ?? ''), ...]` which returns the raw ID (e.g., "ent1_abc123"). The תיק field is a link to app_peruk02_ent1 (case entity) and should display the case name, not the ID.

2. **Pattern match in codebase:** ent3.dart line 152 (the same entity's table view) correctly uses `appStore.displayOf('app_peruk02_ent1', r[gen_app_peruk02_ent3_c9] ?? '')` for the same תיק column. Also line 90 (card view) and line 98 (_csv export) follow the same pattern. This is the established convention.

3. **Safe fix:** The proposed fix substitutes `appStore.displayOf('app_peruk02_ent1', r[gen_app_peruk02_px3_c4] ?? '')` into the same position. appStore is already available in scope (imported line 8), the entity reference 'app_peruk02_ent1' is correct per spec and relations.dart line 7, and the null-coalescing `?? ''` is preserved. No side effects; no other code depends on the raw ID being displayed.

4. **Auditor agreement:** Both _audit-compile.md and _audit-coverage.md agree on this finding and fix proposal. Police report shows all other checks pass (regen_ok, gates_pass, ent3, paid, px3, etc.).

## Final Sweep

✅ **Spec additions (peruk02.txt):** Entity definition (line 8) and three particles (lines 19–21) correctly added with cascade rule `| מחיקה: תיק=מפל`.

✅ **Entity generation (ent3.dart):** Fields validated correctly (תיק*/סכום* required, שולם optional), form UI wired, table view (line 152) correctly uses displayOf, scope filtering in place, CSV export consistent.

✅ **Relations (relations.dart line 7):** Cascade deletion registered correctly: `registerRelation('app_peruk02_ent3', 'תיק', 'app_peruk02_ent1', 1, multi: false)`.

✅ **Navigation (ent1.dart line 99):** Footer correctly references payment count via `appStore.referencing('app_peruk02_ent3', gen_app_peruk02_ent1_c29, rid)`.

✅ **No regressions:** Only peruk02 files modified; byte_identical_others gate passed.

---

FIX-LIST: P1-display
