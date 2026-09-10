# Inspection — H01 (sqrt sorting)

## Findings

### 1. Spec Modification (Done)
- Changed particle from displaying `מרחק בריבוע` (squared distance) to `מרחק בקמ` (km distance)
- Moved `מרחק בקמ` to first position in particle table to attempt automatic sorting

### 2. Formula Compiler Limitation (Blocker)
The spec defines `מרחק בקמ = sqrt(מרחק בריבוע)` but the formula compiler (`render-ds.mjs:201-209`) does not support function calls like `sqrt()`.

The compiler only handles:
- Field name substitutions
- Numeric literals (0-9, .)
- Binary operators: + - * / ( )
- Whitespace

When it encounters "sqrt", it cannot parse it (line 205: `const residue = e.replace(/@\d+@/g, ' ').replace(/[0-9.+\-*/()\s]/g, '')`), and returns null, making the formula invalid.

The sqrt.dart helper exists (./new/dart/sqrt.dart) but is never imported because the formula is rejected during compilation.

### 3. Sorting (Unresolved)
The machine report shows:
- `sort_px: ❌ sortlines=0` — Particle screen has no sort
- `sort_ent: ❌ sortlines=0` — Entity has no sort

Just moving `מרחק בקמ` to the first field doesn't trigger automatic sorting. The sort declaration needs explicit syntax in the spec language (currently unknown).

## Status
- **regen_ok:** ✅ Generator accepts spec (but ignores sqrt formula)
- **sqrt:** ❌ Formula compiler does not support function calls
- **sort_px:** ❌ No sorting mechanism found or declared
- **sort_ent:** ❌ No sorting mechanism found or declared

## Next Step Blocked
Cannot proceed without either:
1. Finding the correct spec syntax for sorting
2. Finding a way to support sqrt() in formulas
3. Or computing distance in km through a different mechanism (helper function in wiring layer, not spec formula layer)
