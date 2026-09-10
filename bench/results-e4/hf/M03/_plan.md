# Plan: Add סיכום section to case report

## Goal
Add a סיכום section to the דוח תיק (case report) in sechirut.txt, built from three new content lines, with one line being exactly "הבטוחות ייבדקו מול התקרה".

## 10-Step Decomposition

1. **Read current sechirut.txt** — identify where דוח תיק sections end (currently line 42)
2. **Identify content group pattern** — examine existing תוכן groups (lines 43–92) to understand structure
3. **Choose three summary lines** — design סיכום content items, ensuring one matches the required text exactly
4. **Search for potential conflicts** — run `search-record.mjs` to check if סיכום terms exist elsewhere
5. **Add content lines** — append three `תוכן סיכום: <text>` lines after line 42
6. **Add דוח line** — append `דוח תיק: סיכום = [תוכן סיכום]` to report section
7. **Verify syntax** — check that the spec lines parse correctly (no typos in Hebrew or keywords)
8. **Run generator** — execute `app-ds.mjs --name sechirut --skin` to verify no compilation errors
9. **Byte-verify** — confirm no other apps changed and sechirut output is valid
10. **Machine report** — run police-bench.mjs, document findings in claims.json

## Expected Result
- sechirut.txt contains 3 new content lines and 1 new דוח line
- One content line is exactly: הבטוחות ייבדקו מול התקרה
- No existing functionality broken
- All checks pass (regen_ok, no_hand_edit, byte_identical_others, gates_pass)
