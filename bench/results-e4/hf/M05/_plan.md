# 10-Step Plan: Add Message Particle to peruk21.txt

**Goal:** Add a message particle named "תשובה" to the case screen that displays "קיבלתי, הסיווג: {value}" based on the סיווג (classification) field.

## Steps

1. **Verify current state** - Read peruk21.txt fully to understand structure and find insertion point for new lines

2. **Research pattern** - Confirm syntax by examining 3+ existing message particle examples in other peruk*.txt files (done: peruk03, peruk04, peruk05, sechirut.txt all follow same pattern)

3. **Design insertion** - Determine where to add lines: at end of file after existing content groups (preserves semantic grouping)

4. **Add message particle line** - Insert: `חלקיק תיק: תשובה = [הודעה] סיווג = [תוכן תשובה]`

5. **Add content group line** - Insert: `תוכן תשובה: קיבלתי, הסיווג: {ערך}`

6. **Verify file syntax** - Check SPEC-LANG.md line 20 confirms this syntax is valid (confirmed)

7. **Regenerate the app** - Run `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk21.txt --name peruk21 --skin` to regenerate app from spec

8. **Check compilation** - Verify `flutter analyze` returns 0 errors (no Dart syntax errors introduced)

9. **Machine report** - Run police-bench.mjs to verify:
   - No byte changes to other apps (byte_identical_others = pass)
   - No hand edits detected (no_hand_edit = pass)
   - Regen succeeds (regen_ok = pass)
   - Gates pass (gates_pass = pass)

10. **Document findings** - Write claims.json with verification of each check, final VERDICT GO/NO-GO
