# Task E08 Plan

**Goal:** Add a dashboard counter in sechirut.txt that counts תיק cases where מתווך=כן without breaking existing functionality.

## 10-Step Decomposition

1. **Parse the current dashboard definition** (line 11 in sechirut.txt)
2. **Identify the pattern** of counter syntax: `מונה(entity: field=value)`
3. **Verify the תיק entity has מתווך field** with {כן|לא} enum (line 7)
4. **Search for any existing מתווך references** in the spec
5. **Compose the new counter** following the syntax pattern
6. **Insert into line 11** without breaking other counters
7. **Run search-record.mjs** to verify no conflicts
8. **Verify byte integrity** of the file
9. **Run machine report** to ensure no gates fail
10. **Write audit and lessons** for handoff

## Assumptions

- The counter syntax is: `מונה(תיק: מתווך=כן)`
- No new atom or logic engine changes needed — only spec-language addition
- The dashboard rendering engine already handles this pattern
