# Plan: Rename "תיקונים" to "תיקונים שנדרשו" in peruk02.txt

## Goal
Rename the case field תיקונים to תיקונים שנדרשו everywhere it appears in the generated app from machtzev/generator/specs-ds/peruk02.txt.

## 10-step decomposition

1. **Read peruk02.txt** — locate all occurrences of "תיקונים" (exact string matching)
2. **Verify occurrences in spec** — confirm each is the field name we need to change
3. **Edit peruk02.txt** — replace "תיקונים" with "תיקונים שנדרשו" in field declaration (line 6)
4. **Regenerate app** — run `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk02.txt --name peruk02 --skin`
5. **Verify generated Dart** — grep generated files for both old and new field names
6. **Check byte-identity of other apps** — ensure no other app outputs changed
7. **Run spec-lang validation** — ensure spec is still valid
8. **Verify no Hebrew in engine** — check generated code has no hardcoded Hebrew strings
9. **Write claims.json** — document verified changes
10. **Run police-bench** — final validation via machine

## Risk assessment
- Field name is only in spec declaration, not in generated code (should be automatic)
- Other apps should remain byte-identical (machine will verify)
- No R2 violations (no new screens/dialogs)
