# INSP-M14 — Add אדם stages to panuy.txt

## Audit by lens (MASTER_PROTOCOL §(g))

**task-coverage (every surface the task names):**
✅ Entity stages added (פנוי, הוזמן, בוצע) — task explicitly names these three states — all covered.

**money-numeric:**
✅ No money/numeric changes — existing `מחיר לשעה`, `שעות`, `מחיר לשעתיים` computed fields unchanged.

**edge-crash:**
✅ Empty person list edge case — handled by existing particle `[ריק]` (line 15). Stages do not introduce new crashes.

**state-leakage:**
✅ Person state (stage) scoped to אדם entity. No cross-app state pollution — machine verified `byte_identical_others`.

**navigation:**
✅ No new navigation — stages are enum chip selector on אדם form. Root entity still אדם. SegmentedSwitch navigation unchanged.

**text-parity:**
✅ Stage names are task-specified (not verbatim prototype). Protocol allows domain-specific enum names. Hebrew is canonical (no English names needed). No parity issue.

## Changes
- **File modified:** machtzev/generator/specs-ds/panuy.txt (line 4 only)
- **Lines added:** 1 (stages clause to entity definition)
- **Engine modified:** No
- **Hand-edits to generated:** No
- **Other apps affected:** No (machine verified)

## Machine gates
| Gate | Result |
|---|---|
| regen_ok | ✅ Generator succeeded |
| byte_identical_others | ✅ All other apps byte-identical |
| no_orphans | ✅ No stray generated files |
| gates_pass | ✅ Police gates green |
| no_hebrew_in_engine | ✅ Spec file only |
| dart_math_sane | ✅ Computed fields valid |
| compiles | ✅ Dart analysis 0 errors |
| no_hand_edit | ✅ No manual Dart edits |
| s1 | ✅ Stage syntax valid |
| s2 | ✅ No data breakage |

## VERDICT: **GO**
All audits passed. Task complete. Ready for push when user approves.
