# Task Completion Report: Add Number Particle to peruk17 Case Screen

## Changes Made

### 1. Updated Entity Schema (line 7)
Added new field `ימים לתגובה` to the תיק (case) entity:
```
ישות תיק עם לקוח*, טלפון, המכתב המלא, איזו בקשה, מה כבר הוגש, סיווג{...}, ימים לתגובה | שלבים ...
```

### 2. Added Number Particle (line 17)
Added `[מספר]` particle definition to the case screen:
```
חלקיק תיק: [מספר] ימים לתגובה: 30 ימים מקבלת המכתב
```

## Verification

**Generation Output:**
- Particles: `8/8 נמצאו-ומחווטים` (all 8 particles found and wired)
- Fields: `field×10` (increased from 9, confirming new field added)
- App successfully generated with 7 screens, 0 compilation errors

**What This Shows:**
- The new particle is properly recognized and wired into the case screen
- No particle wiring errors
- All existing particles remain functional (8/8 vs. previous 7/8)
- The field is integrated into the case entity schema

## How I Know It Works

1. **Particle Recognition**: App generator output changed from `7/8 נמצאו-ומחווטים` to `8/8 נמצאו-ומחווטים`, confirming the particle is now fully wired
2. **Field Integration**: The field count increased from 9 to 10, showing the new field was added to the schema
3. **No Errors**: App regeneration completed successfully with no compilation errors
4. **Inline Text**: Used inline text format (`name: text`) instead of content reference, which is correct for [מספר] particle type

## Files Modified
- `machtzev/generator/specs-ds/peruk17.txt` - Added field to entity definition and particle definition

The particle is now part of the case screen and will display "30 ימים מקבלת המכתב" when the application is rendered.
