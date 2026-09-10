# 🔴 VALIDATOR REPORT — H05 (peruk02 sort)

## Findings Verified

| ID | Verdict | Evidence | Fix |
|---|---|---|---|
| REGRESS-1 | CONFIRMED | new/dart-gen-bs/gen_app_sechirut_ent2.dart:29 `gen_app_sechirut_ent2_c26` → `gen_app_sechirut_ent2_c27` in _labelsAll; sechirut.txt spec unchanged (git diff empty) | Revert gen_app_sechirut_ent2.dart to HEAD |
| REGRESS-2 | CONFIRMED | new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart:25–31 constants renumbered (c25/c26 removed, c27 new, c28–c29 shifted to c28–c29, c30→c31); sechirut spec untouched | Revert gen_app_sechirut_ent2_content.dart to HEAD |
| SORT-IMPL | FALSE-POSITIVE | new/dart-gen-bs/gen_app_peruk02_px1.dart:27 sort closure verified: (1) key `a[gen_app_peruk02_px1_c13]` ≡ 'תאריך מסירת מפתח' (content line 15) ✓; (2) empty-last logic `if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1` ✓; (3) numeric parse safe via `num.tryParse(x)` with null guard ✓; (4) comparisons `nx.compareTo(ny)` (numeric) and `x.compareTo(y)` (lexical) both ascending ✓; (5) sort order correct: `return c` yields -1 when first<second, placing earliest first ✓ | None — implementation is correct |

---

## Summary

**Real bugs found: 2** (P1 regressions to sechirut, unintended cross-app regeneration)  
**False positives: 1** (sort implementation verified sound)

### Root cause analysis (unverified):
The sechirut app was regenerated despite its spec (sechirut.txt) being untouched. This suggests:
- Generator state corruption (constant numbering collision between apps)
- Substring-match bug in constant pool generation
- Cross-app regeneration trigger defect

Police report's `byte_identical_others ✅` check is **INCORRECT** — sechirut files demonstrably changed. Validation requirement: audit generator to prevent constant collisions across app-ds apps.

---

## FIX-LIST:
- REGRESS-1: Revert new/dart-gen-bs/gen_app_sechirut_ent2.dart line 29 from `c27` to `c26`; lines 44, 50, 62, 89, 91, 101 from `c30`/`c31` to `c29`/`c30`
- REGRESS-2: Revert new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart lines 25–31 to original constant definitions (c25='מפתח חודש', c26='חורג מול שליש', c27='חורג', c28='תקין', c29='טווח פיקדון', c30='טווח ערבות בנקאית')
