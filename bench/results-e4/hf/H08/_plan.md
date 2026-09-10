# Task: Add computed field מרחק אבסולוטי to panuy.txt

## Goal (one line)
Add a computed field `מרחק אבסולוטי` to the `אדם` entity that calculates `abs(הפרש רוחב)`.

## 10-step decomposition

1. **Verify spec language supports computed fields with abs()** → Read SPEC-LANG.md line 12 (✓ confirmed: `abs(…)` is supported)
2. **Locate current field הפרש רוחב in panuy.txt** → Line 4, part of entity definition
3. **Run search-record for new field name** → `node machtzev/search-record.mjs "מרחק אבסולוטי absolute distance distance"`
4. **Add computed field to entity definition** → Insert `מרחק אבסולוטי = abs(הפרש רוחב)` after הפרש רוחב field
5. **Verify syntax by reviewing the spec** → Check the line is valid according to SPEC-LANG.md grammar
6. **Run machine report (police-bench)** → Verify byte-identity check and no hand-edits
7. **Check generated Dart compiles** → Machine runs flutter analyze check
8. **Verify no other apps broken** → byte_identical_others check passes
9. **Write claims.json** → Document what was verified
10. **Write _insp.md and LEARNINGS.md** → Audit work and record learning

