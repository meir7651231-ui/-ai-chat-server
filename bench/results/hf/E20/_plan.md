# PLAN: Add "שלח הודעה" action to אדם particle

**Goal:** Extend the people (אדם) particle in panuy.txt with a new action button "שלח הודעה".

## 10-Step Decomposition

1. **Requirement + Acceptance Criteria**
   - Add action "שלח הודעה" to אדם particle in panuy.txt
   - Acceptance: spec file parses without errors, machine compiles to Dart code without breaks

2. **Validate existing patterns**
   - Check current action in panuy.txt: `[פעולה] הזמן עכשיו` exists at line 16
   - Verify format: `חלקיק <entity>: [פעולה] <label>`
   - No other files need changes (generator reads spec, auto-wires)

3. **Search for conflicts**
   - Run `node machtzev/search-record.mjs "שלח הודעה אדם"` to confirm no duplicate actions
   - Check that no existing particle or spec uses "שלח הודעה" elsewhere

4. **Verify no R2 violation**
   - Action buttons are drill elements (FRM-04 compliant)
   - No new screen/dialog/navigator required
   - No layout change to home_shell.dart

5. **Edit spec file**
   - Add line to panuy.txt: `חלקיק אדם: [פעולה] שלח הודעה` after existing action

6. **Syntax validation**
   - Run machine report: should parse and compile without errors
   - `particles.mjs` reads the new action declaration
   - Generator wires it into the particle

7. **Check compilation**
   - Run police-bench.mjs to verify no breaking changes
   - Ensure all gates pass (byte-identical check on non-spec files)

8. **Document wiring**
   - Update WIRING.md if needed (new action = new wire point)
   - Add entry: `אדם.שלח_הודעה` with status ✅ (UI wired, logic TBD)

9. **Verify no hand-edits in generated**
   - All changes in spec layer (panuy.txt)
   - No modifications to new/ folder (generated code)
   - Machine handles all Dart emission

10. **Final validation**
    - Run police-bench.mjs --root . --task E20
    - Confirm all claims pass: no_hand_edit, byte_identical_others, gates_pass
    - VERDICT: GO or identify blockers
