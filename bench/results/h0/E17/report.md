# Task Report: Update peruk21 Empty-State Text

## What was done
Changed the empty-state message in `machtzev/generator/specs-ds/peruk21.txt` on line 12 from:
```
חלקיק תיק: [ריק] אין תיקים עדיין
```
to:
```
חלקיק תיק: [ריק] אין מכתבים פתוחים
```

## How it works
This spec file defines a "case screen" (screen for the "תיק" entity type) used by the peruk21 app generator. The `[ריק]` (empty) keyword marks the message that displays when there are no items to show. The generator reads this file and creates the corresponding app with the new empty-state text.

## Verification
1. **File change verified**: Direct check of line 12 confirmed the new text "אין מכתבים פתוחים"
2. **App regenerated**: Ran `node machtzev/generator/app-ds.mjs` successfully with the updated spec
   - 8/8 particles wired correctly
   - 7 screens generated
   - All render-ds output clean
3. **Peruk index updated**: Ran `node machtzev/generator/peruk.mjs --all`
   - peruk-21.md → peruk21 successful: 3 fields, 5 sections, 30 content items
4. **Police checks passed**: Ran `node machtzev/police.mjs --fast`
   - Wiring gates: ✓
   - Contract checks: ✓
   - Data purity: ✓
   - All other gates green (no regressions)

No existing functionality was broken.
