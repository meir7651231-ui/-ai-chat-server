# ✅ VALIDATOR REPORT — H04 (calendar) · 2026-09-10

## Audit Findings Verification

**audit-compile.md**: No findings reported. ✅ Verified: gen_app_calendar_px1.dart line 18 sort logic is syntactically correct Dart with proper null-safety guards, numeric/lexical comparison, and two-level ordering (c6=מועד ascending, c7=שעה ascending).

**audit-regression.md**: Two findings reported.
- Finding 1 (sechirut_ent2 state-leakage): gen_app_sechirut_ent2.dart modified at lines 29,88,187. CONFIRMED via bytes: `git diff HEAD` shows constant renumbering (c26→c27, c24→c25, error message indices c29/c30→c30/c31), field reassignment, and logic restructuring without sechirut.txt spec change.
- Finding 2 (sechirut_ent2_content constant-shift): gen_app_sechirut_ent2_content.dart lines 25-31. CONFIRMED via bytes: c25–c30 constants renumbered to c25–c31 despite sechirut.txt unchanged.

**audit-coverage.md**: No findings reported. ✅ Verified: calendar px1 sort implementation correct, spec compliant.

---

## Police Report vs. Bytes Contradiction

**_police.md claim:** `byte_identical_others ✅`

**Actual bytes:** `git diff HEAD --name-only` shows:
```
new/dart-gen-bs/gen_app_sechirut_ent2.dart
new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart
```

**Verdict:** CONFIRMED — Police check `byte_identical_others` claims PASS but git diff reveals non-calendar apps were modified. This is a P0 check-integrity failure: either the police script does not properly track sechirut changes, or the report was not regenerated after generator ran.

---

## Findings Summary

| id | verdict | evidence | one-line fix |
|---|---|---|---|
| police-byte-identical-others | CONFIRMED P0 | _police.md line 6 claims ✅ but gen_app_sechirut_ent2*.dart changed (git diff 2 files) | revert sechirut_ent2.dart and _content.dart to HEAD; re-run police check |
| sechirut-ent2-regression | CONFIRMED P1 | new/dart-gen-bs/gen_app_sechirut_ent2.dart lines 29,88,187: constants c26→c27, c24→c25, field indices changed; sechirut.txt spec unmodified | revert gen_app_sechirut_ent2.dart to HEAD |
| sechirut-content-regression | CONFIRMED P1 | new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart lines 25-31: c25-c30 renumbered to c25-c31 without spec change | revert gen_app_sechirut_ent2_content.dart to HEAD |

---

## Task Completion Status

✅ **Calendar sorting implemented correctly:**
- Spec: `machtzev/generator/specs-ds/calendar.txt` line 7 adds particle with two-level sort
- Generated code: gen_app_calendar_px1.dart line 18 implements two-level sort: primary c6 (מועד), secondary c7 (שעה)
- Dart correctness verified: null-safe defaults, `num.tryParse()` with null-check, `.compareTo()` methods valid, proper return cascade
- All calendar files regenerated correctly; no orphans
- Compilation: analyzer errors = 0

❌ **Breaking regression: sechirut_ent2 unintentionally modified**
- Cause: unknown (build env/generator state not available to auditor)
- Impact: sechirut app constants renumbered; must revert before merge
- Severity: P1 — blocks ship

---

FIX-LIST:
- police-byte-identical-others: CONFIRMED P0 · _police.md line 6 reports byte_identical_others ✅ but gen_app_sechirut_ent2.dart and _content.dart modified (git diff shows 2 files changed) · revert both sechirut files to HEAD and re-run police check
- sechirut-ent2-regression: CONFIRMED P1 · new/dart-gen-bs/gen_app_sechirut_ent2.dart lines 29,88,187 show constant remapping (c26→c27, c24→c25, c29→c30, c30→c31) with sechirut.txt spec unchanged · revert file to HEAD
- sechirut-content-regression: CONFIRMED P1 · new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart lines 25-31 renumbered without spec change · revert file to HEAD
