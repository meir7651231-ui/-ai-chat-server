# Peruk17 Cases Table Alphabetical Sorting

## Task
Sort the cases table in the peruk17 app by סיווג (classification) alphabetically.

## Changes Made

### Spec File: `machtzev/generator/specs-ds/peruk17.txt`
Reordered the תוכן סיווג (classification content) entries to match alphabetical order by סיווג value:

**Previous Order:**
- תוכן סיווג [השלמת מסמכים] (line 36)
- תוכן סיווג [דחייה לגופה] (line 37)
- תוכן סיווג [זימון ועדה] (line 38)
- תוכן סיווג [נגמר השעון] (line 39)

**New Order (Alphabetical):**
- תוכן סיווג [דחייה לגופה] (ד - 4th letter)
- תוכן סיווג [השלמת מסמכים] (ה - 5th letter)
- תוכן סיווג [זימון ועדה] (ז - 7th letter)
- תוכן סיווג [נגמר השעון] (נ - 14th letter)

## Verification

Generated app with: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk17.txt --name peruk17 --skin`

### Generated Files Checked
- `new/dart-gen-bs/gen_app_peruk17_px1.dart` — Particle screen with DsSection components
- `new/dart-data-bs/auto/gen_app_peruk17_px1_content.dart` — Content strings

### Section Order in Generated Code
Line 31 of gen_app_peruk17_px1.dart confirms sections now render in alphabetical order:
1. DsSection(title: c70='דחייה לגופה · 1', message: c58='עילה מול מה שאפשר לערער...')
2. DsSection(title: c73='השלמת מסמכים · 1', message: c61='רשימה מול מה שחסר...')
3. DsSection(title: c76='זימון ועדה · 1', message: c64='צ׳ק־ליסט...')
4. DsSection(title: c79='נגמר השעון · 1', message: c67='מסלול הגשה מחדש...')

All content values match correctly with no broken references. The app generation completed successfully with:
- 7 particles found and wired
- 30 content items processed
- 7 screens generated with zero errors

## No Breaking Changes
- Table columns remain unchanged
- All enum values preserved
- Content text unmodified
- Only display order changed for הדוח particle סיווג section
