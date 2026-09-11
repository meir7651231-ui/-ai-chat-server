# Task Report: Add Fields to peruk25.txt

## What Was Done

Added two fields to the תיק entity in `machtzev/generator/specs-ds/peruk25.txt`:

1. **סכום פיצויים** — numeric field for compensation amount
2. **פיצויים לשנה = סכום פיצויים * 12** — computed field that auto-calculates annual value

### Change Location
Line 6 of peruk25.txt — entity declaration for תיק (case):

**Before:**
```
ישות תיק עם לקוח*, טלפון, מכתב פיטורים, ותק, האם חתמו על משהו, 
סיווג{סיום רגיל מכתב|...} | שלבים התקבל, שולם, בבדיקה, נמסר, סגור
```

**After:**
```
ישות תיק עם לקוח*, טלפון, מכתב פיטורים, ותק, האם חתמו על משהו, 
סיווג{סיום רגיל מכתב|...}, סכום פיצויים, פיצויים לשנה = סכום פיצויים * 12 
| שלבים התקבל, שולם, בבדיקה, נמסר, סגור
```

## How We Know It Works

1. **Spec-Lang Validation** — Used correct grammar from `SPEC-LANG.md`:
   - Numeric fields auto-typed via semantic keywords (סכום = "sum/amount")
   - Computed fields via `=<formula>` syntax with multiply operator

2. **App Regeneration** — Ran `node machtzev/generator/app-ds.mjs` which confirmed:
   - ✓ 7/7 particles found and wired
   - ✓ 2 numeric fields detected (numberField×2)
   - ✓ Generated 7 screens without errors

3. **Police Validation** — Ran `node machtzev/police.mjs --fast`:
   - ✓ All 7 gates passed (wiring, contract, purity, assembly, synth, acceptance, oracle)
   - ✓ 1239 atoms validated with full contracts
   - ✓ 87 contract tests all green
   - ✓ §22 acceptance criteria met

**Result:** No fields broken, no validation errors. Computed field formula properly parsed.
