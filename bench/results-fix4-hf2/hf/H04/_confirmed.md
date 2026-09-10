# Validator Report — Calendar Sort Task (H04)

## FINDINGS

**P1 · CONFIRMED · byte_identical_others check false-negative**
- Evidence: `git diff HEAD -- new/dart-gen-bs/gen_app_sechirut_ent2.dart` shows ~30 lines changed (lines 26, 44, 47, 59, 88, 98, 100, 160, 175–180, 186–187)
  - Constant renaming: c26→c27 in _labelsAll (line 26)
  - Field reference updates throughout file (lines 44, 47, 59, 88, 100, 160, 186–187)
  - Validation logic changes (lines 44, 47)
  - CSV and card rendering changes affecting field indices
- Regression: Sechirut app (שכירות/rentals) regenerated despite no spec change; only calendar.txt was modified
- Fix: Either revert sechirut ent2 changes OR document intentional spec/engine improvements and re-run full validation

**Calendar sort · FALSE-POSITIVE (correct implementation)**
- All auditors verified sort is correct
- Spec line 6: `| מיון: מועד עולה, שעה עולה` → two-level ascending sort by date (מועד) then time (שעה)
- Implementation: gen_app_calendar_ent1.dart:157 applies nested comparators before all views
- Constants match: c16='מועד', c17='שעה' (verified in gen_app_calendar_ent1_content.dart)
- Dart safety: null-safe defaults (`??''`), proper null checks before `.compareTo()`
- No false positive: this is the correct sorting implementation, not a bug
- All views (list/board/calendar/table) use sorted rs

---

**FIX-LIST:** 
- P1: Investigate sechirut regeneration. If unintentional, revert new/dart-gen-bs/gen_app_sechirut_ent2.dart to HEAD. If intentional, document engine improvements and re-run police validation.
