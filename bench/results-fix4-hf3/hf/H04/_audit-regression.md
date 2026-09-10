# 🔍 Auditor Report: Calendar Particle Sorting (H04)

## Findings

new/dart-gen-bs/gen_app_sechirut_ent2.dart:29,88,187 · state-leakage: sechirut_ent2 regenerated unintentionally · P1 regression · remove sechirut changes from working tree (sechirut.txt spec unchanged; only calendar.txt modified)

new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart:25-31 · content-leak: constant indices shifted (c25/c26/c27/c28/c29/c30 → c25/c26/c27/c28/c29/c31) without spec change · P1 regression · revert to HEAD

## Verified Correct

✅ **Sort logic (calendar px1 screen)**: gen_app_calendar_px1.dart:18 implements two-level sort via `.sort((a,b){ ... return 0; })` with:
  - Primary: `gen_app_calendar_px1_c6` (= 'מועד'/date) with empty-last handling
  - Secondary: `gen_app_calendar_px1_c7` (= 'שעה'/time) with empty-last handling
  - Numeric comparison when parseable, lexical otherwise
  - Matches spec: `חלקיק פגישה: [טבלה] ... | מיון: מועד עולה, שעה עולה` ✓

✅ **Calendar app generation**: gen_app_calendar_px1_content.dart correctly maps sort keys: c6='מועד', c7='שעה'

✅ **Calendar hub navigation**: gen_app_calendar_hub.dart correctly adds px1 import and new tile (index [5]) pointing to GenAppCalendarPx1Screen

✅ **No orphan files**: All calendar-related generated files (.dart under new/dart-gen-bs/gen_app_calendar_*.dart and new/dart-data-bs/auto/gen_app_calendar_*.dart) are tracked

✅ **No hand-edits in calendar px1**: File header correctly declares auto-generated status

## Coverage

**Checked**: calendar spec→gen (sort syntax parse), sort algorithm logic (Dart comparator), column constant mapping, hub wiring, file naming, no orphans in calendar app.

**Could not check**: whether particles.mjs or other generator triggered sechirut regeneration (build env not available). Source of state-leakage unknown but symptom clear: `git status` shows gen_app_sechirut_ent2.dart + _content.dart modified despite sechirut.txt unchanged.

## Summary

Task **partially done**: sorting works correctly for calendar meetings. **Breaking change**: sechirut_ent2 files regenerated without spec change — indicates either over-broad generator invocation or shared constant system disruption. Must revert sechirut changes before merge.
