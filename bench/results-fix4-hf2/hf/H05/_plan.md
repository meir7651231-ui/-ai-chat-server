# Task H05 Decomposition — Sort Cases Table by Key-Handover Date

**Goal:** Make the cases table in peruk02.txt sorted by תאריך מסירת מפתח (key-handover date), earliest first.

## 10-Step Decomposition

1. **Verify spec language supports sorting** → Read SPEC-LANG.md (done ✓) — confirmed line 17: table particles support `| מיון: <שדה> עולה`
2. **Locate the table particle in peruk02.txt** → Line 10: `חלקיק תיק: [טבלה]`
3. **Identify the field to sort by** → Line 6: `תאריך מסירת מפתח*` (key-handover date, required field)
4. **Search for existing sorting atoms** → Run search-record.mjs to check if sorting pattern already exists
5. **Construct the sorting directive** → Use spec syntax: `| מיון: תאריך מסירת מפתח עולה` (ascending = earliest first)
6. **Edit peruk02.txt line 10** → Add sorting to particle definition
7. **Regenerate the app** → Run generator to produce new Dart output
8. **Verify byte-identity of other apps** → Confirm no side effects on peruk01, peruk03, etc.
9. **Run flutter analyze** → Ensure Dart output is valid
10. **Report findings** → Document in claims.json, run machine report (police-bench.mjs)

## Proof Strategy

- **Claim 1 (regen_ok):** Generator completes without error
- **Claim 2 (byte_identical_others):** All other apps (peruk01, etc.) remain unchanged
- **Claim 3 (gates_pass):** All gates pass (no search gates, no breach of spec rules)
- **Claim 4 (compiles):** Dart output passes flutter analyze
- **Verified by:** Machine report (police-bench.mjs --root . --task H05)
