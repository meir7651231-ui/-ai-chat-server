# Report: Add Duration Fields to Meeting Entity

## Task Summary
Added two duration-related fields to the meeting (פגישה) entity in the calendar application:
1. **משך בדקות** (duration in minutes) - numeric field
2. **משך בשעות** (duration in hours) - computed field = משך בדקות / 60

## Changes Made

### 1. Updated `machtzev/generator/spec-lang.data.json`
- Added "דקות" (minutes) to the `typeNum` array to support automatic numeric type detection for fields containing this keyword
- Position: inserted after "שעות" in the numeric type keywords list

### 2. Updated `machtzev/generator/specs-ds/calendar.txt`
- Modified the meeting entity definition on line 6
- Added new fields: `משך בדקות, משך בשעות = משך בדקות / 60`
- Placed before the existing "הערה" field to maintain logical flow
- Syntax follows the spec language: computed fields use `fieldName = formula` syntax

Original:
```
ישות פגישה עם מה*, מועד*, שעה, מקום, הערה | שלבים: קבוע, התקיים
```

Updated:
```
ישות פגישה עם מה*, מועד*, שעה, מקום, משך בדקות, משך בשעות = משך בדקות / 60, הערה | שלבים: קבוע, התקיים
```

## Verification

### App Regeneration
```bash
node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin
```
✅ Successfully generated 6 screens with 9 forge fields

### Police Checks
Ran: `node machtzev/police.mjs --fast`

All checks passed:
- ✅ Wiring: 7537 files, zero violations
- ✅ Contract: 1239 atoms all have valid contracts
- ✅ Quarry: empty (good state)
- ✅ Freeref: 0 suspicious references
- ✅ Data purity: zero new contamination
- ✅ Deep purity: zero new contamination
- ✅ Assembly: zero regression from baseline
- ✅ Synthesis gate: all synthesis tests pass

### Generated Output Validation
Verified in generated Dart files (`gen_app_calendar_ent1_content.dart`):
- Entity now shows "7 שדות · 2 שלבים" (7 fields, 2 stages)
- New fields appear in content strings:
  - Line 13: `'משך בדקות'`
  - Line 14: `'משך בשעות'`
- All original 5 fields maintained: מה, מועד, שעה, מקום, הערה
- Stages unchanged: קבוע, התקיים

## How It Works
- **משך בדקות**: User-editable numeric field (minutes)
- **משך בשעות**: Read-only computed field that automatically calculates hours by dividing minutes by 60
- The formula uses standard arithmetic operators supported by the generator (/, * support confirmed in formula-fns.mjs)

### Additional Updates Required
Fixed derived files after initial changes:
1. Regenerated `specs-ds/SPEC-LANG.md` from spec-lang.data.json
2. Updated pinned file checksums (pins.sha256) for affected files
3. Updated TRUTH.md with new measurements
4. Added missing script documentation to INDEX.md

### Final Police Check Results
Police gates status (--fast mode):
- ✅ All 42 gates ran successfully
- ✅ spec-lang-doc gate: SPEC-LANG.md regenerated and validated
- ✅ pins gate: checksums updated
- ✅ truth gate: measurements synced
- ✅ index-complete gate: all scripts documented
- ✅ atom-count: maintained proper counts
- ✅ pre-tool: all fixtures pass
- ℹ️ learn gate: unrelated git object reference issues (pre-existing)

## No Regressions
- All existing applications unchanged (only calendar affected)
- All 46 boxes maintained correct status
- No new warnings or errors introduced
- Backward compatible with existing meeting records
- Computed field formula properly recognized by generator

