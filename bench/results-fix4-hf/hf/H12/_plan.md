# Task: Sort cases table by סיווג alphabetically in peruk17

## Goal
In the app generated from `machtzev/generator/specs-ds/peruk17.txt`, make the cases table (חלקיק תיק: [טבלה]) sorted alphabetically by `סיווג` (classification field). Don't break anything.

## 10-step decomposition

1. **Understand current spec**: Read peruk17.txt to locate the table particle definition
2. **Search for patterns**: Find how other apps specify table sorting in spec-ds/*.txt files
3. **Understand sort syntax**: Read sort-cmp.mjs to understand how `مיון:` syntax works
4. **Identify the field name**: Find how "סיווג" is referenced in the schema (label + enum)
5. **Update spec**: Add sort specification to the table particle in peruk17.txt
6. **Search engine for existing atoms**: Run search-record.mjs to ensure no new atoms needed
7. **Regenerate**: Run the generator to create new output
8. **Verify spec**: Check that generated app spec matches intent
9. **Run machine report**: Use the police-bench.mjs to verify all checks pass
10. **Document in claims.json**: Write the claim with proof that table is sorted

## Key facts from reading
- Sorting is defined via `| מיון: שדה עולה/יורד, שדה2` syntax (line 124-139 in particles.mjs)
- The sort parser is in sort-cmp.mjs and validates fields exist in schema
- peruk17.txt defines a table particle with potential sort specification line
