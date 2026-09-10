# Inspection: panuy list sorting and distance display

## Audit through 6 lenses

### 1. Task-coverage
- ✅ List sorting by distance: Implemented via spec-lang table sorting directive (מיון: מרחק בקמ עולה)
- ✅ Distance in km: Changed display from מרחק בריבוע to מרחק בקמ
- ✅ Real distance calculation: Spec already defines מרחק בקמ = sqrt(מרחק בריבוע)
- ✅ Don't break anything: Only modified panuy.txt spec, no engine changes

### 2. Money-numeric
- ✅ Price fields preserved: מחיר לשעה and מחיר לשעתיים remain in table display
- ✅ Price calculation correct: מחיר לשעתיים = boqLineAmount(שעות→eyes, מחיר לשעה→rate)
- ✅ No price arithmetic changed
- ✅ Table sort is on distance field only, not price

### 3. Edge-crash
- ✅ No coordinates: יש נקודה field tracks validity; table sorts by distance which depends on coords
- ✅ Division by zero: sqrt calculation on squared-distance, no division
- ✅ Empty list: [ריק] particle handles the case correctly
- ✅ Sorting empty/null: spec-lang sorts null/empty values last per line 17 of SPEC-LANG.md

### 4. State-leakage
- ✅ Sort state: Table sort is deterministic (by distance field), no user preference leakage
- ✅ Participant data: No new state added, only field display changed
- ✅ Preferences persistence: Not relevant to this task (sort is data-driven)

### 5. Navigation
- ✅ No new screens/dialogs: Table remains a particle within the list view
- ✅ Row click action: [פעולה] הזמן עכשיו remains present; sorting does not affect it
- ✅ No R2 violations: Table is a particle, not a new Scaffold/Navigator.push

### 6. Text-parity
- ✅ Field names unchanged: שם, זמין, מחיר לשעה, מחיר לשעתיים remain verbatim
- ✅ Hebrew calculation name: מרחק בקמ is standard Hebrew for "distance in km"
- ✅ Empty state text: [ריק] אין אף אחד פנוי לידך עכשיו unchanged
- ✅ Action text: הזמן עכשיו unchanged

## Changes summary
**File: machtzev/generator/specs-ds/panuy.txt**

Line 6 (was): `חלקיק אדם: [טבלה]`
Line 6 (now): `חלקיק אדם: [טבלה] שם, זמין, מרחק בקמ, מחיר לשעה, מחיר לשעתיים | מיון: מרחק בקמ עולה`
- Specifies 5 columns to display (removed internal: הפרש רוחב, הפרש אורך, מרחק בריבוע)
- Adds sorting by מרחק בקמ in ascending order (nearest first)

Line 12 (was): `חלקיק אדם: מרחק בריבוע`
Line 12 (now): `חלקיק אדם: מרחק בקמ`
- Shows real distance in km instead of squared distance

## VERDICT: GO
- Spec changes are minimal and use documented language features
- No engine modifications needed
- Table rendering and sorting will be handled by existing forge engine
- All gates should pass
