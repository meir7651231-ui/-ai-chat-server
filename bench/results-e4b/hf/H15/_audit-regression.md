# Audit: peruk21 Deadline Sorting (H15)

## Findings
No findings.

## Coverage
✓ **Sort implementation verified (both screens):**
  - Entity list screen (ent1.dart:155): sorts by `gen_app_peruk21_ent1_c24` ('עד מתי'), applies to list/board/table views
  - Particle table screen (px1.dart:28): sorts by `gen_app_peruk21_px1_c7` ('עד מתי')
  - Sort direction: ascending via `.compareTo()` (soonest first) ✓
  - Empty deadlines placed last ✓
  - Field references consistent and correct ✓

✓ **Spec language validated:**
  - Entity declaration: `| מיון: עד מתי עולה` (ascending sort) ✓
  - Particle declaration: `| מיון: עד מתי עולה` (ascending sort) ✓

✓ **Constants integrity:**
  - ent1: c13='עד מתי' (field), c24='עד מתי' (sort reference) — correct duplication for sort channel
  - px1: c5='עד מתי' (column), c7='עד מתי' (sort reference) — correct duplication for sort channel

✓ **Regression checks (police report passed):**
  - byte_identical_others ✅: no other peruk apps affected
  - no_orphans ✅: all generated files present
  - no_hand_edit ✅: code is machine-generated
  - compiles ✅: Dart analyzer zero errors
  - gates: sort_px ✅ px1, sort_ent ✅ ent1

✓ **Learning documented:**
  - LEARNINGS.md entry added with GATE: sort_px, sort_ent
  - Spec-language rule captured (no hand-written compare in Dart, use spec syntax)

**This area holds up.** The sorting implementation is correct, consistent across both listing contexts, and poses no regressions or state-leakage issues.
