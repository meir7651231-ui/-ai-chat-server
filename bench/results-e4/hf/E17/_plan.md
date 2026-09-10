# Task: Change empty-state text in peruk21

**Goal:** Change the empty-state message in peruk21 case screen from "אין תיקים עדיין" to "אין מכתבים פתוחים" without breaking anything.

**Steps:**
1. Read current peruk21.txt to locate the empty-state text
2. Read SPEC-LANG.md to understand spec language syntax
3. Search for where this text is defined (search-record.mjs)
4. Locate and modify the empty-state definition in the spec
5. Regenerate the app using app-ds.mjs
6. Verify output (check that the change is in generated files)
7. Run machine police to validate all checks pass
8. Write audit report in _insp.md
9. Create claims.json with verified facts
10. Report final verdict from machine

