# Validator Report — H15 (peruk21)

## Findings

**CONFIRMED P0-CRITICAL** · byte_identical_others · gen_app_sechirut_ent2.dart + gen_app_sechirut_ent2_content.dart + gen_app_panuy_ent1.dart modified (column indices renumbered; refs c26→c27 cascaded) · Regen side-effect broke other peruk apps; must be fixed in engine before fixing.

**CONFIRMED P1** · panuy_ent1_unspecified_side_effect · git diff shows gen_app_panuy_ent1.dart changed; spec unchanged; likely index-collision from shared content/column numbering pool.

## Verified as Correct

✅ **sort_px** — gen_app_peruk21_px1.dart line 28: sorts records by `gen_app_peruk21_px1_c7` ('עד מתי') with proper null handling (empty last), numeric/string comparison. Ascending (soonest first) is correct.

✅ **sort_ent** — gen_app_peruk21_ent1.dart line 155: sorts records by `gen_app_peruk21_ent1_c24` ('עד מתי') with identical logic. Both specs matched in content files (c7 and c24 both map to 'עד מתי' field).

✅ **regen_ok** — spec peruk21.txt regenerated correctly; particle plan and content files consistent with spec intent.

✅ **no_hand_edit** — all generated files syntactically correct Dart, no manual edits detected.

✅ **compiles** — analyzer errors: 0 in-app.

✅ **dart_math_sane** — no `.sqrt()` / `.pow()` / `.min()` / `.max()` called on `num` type; sound null safety preserved throughout.

## Root Cause

The engine's regen pipeline updated app_sechirut_ent2 and app_panuy_ent1 files despite task scope being peruk21 only. This is an engine bug (not an audit/builder bug); affects byte_identical_others check.

---

**FIX-LIST:**
1. **Engine bug (regen side-effect)** — Regenerate all peruk apps to verify which files should have changed; revert unintended changes to sechirut_ent2 and panuy_ent1 OR identify if peruk21 spec update triggered legitimate dependent regeneration that should have been communicated. Byte-identical check FAILED.

**Status:** NOT DONE — blocking issue in regen layer must be resolved before this task is complete.
