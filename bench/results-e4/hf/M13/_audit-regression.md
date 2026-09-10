# AUDITOR FINDINGS — M13 (peruk12 particle task)

## DEFECTS

machtzev/generator/specs-ds/peruk12.txt:16 · [מספר] particle syntax incomplete — field reference missing before colon · P0 task-not-done · **fix:** add numeric field `אגרת העברה` to תיק entity (line 7) and revise particle syntax to `[מספר] אגרת העברה: אגרת העברת בעלות משולמת לפני הרישום`

machtzev/generator/specs-ds/peruk12.txt:16 · particle failure — parser error "שדע לא בסכמה: אגרת העברת בעלות משולמת לפני הרישום" shows text treated as field name instead of [field:description] format · P0 task-not-done · **fix:** align syntax with working pattern in sechirut.txt line 26: `[מספר] <fieldname>: <description>`

new/dart-gen-bs — text not in output · "אגרת העברת בעלות משולמת לפני הרישום" not rendered (particle-plan shows ok:false, wired:[]) · P0 gates-fail (particles gate) · **fix:** resolve parser error above; particle must wire to render

machtzev/generator/ship.mjs — file gutted to blocking message · original ship orchestrator replaced with exit(2) ; prevents normal workflow · P2 collateral-damage · **fix:** restore file; this task should not have touched ship.mjs

machtzev/LEARNINGS.md:5-9 — hand-edit of non-spec file · entry L2026-09-10-particle-m13 added but police report expects no_hand_edit ✓ (machine edits only) · P2 secondary · **fix:** LEARNINGS should be auto-generated post-task or this hand-edit is expected per protocol

---

## VERIFIED CORRECT

✓ **machtzev/generator/specs-ds/peruk12.txt line 1-15**: entity/entity-def/reports/diapers all syntactically valid and unchanged from task intent  
✓ **Compilation**: analyzer found 0 errors; Dart compiles despite particle failure (particle is definition, not live output)  
✓ **No orphans**: gen_app_peruk12_*.dart files all have corresp namespace/spec entry  
✓ **No regressions to other specs**: byte_identical_others ✅; peruk1-11, peruk13+ outputs unchanged  
✓ **Forge/DS layers**: dart-forge-bs, dart-ui-bs changes isolated; no cross-contamination  
✓ **Hebrew/math sane**: no_hebrew_in_engine ✅, dart_math_sane ✅  

**Coverage**: Checked spec syntax vs sechirut pattern reference, parser error message, particle-plan JSON (ok/why/wired fields), generated Dart (absence of text), gates.tsv "particles" gate definition, git diff for machtzev/ hand-edits. Could NOT check: builder intent (was [מספר] text-only vs field-binding?), whether LEARNINGS edit is required by protocol, whether ship.mjs block is intentional.

