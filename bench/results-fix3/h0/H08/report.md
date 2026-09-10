# Report: Add Computed Field to panuy.txt

## Task
Add a computed field `מרחק אבסולוטי` (absolute distance) equal to `abs(הפרש רוחב)` (absolute value of width difference) to the panuy app specification without breaking anything.

## Changes Made

### 1. Entity Definition Update (Line 4)
Added computed field to the `אדם` (person) entity definition:
```
מרחק אבסולוטי = abs(הפרש רוחב)
```
Positioned logically after `הפרש אורך` and before `מרחק בריבוע` with other distance-related computed fields.

### 2. Particle Definition (New Line 12)
Added particle display definition:
```
חלקיק אדם: מרחק אבסולוטי
```
This enables the new field to appear in the UI alongside other distance measurements.

## Verification

**Syntax validation**: App regeneration completed successfully
```
🧩 חלקיקים (הכרעה-27): 13/13 נמצאו-ומחווטים · 1 מסכי-חלקיקים
✨ אפליקציה (מערכת-עיצוב) חוללה — 6 מסכים
```

**Core validation passed**: `node machtzev/police.mjs --fast` shows:
- ✓ sentence parsing completed
- ✓ autoskin: 27 roles selected
- ✓ pre-tool: 105/105 fixtures passed
- No errors specific to panuy or new field formula

## Result
The computed field `מרחק אבסולוטי` is now:
1. Properly defined as a formula-driven computed field using `abs()` function
2. Available for display in UI particles
3. Logically positioned among related distance calculations
4. Validated by the app generation pipeline
