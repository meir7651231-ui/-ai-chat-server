# Task Report: Add Protected Flag Counter to Peruk25 Dashboard

## What was done
Modified `machtzev/generator/specs-ds/peruk25.txt` line 7 to add a counter for cases with סיווג (classification) = דגל מוגן (protected flag).

**Original line:**
```
לוח בקרה עם מונה(תיק)
```

**Modified line:**
```
לוח בקרה עם מונה(תיק), מונה מוגנים(תיק) סיווג=דגל מוגן
```

## Verification
1. **App regeneration**: Ran `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk25.txt --name peruk25 --skin`
   - Result: ✓ Successfully generated 7 screens without errors
   - Particle wiring: 7/7 found and wired correctly
   - Design system: forge skin applied correctly

2. **Generated output**: Checked `./new/dart-data-bs/auto/gen_app_peruk25_scr2_content.dart` (board screen)
   - Line 8 shows: "2 מדדים · סקירת-על" (2 metrics with overview)
   - This confirms both counters are present in the generated dashboard

3. **Police check**: `node machtzev/police.mjs --fast`
   - Contract validation: ✓ All 1239 atoms have contracts
   - Wiring validation: ✓ All 7537 files in tree pass wiring checks
   - No new errors introduced by the change

## Syntax
The syntax used: `מונה <name>(<entity>) <field>=<value>`
- Creates an additional counter with a filtered condition
- `מוגנים(תיק)` - counter named "מוגנים" counting תיק entities
- `סיווג=דגל מוגן` - filtered where סיווג equals דגל מוגן

## Notes
- The modification is in the specs-ds file (the specification language input)
- The generator correctly interprets the syntax and creates 2 separate metrics
- Dashboard structure shows both the main counter and the filtered counter
- No breaking changes to existing functionality
