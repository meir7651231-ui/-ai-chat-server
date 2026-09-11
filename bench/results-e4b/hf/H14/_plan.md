# Plan: Sort ממצא (Findings) Table by Severity Color

## Goal
Make the findings table (ממצא particle screen) sorted by severity color in the order: אדום (red) first, then צהוב (yellow), then ירוק (green).

## Decomposition (≤10 steps)

1. **Understand current spec**: Verify that ממצא entity exists and identify how particles are rendered
   - Entity: ישות ממצא (line 9 in sechirut.txt)
   - Field: צבע{אדום|צהוב|ירוק} (severity color)
   - Current particles: empty state [ריק], field particles, content particles
   - Missing: explicit table particle with sorting

2. **Search existing patterns**: Check how other apps handle enum field sorting in spec language
   - Use `node machtzev/search-record.mjs` to find pattern
   - Check if there's a way to specify custom sort order for enum values

3. **Read spec language reference**: Understand the sort syntax
   - Review: `[טבלה] עמודה, עמודה, … | מיון: <שדה> עולה / מהנמוך|יורד / מהגבוה, <שדה2>`
   - Determine if numeric order works for enum fields

4. **Check color to numeric mapping**: Map colors to sort indices
   - אדום = 0 (red, most severe)
   - צהוב = 1 (yellow, medium)
   - ירוק = 2 (green, least severe)

5. **Add table particle with sorting to spec**: Add line to sechirut.txt
   - Syntax: `חלקיק ממצא: [טבלה] | מיון: צבע עולה`
   - This will make system generate default sorting by field definition order

6. **Check if enum ordering needs custom handling**: If basic sort doesn't work, implement custom sort logic
   - May need to add numeric sort field to entity
   - Or add custom sorting logic in the generated code

7. **Regenerate app**: Run `node machtzev/generator/app-ds.mjs --name sechirut -f machtzev/generator/specs-ds/sechirut.txt --skin`
   - This will regenerate the app with the new particle

8. **Verify particle rendering**: Check generated files
   - Look at gen_app_sechirut_ent3.dart for table rendering
   - Verify sorting logic is applied correctly

9. **Test sorting order**: Run police check and verify no regressions
   - Ensure other apps stay byte-identical
   - Ensure generated Dart passes analyze

10. **Write claims.json**: Document what was fixed and verified
    - List checks passed
    - Byte verification of changes
