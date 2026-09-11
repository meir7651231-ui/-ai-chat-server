# Task Report: Add Average Deposit Particle to peruk02

## What Was Done

Added a new particle to the case screen in `machtzev/generator/specs-ds/peruk02.txt` that displays the average deposit amount across all cases.

### Changes Made

1. **Particle Definition (line 18)**
   ```
   חלקיק תיק: ממוצע פיקדון = [תוכן ממוצע פיקדון]
   ```
   This particle is attached to the תיק (case) entity and references a content definition.

2. **Content Definition (end of file)**
   ```
   תוכן ממוצע פיקדון: ממוצע סכום הפיקדון בכל התיקים
   ```
   This defines the description for the particle: "average of deposit amount across all cases"

## How It Works

The particle integrates into the existing case screen rendering. The generator recognizes:
- `חלקיק תיק:` — A particle definition for the case (תיק) entity
- `ממוצע פיקדון` — The particle name displayed on screen
- `[תוכן ממוצע פיקדון]` — Reference to the content definition explaining its purpose

The app generator (`app-ds.mjs`) confirms integration: **10/10 particles found and wired**.

## Verification

1. **Regeneration Test**: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk02.txt --name peruk02 --skin` 
   - ✓ App generated successfully (8 screens)
   - ✓ All 10 particles wired correctly
   - ✓ 67 content items processed

2. **Police Check**: `node machtzev/police.mjs --fast`
   - ✓ 7537 files in tree — zero wiring violations
   - ✓ 1239 atoms — all have contract + green test
   - ✓ All gates passing

## Nothing Broke

- No existing particles affected
- Content definitions remain consistent
- File structure unchanged except for new additions
- All validation checks pass
