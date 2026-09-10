# Task Report: Add דחופים Counter to peruk21

## What Was Done
Modified `machtzev/generator/specs-ds/peruk21.txt` line 8 to add a new counter to the control board.

### Change Details
**File:** `machtzev/generator/specs-ds/peruk21.txt`
**Line 8 - Before:**
```
לוח בקרה עם מונה(תיק)
```

**Line 8 - After:**
```
לוח בקרה עם מונה(תיק), מונה דחופים(תיק: סיווג=הזמנה לוועדה)
```

## How It Works
- Added a second counter to the control board (לוח בקרה)
- Counter name: **דחופים** (urgent/pressing cases)
- Counter filters: Only counts cases where `סיווג` (classification) equals `הזמנה לוועדה` (committee summons)
- This follows the same filtering syntax pattern used in peruk01.txt

## Verification
✓ App regenerated successfully: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk21.txt --name peruk21 --skin`

✓ Police validation passed (fast mode):
  - Wiring: 7537 files, zero violations
  - Contract: 1239 atoms all valid
  - Assembly: 46 boxes, zero regression
  - Data purity: zero contamination
  - All key gates green

✓ Generated output:
  - 8 particles found and wired
  - 7 screens generated
  - Board particle included in screen layout

## No Breaking Changes
- Existing counter for all cases (`מונה(תיק)`) remains unchanged
- Only added new counter, no deletions or modifications to other elements
- Spec follows established pattern from similar files (peruk01.txt)
