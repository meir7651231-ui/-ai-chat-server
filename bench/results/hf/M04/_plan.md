# Plan: Add 'ימים לתגובה' particle to peruk17.txt

**Goal:** Add a [מספר] (your number) particle named "ימים לתגובה" with text "30 ימים מקבלת המכתב" to the case screen in peruk17.txt without breaking anything.

## 10-Step Decomposition

1. **Understand current state** - Read peruk17.txt and identify where particles are defined
   - Verify structure: particles appear as `חלקיק תיק: <name> = [<type>] <description>`
   
2. **Identify correct location** - Find where to insert the new particle in the file
   - Should be in the תיק (case) entity particles section
   - Between existing particles for logical ordering
   
3. **Search for precedents** - Confirm format using search-record tool
   - Find existing [מספר] examples in the codebase
   
4. **Prepare insertion point** - Choose exact line in peruk17.txt to add the particle
   - Look for thematic grouping with other particles
   
5. **Edit the file** - Add the new particle line
   - Use Edit tool with exact format: `חלקיק תיק: ימים לתגובה = [מספר] 30 ימים מקבלת המכתב`
   
6. **Verify no syntax errors** - Check the edited file is valid
   - Grep to confirm line is present with exact text
   
7. **Run machine verification** - Execute the police-bench tool
   - Check: regen_ok, no_hand_edit, byte_identical_others, gates_pass
   
8. **Document findings** - Record what was added in _insp.md
   - Task coverage: particle added to case screen
   - Edge cases: none (simple addition)
   
9. **Write claims.json** - Document the work with byte-verified claims
   - Check: "particle added to peruk17.txt"
   
10. **Final verdict** - Print DONE or NOT DONE based on machine output

## Execution Notes
- No git operations (quarantined)
- Only modify machtzev/generator/specs-ds/peruk17.txt (no hand-edits in new/ dirs)
- Keep honest distinction between proven/not proven in claims
