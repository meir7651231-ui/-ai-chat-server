# סכום מעוגל Computed Field Addition — Report

## Task
Add a computed field `סכום מעוגל` (rounded amount) to the tasks entity that rounds the `סכום` (amount) field to the nearest whole number.

## Changes Made

### File: `machtzev/generator/specs-ds/tasks.txt`
**Before:**
```
ישות משימה עם מה*, מועד, סכום, הערה | שלבים: פתוח, נעשה
```

**After:**
```
ישות משימה עם מה*, מועד, סכום, סכום מעוגל = round(סכום), הערה | שלבים: פתוח, נעשה
```

Added computed field using the `round()` function following the spec-lang standard:
- Field name: `סכום מעוגל`
- Formula: `round(סכום)`
- Syntax matches existing examples in `panuy.txt` (e.g., `מרחק בקמ = sqrt(מרחק בריבוע)`)

## Verification

### App Regeneration
Ran: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/tasks.txt --name tasks --skin`

**Result:** ✓ App successfully regenerated
- 6 fields generated (previously 5): confirms new computed field was parsed
- 1 numberField recognized (סכום field type inference intact)
- All screens rendered correctly (6 screens: 1 entity · 4 system · 1 board)

### Police Validation
Ran: `node machtzev/police.mjs --fast`

**Critical gates passed:**
- ✓ חוקי-החשמלאי (wiring): 7537 files, zero wiring violations
- ✓ חוק-החוזה (contract): 1239 atoms, all with valid contracts
- ✓ שער-טוהר-דאטה (data purity): zero contamination
- ✓ שער-טוהר-עומק (deep purity): zero contamination

**Note:** index-complete gate failed due to unrelated documentation entries for other scripts (formula-fns.mjs, sort-cmp.mjs, spec-lang-doc.mjs) — not caused by this change.

## No Breaking Changes
- Existing fields unchanged
- Entity states/stages unchanged
- Formula syntax is standard and tested (round() is in spec-lang.data.json)
- Backward compatible: new field is computed, non-destructive

## Confidence
✓ Field properly added per spec-lang syntax
✓ App regenerates with new field recognized
✓ Core validation gates pass
✓ No dependencies broken
