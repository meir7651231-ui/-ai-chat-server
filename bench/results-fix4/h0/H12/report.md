# peruk17 סיווג Alphabetical Sort Report

## Task
Sort the cases table in the peruk17 app alphabetically by סיווג field.

## What Was Done
Modified `machtzev/generator/specs-ds/peruk17.txt` line 7 to reorder the enum values for the סיווג field from:
```
סיווג{השלמת מסמכים|דחייה לגופה|זימון ועדה|נגמר השעון}
```
to:
```
סיווג{דחייה לגופה|השלמת מסמכים|זימון ועדה|נגמר השעון}
```

This matches Hebrew alphabetical order (א ב ג ד ה ו ז...):
1. דחייה לגופה (starts with ד)
2. השלמת מסמכים (starts with ה)
3. זימון ועדה (starts with ז)
4. נגמר השעון (starts with נ)

## Verification
1. Regenerated app: `node machtzev/generator/app-ds.mjs --name peruk17 --skin`
2. Verified generated JSON enumVals with `jq` - correctly sorted
3. Regenerated peruk documentation: `node machtzev/generator/peruk.mjs --all`
4. Ran police gate check: `node machtzev/police.mjs --fast`

## Results
- ✓ App generated successfully with sorted enum values
- ✓ peruk-17.md documentation regenerated (gate: 3 שדות · 5 חלקים · 30 תוכן · סיווג 4)
- ✓ peruk-17 gate passed in police check
- ✓ No functionality broken - all content associations preserved
- ✓ Balagan look passed with 35/36 apps

## Files Changed
- `machtzev/generator/specs-ds/peruk17.txt` (line 7)
- `machtzev/generator/apps/peruk17.json` (auto-regenerated)
- `machtzev/generator/peruks/peruk-17.md` (auto-regenerated)
