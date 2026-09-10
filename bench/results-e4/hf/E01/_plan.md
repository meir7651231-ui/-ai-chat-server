# Plan: Add email field to תיק entity

**Goal:** Add an email field named "אימייל" to the תיק entity in sechirut.txt so it appears in the form and table, without breaking anything.

**10-Step Decomposition:**

1. Read spec language reference (SPEC-LANG.md) ✓
2. Read current sechirut.txt spec ✓
3. Search for existing email field patterns in codebase (emails in other specs)
4. Run search-record.mjs before modifying spec
5. Check spec-lang.data.json to confirm email type inference
6. Add אימייל field to תיק entity (line 7)
7. Regenerate sechirut app with: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`
8. Verify only sechirut files changed (byte-identical check for other apps)
9. Check generated Dart compiles (no syntax errors)
10. Run police-bench.mjs to verify all checks pass

**Key Points:**
- Email type should be inferred from field name "אימייל"
- Must use spec-lang system for type inference (not hand-edit generated files)
- Other apps must remain byte-identical
- Final verification via police-bench.mjs machine check
