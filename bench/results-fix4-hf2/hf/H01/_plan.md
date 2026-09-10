# Plan: Sort panuy list by distance (nearest first), show real distance in km

**Goal:** Modify panuy app to display people sorted by distance (nearest first) and show real distance in km.

**10-Step Decomposition:**
1. Read current panuy.txt spec to understand current structure
2. Identify where the table particle is defined (line 6: `חלקיק אדם: [טבלה]`)
3. Understand that מרחק בקמ (distance in km) already exists (line 4, calculated via sqrt)
4. Read SPEC-LANG.md to find sorting syntax for table particle
5. Modify panuy.txt line 6 to add sorting by מרחק בקמ (ascending, nearest first)
6. Search-record to check if new functions needed
7. Run generator to build new output
8. Verify generated Dart compiles and list is sorted
9. Run police-bench to check byte-identity and gates
10. Update claims.json and _adr.md with findings

**Current State:** panuy.txt has מרחק בקמ calculated, table particle shows all fields, but no explicit sorting.

**Expected Change:** Add `| מיון: מרחק בקמ עולה` to line 6 particle definition.
