# Task: Add ממוצע פיקדון particle to peruk02.txt

## Goal
Add a particle named ממוצע פיקדון to the תיק (case) screen that displays the average of סכום הפיקדון over all cases, without breaking other applications.

## Decomposition (10 steps)
1. Read spec language reference (SPEC-LANG.md) — understand particle syntax ✓
2. Search for existing avg/ממוצע patterns in peruk*.txt files
3. Identify the correct location in peruk02.txt to add the particle
4. Construct the particle syntax: `חלקיק תיק: ממוצע פיקדון = ממוצע / avg(סכום הפיקדון)`
5. Add the particle line to peruk02.txt
6. Verify spec-lang syntax accepts the field reference "סכום הפיקדון"
7. Regenerate peruk02 app using: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk02.txt --name peruk02 --skin`
8. Check that no other app's bytes changed (byte_identical_others gate)
9. Verify Dart compilation passes (compiles gate)
10. Run full machine validation with claims.json

## Expected surface changes
- peruk02.txt: one new particle line added
- Generated Dart in new/dart-gen-bs/lib/src/gen_peruk02_*.dart: one new particle struct/method

## Constraints
- No Hebrew literals in engine logic (already satisfied — all text in spec)
- Other apps must remain byte-identical
- Must pass flutter analyze (Dart syntax)
