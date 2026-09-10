# 🔍 VALIDATOR FINDINGS — M08 (peruk08)

## Summary
**5 findings verified; 1 CONFIRMED defect; 4 FALSE-POSITIVE**

---

## Verified Findings

### ID-1: Peruk08 enum field conversion
**VERDICT: CONFIRMED**
- **Evidence:** machtzev/generator/specs-ds/peruk08.txt:6 — field changed from `האם כבר פנו למוכר` to `האם כבר פנו למוכר{כן|לא|לא יודע}`; machtzev/generator/apps/peruk08.json — enumVals populated with 3 values; gen_app_peruk08_ent1_content.dart:15-17 — constants c15='כן', c16='לא', c17='לא יודע'; gen_app_peruk08_ent1.dart:145 — DsEnumField renders with correct options
- **Fix:** Already applied correctly. ✅

### ID-2: Counter particle "לא פנו" wired to case screen
**VERDICT: CONFIRMED**
- **Evidence:** machtzev/generator/specs-ds/peruk08.txt:16 — particle defined as `חלקיק תיק: לא פנו = מונה(האם כבר פנו למוכר=לא)`; machtzev/generator/particle-plan-peruk08.json — particle entry created with shape="count"; gen_app_peruk08_px1.dart:35 — KvLine renders `appStore.records('app_peruk08_ent1').where((r) => (r[gen_app_peruk08_px1_c123] ?? '') == gen_app_peruk08_px1_c124).length.toDouble().toStringAsFixed(0)`; gen_app_peruk08_px1_content.dart — c121='לא פנו', c123='האם כבר פנו למוכר', c124='לא'
- **Fix:** Already applied correctly. ✅

### ID-3: Compilation succeeds
**VERDICT: CONFIRMED**
- **Evidence:** _police.md reports `compiles ✅` with `analyzer errors total=0 in-app=0`
- **Fix:** No action needed. ✅

### ID-4: Spec syntax valid and gates pass
**VERDICT: CONFIRMED**
- **Evidence:** _police.md reports `gates_pass ✅` (spec parsing OK); enum gate ✅ (1 enum detected); counter gate ✅ (consts=1)
- **Fix:** No action needed. ✅

### ID-5: **DEFECT — sechirut_ent2 application modified unintentionally**
**VERDICT: CONFIRMED P0**
- **Evidence:** 
  - `_police.md` claims `byte_identical_others ✅` but this is FALSE
  - `git diff HEAD -- new/dart-gen-bs/gen_app_sechirut_ent2.dart` shows FUNCTIONAL CHANGES:
    - **Line removed:** `if ((_v[8] ?? '').trim().isNotEmpty) _live(gen_app_sechirut_ent2_c25, monthKey((_v[8] ?? '')))` — a monthKey calculation for field _v[8] was deleted
    - **Line changed:** comparison logic altered from `_v[7]` reference changing context
    - **Calculation modified:** live field logic at `if (true) _live(gen_app_sechirut_ent2_c26, ...)` was replaced with TWO live fields now using c24/c27 and different indices
  - The sechirut.txt spec was NOT modified (git diff shows no changes)
  - The change occurred because the generator re-allocated constants across ALL apps after peruk08 gained 3 enum values, causing index shifts in sechirut_ent2
- **Severity:** P0 — unintended functional changes to an unrelated application
- **Fix:** Regenerate sechirut using original (unmodified) sechirut.txt spec in isolation, or manually revert sechirut_ent2 changes to HEAD state to restore the monthKey calculation for _v[8] and correct the live field logic indices

---

## FIX-LIST

**FIX-LIST:** 1 confirmed defect (ID-5, P0 cross-app regression). The byte_identical_others check in the machine report is INACCURATE — sechirut_ent2 was modified despite no spec change. This suggests a generator-state issue or constant-allocation ordering problem when processing multiple apps in a single run.

