# Plan: Sort Cases Table by Price (Numeric, Cheapest First)

## Goal
Make the cases table in the peruk12 app display rows sorted by מחיר (price) in ascending numeric order.

## 10-Step Decomposition

1. **Verify spec language capabilities** — Read `machtzev/generator/SPEC-LANG.md` to check if table sorting is already expressible
2. **Locate table generation logic** — Find where `[טבלה]` particle generates Dart code (likely in `app-ds.mjs` or forge logic)
3. **Understand current rendering** — Review the generated Dart in `new/dart-gen-bs/` to see current table structure
4. **Search for sorting atoms** — Use `search-record.mjs` to find any existing sort-related atoms/functions
5. **Identify the data flow** — Trace how תיק entities flow into the table (from AppStore, from _items getter, etc.)
6. **Implement numeric sort** — Add `.sort()` logic that compares price field numerically (not string-based)
7. **Verify Dart syntax** — Ensure sort logic uses valid Dart (List.sort, Comparator, etc.)
8. **Regenerate app** — Use `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk12.txt --name peruk12 --skin`
9. **Check compile** — Verify generated Dart passes basic syntax check (dart analyze can't run, but review code)
10. **Run police report** — Use machine report to verify byte-identical compliance and all gates pass

## Success Criteria
- Table sorted by מחיר ascending (cheapest first)
- All numeric values compared numerically, not lexicographically
- No other apps' output changes (byte-identical check passes)
- Dart code is syntactically valid
- No gates fail
