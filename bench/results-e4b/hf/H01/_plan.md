# Plan: Sort People List by Distance + Show Real Distance

## Goal
Make the generated app show people sorted by distance (nearest first) and display real distance in km instead of squared-distance.

## ≤10-step Decomposition

1. **Read spec syntax** - SPEC-LANG.md shows `[טבלה] עמודה, עמודה | מיון: <שדה> עולה` syntax
2. **Understand current spec** - panuy.txt line 6 has `[טבלה]` with individual fields in lines 7-17
3. **Replace squared-distance with real distance** - Change line 12 from `מרחק בריבוע` to `מרחק בקמ`
4. **Add sort directive to particle** - Modify line 6 to include `| מיון: מרחק בקמ עולה` and specify columns
5. **Check if particle format supports sort** - May need to use the extended table format with column list
6. **Run generator** - `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin`
7. **Verify output** - Check that generated Dart has correct sort logic
8. **Run police-bench.mjs** - Ensure no breakage in other apps
9. **Update claims.json** - Document which checks passed
10. **Write INSP report** - Verify all requirements met before final verdict

## Key Files
- `panuy.txt` - spec to modify
- Generated output: `new/dart-gen-bs/`, `new/dart-data-bs/`, etc.
- Machine check: `police-bench.mjs`
