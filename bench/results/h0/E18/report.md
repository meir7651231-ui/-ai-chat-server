# Task Report: Add עדות Field to ממצא Entity

## Summary
Successfully added a closed-choice field `עדות` (evidence type) to the `ממצא` (finding) entity in `machtzev/generator/specs-ds/sechirut.txt` with three values: תמונה (image), מסמך (document), בעל פה (oral/verbal).

## Changes Made
**File:** `machtzev/generator/specs-ds/sechirut.txt` (line 9)

**Before:**
```
ישות ממצא עם תיק*, סעיף*, צבע{אדום|צהוב|ירוק}, מה כתוב, מה לבקש, נשלח{כן|לא} | מחיקה: תיק=מפל
```

**After:**
```
ישות ממצא עם תיק*, סעיף*, צבע{אדום|צהוב|ירוק}, מה כתוב, מה לבקש, נשלח{כן|לא}, עדות{תמונה|מסמך|בעל פה} | מחיקה: תיק=מפל
```

## Verification
1. ✅ Regenerated the sechirut app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`
   - App regeneration succeeded
   - 19/19 particles found and wired
   - 10 screens generated
   - No compilation errors

2. ✅ Ran police check: `node machtzev/police.mjs --fast`
   - All core gates passed (wiring, contract, assembly, etc.)
   - Sechirut application verified successfully
   - No regressions introduced

## Impact
- New field adds evidence-type tracking to findings
- No existing functionality broken
- Field placed at end of entity definition before deletion rule
- Follows existing enum field syntax pattern
