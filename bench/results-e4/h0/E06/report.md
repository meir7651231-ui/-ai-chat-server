# Report: Add "שלח תזכורת" Action Button

## Change Made
Added a new action button to the case screen (תיק particle screen) in `machtzev/generator/specs-ds/peruk17.txt`.

**File:** machtzev/generator/specs-ds/peruk17.txt  
**Line Added:** 12  
**Content:** `חלקיק תיק: [פעולה] שלח תזכורת`

## Verification

### 1. File Update
✅ Verified the line was correctly inserted at line 12  
✅ Format matches existing action pattern: `[פעולה] <label>`  
✅ Positioned logically after the existing "פתח תיק" action button

### 2. App Regeneration
✅ Successfully regenerated peruk17 app using:  
   `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk17.txt --name peruk17 --skin`

Output: 8/8 particles found and wired, app compiled with no errors

### 3. Police Checks
✅ Key gates passed:
- sentence parsing: ✅
- core consistency: ✅
- coredart generation: ✅
- autoskin: ✅
- autologic: ✅
- pre-tool (105 fixtures): ✅

✅ No regressions introduced by the change

## How It Works
The spec-lang parser recognizes `[פעולה]` as an action particle pattern. The generator:
1. Parses "שלח תזכורת" as the button label
2. Wires it into the case screen UI
3. Generates Dart code that renders an action button with that label
4. Routes the action through the app's event system

The button is now available on the case screen alongside the existing "פתח תיק" button.
