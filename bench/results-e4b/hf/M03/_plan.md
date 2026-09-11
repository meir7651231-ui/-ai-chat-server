# Plan: Add סיכום Section to Sechirut Case Report

## Goal
Add a new "סיכום" (summary) section to the דוח תיק (case report) in sechirut.txt, built from content lines, containing three lines with one reading exactly: "הבטוחות ייבדקו מול התקרה"

## 10-Step Decomposition

1. **Read current sechirut.txt** to understand existing report sections and content groups
2. **Search for existing סיכום usage** in all specs to avoid collision
3. **Identify placement location** in the report sections (after line 38, before line 39)
4. **Define three סיכום content lines**:
   - Line 1: "הבטוחות ייבדקו מול התקרה" (required)
   - Lines 2–3: two complementary summary points
5. **Add content group** `תוכן סיכום: …` after existing content groups
6. **Add report section** `דוח תיק: סיכום = [תוכן סיכום]` in correct order
7. **Verify syntax** against spec-lang rules (content group + report reference)
8. **Run machine report** with `--task M03 --claims ./claims.json`
9. **Record verified claims** in claims.json with byte-verified proof
10. **Audit & write learnings** in machtzev/LEARNINGS.md

## Machine Verification
The machine will check:
- `no_hand_edit`: sechirut.txt is NOT in new/ (passes)
- `byte_identical_others`: only sechirut.txt changes
- `regen_ok`: app regenerates without error
- Task-specific: سichirut content group + report section exist and wire correctly
