# Task Report: Add Action Button to peruk17

## What Was Done
Added a new action button labeled "שלח תזכורת" (Send Reminder) to the case screen particle for the תיק (case/ticket) entity in peruk17.

### Changes Made
- **File:** `machtzev/generator/specs-ds/peruk17.txt`
- **Line Added:** Line 12
- **Change:** Added `חלקיק תיק: [פעולה] שלח תזכורת` between the existing "פתח תיק" action and the empty state marker

### Spec File Structure (Lines 10-13)
```
חלקיק תיק: [טבלה]
חלקיק תיק: [פעולה] פתח תיק
חלקיק תיק: [פעולה] שלח תזכורת
חלקיק תיק: [ריק] אין תיקים עדיין
```

## How It Works
The spec-lang parser recognizes the syntax `חלקיק תיק: [פעולה] <label>` and generates an action button with the given label on the case particle screen. This follows the same pattern as the existing "פתח תיק" (Open Case) button.

## Verification
1. **Syntax Validation:** The new line uses correct spec-lang syntax
2. **App Regeneration:** Ran `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk17.txt --name peruk17 --skin`
   - Output: `🧩 חלקיקים (הכרעה-27): 8/8 נמצאו-ומחווטים`
   - All 8 particles found and wired successfully
   - 7 screens generated with no errors
3. **No Breaking Changes:** The app compiled cleanly with no errors or warnings

## Notes
- The action button will appear on the case (תיק) particle screen alongside the existing "פתח תיק" button
- The button is inactive until connected to a logic handler (this is handled separately in the app-ds generation pipeline)
- This change is isolated to peruk17 and does not affect other applications
