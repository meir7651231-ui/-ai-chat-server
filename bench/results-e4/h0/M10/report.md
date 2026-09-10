# Calendar Entity Enhancement Report

## Summary
Successfully added two new fields to the calendar entity's meeting (פגישה) entity:
- `משך בדקות` (duration in minutes) — numeric field
- `משך בשעות` (duration in hours) — computed field with formula `משך בדקות / 60`

## Changes Made

### 1. Updated spec-lang.data.json
Added `"דקות"` (minutes) to the `typeNum` array to enable automatic type detection for fields containing this word.

**Location**: `machtzev/generator/spec-lang.data.json` (line 21)
- Before: `["מחיר", "סכום", ... "שעות", "שטח", ...]`
- After: `["מחיר", "סכום", ... "שעות", "דקות", "שטח", ...]`

### 2. Updated calendar.txt specification
Modified the meeting entity definition to include the two new fields.

**Location**: `machtzev/generator/specs-ds/calendar.txt` (line 6)
- Before: `ישות פגישה עם מה*, מועד*, שעה, מקום, הערה | שלבים: קבוע, התקיים`
- After: `ישות פגישה עם מה*, מועד*, שעה, מקום, משך בדקות, משך בשעות = משך בדקות / 60, הערה | שלבים: קבוע, התקיים`

### 3. Regenerated Calendar Application
Executed: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin`

Result: Application successfully generated with updated field schema.

## Verification

### Field Parsing Test
Verified that both fields are correctly parsed by the entity interpreter:
- ✓ `משך בדקות` recognized as type `num` (numeric)
- ✓ `משך בשעות` recognized as type `num` with formula `משך בדקות / 60`

### Generated Output
The calendar.json app manifest correctly includes both fields:
- Line 58-62: `משך בדקות` field definition
- Line 64-68: `משך בשעות` field definition

### Police Tests
Ran `node machtzev/police.mjs --fast` to verify no regressions:
- ✓ autoskin: 27 tasks selected from 359 atoms (forge skin applied correctly)
- ✓ autologic: 30 logic operations working correctly
- ✓ skingolden: Golden skin generation passing
- ✓ atom-count: 5293 atoms (no change, floor maintained)
- ✓ pre-tool: 105/105 fixture tests passing (all existing functionality intact)

## Conclusion
Both fields have been successfully added to the calendar entity without breaking any existing functionality. The computed field formula is correctly parsed and included in the generated app. All pre-existing tests continue to pass.
