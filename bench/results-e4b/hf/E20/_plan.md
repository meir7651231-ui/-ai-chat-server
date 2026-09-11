# Goal
Add an action button labeled "שלח הודעה" (Send Message) to the people (אדם) particle screen in panuy.txt without breaking anything.

## 10-Step Decomposition

1. Read SPEC-LANG.md to understand action button syntax
2. Read current panuy.txt to see existing structure
3. Search for any existing usage of "הודעה" or "שלח" patterns in specs-ds/
4. Verify the particle syntax for action buttons: `[פעולה] <טקסט>`
5. Add line to panuy.txt: `חלקיק אדם: [פעולה] שלח הודעה`
6. Run generator to compile the spec: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin`
7. Verify generated files are created without errors
8. Run the machine verification: `node /tmp/claude-0/.../police-bench.mjs`
9. Record claims in claims.json with byte verification
10. Write VERDICT: GO or NO-GO

## Implementation Notes
- Action buttons in particles use `[פעולה]` syntax
- Must not break any existing functionality
- The machine will check: regen_ok, no_hand_edit, byte_identical_others, gates_pass
