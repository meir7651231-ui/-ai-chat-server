# Plan: Change empty-state text in peruk21.txt

## Goal
Change the empty-state text for the case screen from "אין תיקים עדיין" to "אין מכתבים פתוחים"

## 10-Step Decomposition
1. ✅ Read SPEC-LANG.md to understand spec syntax (line 19: `[ריק] <טקסט>` = empty state)
2. ✅ Read peruk21.txt and locate the text (line 12: `חלקיק תיק: [ריק] אין תיקים עדיין`)
3. ✅ Verify this is the only occurrence of "אין תיקים עדיין" in peruk21.txt
4. Edit line 12 to change "אין תיקים עדיין" → "אין מכתבים פתוחים"
5. Regenerate using: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk21.txt --name peruk21 --skin`
6. Verify the generated Dart contains the new text (search for "אין מכתבים פתוחים")
7. Run machine report to verify no hand-edits, byte-identical for others, passes gates
8. Write claims.json with the test result
9. Write _insp.md audit (task-coverage, text-parity, etc.)
10. Report final VERDICT based on machine output

## Context
- This is a spec file for a case management app (peruk21 = school letter / committee)
- The empty-state text appears in line 12 in a particle definition
- The change is purely in the spec language, not in engine code
- Other apps must remain byte-identical
