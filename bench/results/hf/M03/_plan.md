# Task M03 — Add סיכום Section to Rental Contract Report

**Goal (one line):** Add a סיכום (summary) section to the דוח תיק (case report) with 3 content lines, one of which must be exactly "הבטוחות ייבדקו מול התקרה", without breaking anything.

## 10-Step Execution Plan

1. **Read current file** — Examine sechirut.txt structure, identify report section (lines 33-42), content section start
2. **Locate insertion points** — Find where to add דוח line (after line 41) and where to add content lines (after line 88)
3. **Compose דוח line** — `דוח תיק: סיכום = [תוכן סיכום]` — follows pattern of lines 40-41
4. **Compose 3 content lines** — Start with required exact match, add 2 thematic summary points
5. **Edit file** — Insert דוח line after existing דוח entries, insert content lines at end of content section
6. **Verify insertion** — Read file back, grep for exact string, count lines
7. **Run search-record** — `node machtzev/search-record.mjs "סיכום סיכונים summary deposit ceiling"` for consistency
8. **Byte-verify** — Diff only new lines added, no modifications to existing
9. **Run machine script** — `node police-bench.mjs --root . --task M03 --claims ./claims.json`
10. **Update claims.json** — Record check outcomes (regen_ok, no_hand_edit, byte_identical_others, gates_pass)

## Expected File Changes
- Add 1 דוח line (case report section reference)
- Add 3 תוכן lines (content/summary points)
- Total: 4 lines added, 0 modified

## Not Broken Means
- All existing lines identical (byte-exact)
- No syntax errors (gates pass)
- No Hebrew in generated outputs (engine verification)
- Exact string "הבטוחות ייבדקו מול התקרה" present in file
