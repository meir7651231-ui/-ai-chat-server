# Inspection Audit — Task H08: Add מרחק אבסולוטי computed field

## Task Coverage
- Entity: aדם (Person) in panuy.txt ✅
- Added field: מרחק אבסולוטי ✅  
- Formula pattern: abs(הפרש רוחב) — NEEDS INVESTIGATION
- Particle display: Not added yet (checking if needed)

## Money-Numeric
- No money fields in this task ✅

## Edge-Crash
- Field depends on הפרש רוחב which exists ✅
- No circular dependencies ✅
- Formula uses abs() which may not be recognized by compileFormula ⚠️

## State-Leakage
- No state issues ✅
- Field is computed, not stored ✅

## Navigation
- No navigation changes ✅

## Text-Parity
- Hebrew field names consistent ✅
- Formula field label in Hebrew ✅

## ISSUES FOUND
1. **Formula Compilation**: The compileFormula function in render-ds.mjs validates formulas by checking that only numbers, operators (+,-,*,/), parentheses, and field references remain. Function names like abs() or sqrt() will be rejected (return null). Current formula `abs(הפרש רוחב)` will likely fail compilation.

2. **Possible Solutions**:
   - Use mathematical equivalent: `sqrt(הפרש רוחב * הפרש רוחב)` 
   - Or verify if function calls are handled by a different mechanism
   - Check if task expects a different formula syntax

## VERDICT: INVESTIGATE
Need to understand how sqrt() in existing formula works, or use alternative formula pattern.
