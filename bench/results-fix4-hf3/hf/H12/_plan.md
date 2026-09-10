# Plan: Sort cases table by סיווג alphabetically

## Goal (one line)
Make the cases table in peruk17-generated app sorted alphabetically by סיווג field.

## 10-step decomposition

1. **Read spec language** ✓
   - SPEC-LANG.md line 17: syntax for [טבלה] with sorting
   - Format: `| מיון: <שדה> עולה / מהנמוך|יורד / מהגבוה`

2. **Read current peruk17.txt** ✓
   - Line 10: `חלקיק תיק: [טבלה]`
   - Entity תיק has סיווג field with enum values

3. **Verify סיווג is correct field**
   - Line 7: סיווג{השלמת מסמכים|דחייה לגופה|זימון ועדה|נגמר השעון}
   - Yes, this is the classification field to sort by

4. **Modify peruk17.txt**
   - Change line 10 to include sort directive
   - Use "עולה" for ascending (alphabetical) order

5. **Regenerate the app**
   - Run: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk17.txt --name peruk17 --skin`
   - Must use --name flag to avoid orphans

6. **Verify no syntax errors**
   - Check generator completes without errors
   - Inspect generated files for correct sort directive

7. **Check other apps untouched**
   - Run byte_identical_others check via machine report
   - All other app outputs must be byte-identical

8. **Verify Dart compiles**
   - Check generated Dart syntax is correct
   - Ensure no type mismatches or compilation errors

9. **Run full machine report**
   - `node /tmp/.../police-bench.mjs --root . --task H12 --claims ./claims.json --base /tmp/base-hashes-fix4.txt --compile /tmp/.../repos/bs-compile-3`
   - All checks must pass (regen_ok, no_hand_edit, byte_identical_others, gates_pass, compiles)

10. **Write learnings and wrap up**
    - Document the spec-lang sorting syntax
    - Verify all claims in claims.json

