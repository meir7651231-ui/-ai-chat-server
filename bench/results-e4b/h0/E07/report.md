# Report: Add דחופים Counter to peruk21

## Task
Add a counter named "דחופים" to the case screen that counts cases where סיווג (classification) equals "הזמנה לוועדה" (invitation to committee).

## Changes Made
Added a single new line to `machtzev/generator/specs-ds/peruk21.txt`:

```
חלקיק תיק: דחופים = מונה(תיק: סיווג=הזמנה לוועדה)
```

This line was inserted at line 17, after the existing "אסור" particle field, following the standard particle definition pattern used throughout the spec system.

## Verification

### Generator Output
- App regeneration succeeded with no errors
- Parser recognized the counter definition correctly
- All 9 particles wired successfully
- Output: "9/9 נמצאו-ומחווטים" (9/9 found and wired)

### Syntax Validation
The syntax follows established patterns from similar spec files:
- Example from `peruk06.txt`: `מונה(ממצא: צבע=אדום)` 
- Example from `panuy.txt`: `חלקיק אדם: פנויים עכשיו = מונה(זמין=כן)`

The new line combines both patterns:
- Particle field declaration: `חלקיק תיק: דחופים`
- Conditional counter: `מונה(תיק: סיווג=הזמנה לוועדה)`

This creates a field on the case entity that displays the count of all cases with classification = "הזמנה לוועדה".

## Impact
- No existing lines modified (only addition)
- No breaking changes to entity structure or fields
- Counter integrates into existing case screen display system
- Consistent with spec-lang grammar and existing patterns

## Police Check Results
- Exit code: 0 (successful)
- peruk21 confirmed in green status (ירוקים) in balagan-look gate
- App listed among 31 working paper applications
- No new failures or regressions introduced
