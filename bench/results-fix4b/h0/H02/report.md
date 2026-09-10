# Sechirut App Table Sort Implementation

## Changes Made

Modified `machtzev/generator/specs-ds/sechirut.txt` line 22:

**Before:**
```
חלקיק תיק: [טבלה]
```

**After:**
```
חלקיק תיק: [טבלה] לקוח, טלפון, עיר, שכירות, חודשים, מועד חתימה, מתווך, אופציה, החלטה | מיון: שכירות יורד
```

## Implementation Details

1. **Particle Definition**: Added explicit column list and sort specification to the תיק particle
2. **Sort Specification**: Used `מיון: שכירות יורד` (sort: שכירות descending)
3. **Verification**: Sort keywords are properly defined in spec-lang.data.json

## Verification

The regeneration confirmed:
- ✅ App regenerated successfully with 19/19 particles found and wired
- ✅ Particle plan shows table with sort specification correctly parsed
- ✅ particle-plan-sechirut.json (line 234) shows: 
  - expr: `[טבלה] ... | מיון: שכירות יורד`
  - shape: `table`
  - ok: `true`
- ✅ Markdown report (line 13) shows particle as "wired" to DsTable
- ✅ Sort direction keyword "יורד" is in sortDesc list in spec-lang.data.json
- ✅ particles.mjs generates sortLambda for sorted tables (line 406)
- ✅ sort-cmp.mjs generates Dart comparison lambda with descending logic

## How It Works

The render-ds pipeline:
1. Parses sort specification: "שכירות יורד" → {field: "שכירות", desc: true}
2. Generates Dart sort lambda: numeric comparison with negation for descending
3. Applied to table rows: `(records.toList()..sort(compareLambda))`
4. Result: Table sorted by שכירות, highest first

## No Breaking Changes

- Entity schema unchanged (all fields still accessible)
- Other particles unchanged
- Dashboard and reports unaffected
- All 10 app screens generated correctly
