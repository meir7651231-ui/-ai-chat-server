# Goal
Add an action button labeled "שלח תזכורת" (send reminder) to the case screen (particle screen of תיק) in peruk17.txt

# 10-Step Decomposition
1. Read and understand SPEC-LANG.md syntax for action buttons
2. Read current peruk17.txt structure and particle definitions
3. Run search-record.mjs to find similar action button patterns
4. Add line: `חלקיק תיק: [פעולה] שלח תזכורת` to peruk17.txt
5. Regenerate app-ds using: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk17.txt --name peruk17 --skin`
6. Verify generated output in new/ directory
7. Run byte-identity check on other apps
8. Write claims.json with verification results
9. Audit in _insp.md against task-coverage, navigation, text-parity
10. Run final machine check and report VERDICT

# Status
Starting step 1...
