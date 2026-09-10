# Plan: E17 Empty-State Text Change

## Goal (one line)
Change the empty-state text in peruk21.txt from "אין תיקים עדיין" to "אין מכתבים פתוחים" without breaking the generator pipeline or other specs.

## 10-Step Decomposition

1. **Verify current state**: Read peruk21.txt line 12, confirm text is exactly "אין תיקים עדיין"
   
2. **Identify affected scope**: Determine if this change appears in other files (grep across specs-ds/)
   
3. **Understand source mapping**: Verify this text is a spec-level definition (particle definition, not in generator logic)
   
4. **Check for dependencies**: Search for any hardcoded references to the old text in generator code or tests
   
5. **Make the targeted edit**: Edit line 12 in peruk21.txt only
   
6. **Byte-verify the change**: Use diff to confirm exact byte change (old line → new line)
   
7. **Run generator pipeline**: Execute `node machtzev/generator/...` to regenerate peruk21 outputs and verify no errors
   
8. **Check generated outputs**: Verify that new/dart-gen-bs, new/dart-data-bs, new/dart-forge-bs all contain the new text
   
9. **Run police-bench**: Execute the machine report with claims.json to validate no hand-edits, no byte mismatches
   
10. **Record findings**: Write claims.json with all checks passing and record lesson in LEARNINGS.md if applicable

## Checkpoints
- After step 5: Edit complete, byte-verified
- After step 8: Generator pipeline produces correct outputs
- After step 9: Machine report returns DONE
