# Report: Add compensation fields to peruk25

## What was done
Added two fields to the `תיק` (case) entity in `machtzev/generator/specs-ds/peruk25.txt`:

1. **סכום פיצויים** — numeric field for compensation amount
2. **פיצויים לשנה** — computed field calculated as `סכום פיצויים * 12` (annual compensation)

**Edit location:** Line 6 of peruk25.txt  
**Change:** Appended both fields before the pipe separator (`|`) that divides entity fields from workflow steps.

## How it works
Modified entity definition from:
```
ישות תיק עם ... סיווג{...} | שלבים ...
```

To:
```
ישות תיק עם ... סיווג{...}, סכום פיצויים, פיצויים לשנה=סכום פיצויים*12 | שלבים ...
```

The formula syntax `field=expression*12` is supported by the spec parser and wires into the Forge render system as a computed field.

## Verification
✅ **App regeneration:** `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk25.txt --name peruk25 --skin` succeeded
- Detected `numberField×2` (both new fields correctly typed)
- Generated 7 screens with no errors
- 7 particles wired, 34 content items valid

✅ **Police checks:** `node machtzev/police.mjs --fast` passed
- Wiring: ✓ 7537 files, zero violations
- Contract: ✓ 1239 atoms all valid
- Quarry: ✓ empty
- Data purity: ✓ clean
- Assembly: ✓ no regression

No syntax errors, no type conflicts, no broken references.
