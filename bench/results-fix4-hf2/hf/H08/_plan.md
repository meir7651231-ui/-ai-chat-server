# Plan: Add computed field מרחק אבסולוטי

**Goal:** Add a computed field to panuy.txt that calculates absolute distance as abs(הפרש רוחב)

**Decomposition:**
1. Read panuy.txt spec (✓)
2. Read SPEC-LANG.md to understand computed field syntax (✓)
3. Understand where to insert the field in line 4 of panuy.txt
4. Add the computed field: `מרחק אבסולוטי = abs(הפרש רוחב)`
5. Run police check to verify no breakage
6. Write claims.json with verification
7. Run machine report to confirm DONE

**Key insight:** 
- Computed fields use syntax: `שדה-שם = function(...)` 
- The field should be added to line 4 (entity definition) after הפרש אורך
- Spec language reference confirms abs() function is supported (line 12)
