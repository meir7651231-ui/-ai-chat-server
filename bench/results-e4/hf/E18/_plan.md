# Plan: Add עדות (evidence) field to ממצא entity

## 10-Step Decomposition (§ג.2)

1. **Requirement + Acceptance Criteria**
   - Add closed-choice field `עדות` to ממצא entity
   - Values: תמונה (picture) | מסמך (document) | בעל פה (verbal/testimony)
   - No other entities affected
   - Gate: byte_identical_others (all other apps must remain byte-identical)

2. **Source data / Dependencies**
   - Current: machtzev/generator/specs-ds/sechirut.txt line 9
   - Spec language: closed-choice syntax `שדה{ערך1|ערך2|ערך3}` (line 10 of SPEC-LANG.md)
   - No external data needed

3. **Check patterns / Overlap**
   - Run `node machtzev/search-record.mjs "עדות evidence testimony"` to check if concept already indexed
   - Scan sechirut.txt for existing choice fields (צבע, מתווך, אופציה, החלטה, etc.) for consistency

4. **Design**
   - Signature: `עדות{תמונה|מסמך|בעל פה}` in the ממצא line
   - No default value (optional field)
   - No computed/conditional logic
   - Generator will emit: Dart enum + UI pill selector

5. **Write tests** — N/A (spec change only, no new logic)

6. **Implement**
   - Edit sechirut.txt line 9: add field after `נשלח{כן|לא}`
   - Syntax: `עדות{תמונה|מסמך|בעל פה}`
   - Run regeneration: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`

7. **flutter analyze → 0 errors**
   - Run tool after regeneration
   - Verify new Dart files compile without errors

8. **Wire UI** — N/A (generator auto-wires closed-choice fields via UI pill selector)

9. **Scoped tests + full suite**
   - Run `node /tmp/claude-0/…/police-bench.mjs --root . --task E18 --claims ./claims.json --base /tmp/base-hashes-fix4.txt --compile /tmp/claude-0/…/repos/bs-compile-3`
   - Verify: regen_ok, byte_identical_others, gates_pass, compiles

10. **Commit + bump version**
    - Not done (no push per protocol; local only if asked)
    - Version in home_shell.dart would bump on next feature commit

---

## Key Gates

- **regen_ok:** generator output is clean
- **no_hand_edit:** no manual edits of generated files
- **byte_identical_others:** only sechirut app changes, all others untouched
- **gates_pass:** all registered gates pass
- **compiles:** flutter analyze 0 errors

---

## Success Criteria

✅ sechirut.txt updated with عدות field  
✅ Dart code regenerates without errors  
✅ All other apps (other specs in specs-ds/) remain byte-identical  
✅ Machine report returns DONE
