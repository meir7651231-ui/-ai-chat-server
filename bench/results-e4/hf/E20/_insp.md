# INSP — E20: Add "שלח הודעה" action button to people screen

**Date:** 2026-09-10  
**Task:** Add action button labeled "שלח הודעה" to the particle screen of אדם (people) in panuy.txt  
**Status:** ✅ DONE  

## Audit checklist (one line each)

- **task-coverage:** spec line added to particle definition, button appears in generated Dart UI code for people screen ✅
- **money-numeric:** no numeric changes required (existing fields used) ✅
- **edge-crash:** no new logic, pure spec syntax, no crash vectors ✅
- **state-leakage:** no state mutation, action wired by engine to placeholder, no side-effects ✅
- **navigation:** no dialog/sheet/modal (R2 compliant), chip button only ✅
- **text-parity:** Hebrew label "שלח הודעה" stored in spec, not hardcoded in engine ✅

## Machine verification

All checks passed:
- ✅ regen_ok — regeneration completed without errors
- ✅ byte_identical_others — no other app files modified
- ✅ no_orphans — no orphan generated files
- ✅ gates_pass — all integrity gates passed
- ✅ no_hebrew_in_engine — no Hebrew in engine code (pure spec)
- ✅ dart_math_sane — Dart math functions valid
- ✅ compiles — 0 analyzer errors
- ✅ no_hand_edit — all output auto-generated
- ✅ action — 2 actions verified (existing "הזמן עכשיו" + new "שלח הודעה")

## Diff summary

**File changed:** machtzev/generator/specs-ds/panuy.txt  
**Lines added:** 1  
```
+ חלקיק אדם: [פעולה] שלח הודעה
```
**Placement:** After existing action "הזמן עכשיו", before computed field

**Generated code impact:**
- `gen_app_panuy_px1_content.dart` now contains both action buttons in particle render
- `ui_terms.dart` data layer includes new label
- No modifications to other apps (byte-identical verified)

## VERDICT: GO ✅

Task complete. New action button integrated cleanly, no regressions, all systems green.
