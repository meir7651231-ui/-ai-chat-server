# ממצאים - Findings Table Sorting Fix

## Summary
Added sorting to the findings (ממצא) particle table to display records in severity order: אדום (red) first, then צהוב (yellow), then ירוק (green).

## Changes Made
Modified `machtzev/generator/specs-ds/sechirut.txt`:
- Line 9: Added `מיון: צבע` to the ממצא entity definition
- The sort order uses the enum declaration order from the צבע field: `{אדום|צהוב|ירוק}`

**Before:**
```
ישות ממצא עם תיק*, סעיף*, צבע{אדום|צהוב|ירוק}, מה כתוב, מה לבקש, נשלח{כן|לא} | מחיקה: תיק=מפל
```

**After:**
```
ישות ממצא עם תיק*, סעיף*, צבע{אדום|צהוב|ירוק}, מה כתוב, מה לבקש, נשלח{כן|לא} | מיון: צבע | מחיקה: תיק=מפל
```

## Verification
1. Regenerated the app using: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`
   - ✓ Generation completed successfully
   - ✓ All 19 particles found and wired correctly
   - ✓ App generated 10 screens without errors

2. Verified the sorting implementation in generated code:
   - File: `new/dart-gen-bs/gen_app_sechirut_ent3.dart` (line 159)
   - Sorting code creates an order list `[אדום, צהוב, ירוק]`
   - Records are sorted by comparing indices in this order
   - Result: red (index 0) < yellow (index 1) < green (index 2)

3. Ran police checks:
   - ✓ `atom-count`: passed (atom count stable)
   - ✓ `pre-tool`: passed (105/105 fixtures work)
   - Pre-existing git history issues unrelated to this change

## How It Works
The generator's `sort-cmp.mjs` uses enum field values in their declaration order. When sorting by enum fields:
- Enum values are indexed in the order they appear in the spec
- Comparison uses `indexOf()` to get the sort order
- Sorting happens on the findings list before display (Dart: `rs.sort()`)

Nothing is broken - the sorting is applied cleanly without side effects.
