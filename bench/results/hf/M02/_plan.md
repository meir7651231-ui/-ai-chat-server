# Plan: Add בדיקה (Inspection) Entity to peruk12.txt

## Goal (one line)
Add a new child entity בדיקה (inspection) to peruk12.txt with required fields תיק (link to case), מה נבדק (text), תקין (yes/no choice), plus table screen and dashboard counter.

## 10-Step Decomposition

1. **Search & verify:** Run `search-record.mjs` for "inspection check בדיקה" to find any existing atoms
2. **Read spec:** Understand full peruk12.txt format + existing תיק structure
3. **Add entity:** Append new ישות בדיקה line with fields: תיק*, מה נבדק*, תקין{כן|לא}
4. **Add particles:** Particles for בדיקה (table, empty, action)
5. **Add dashboard counter:** Add מונה(בדיקה: תקין=לא) to the dashboard
6. **Add particles:** Add בדיקה particles for table display and dashboard
7. **Verify syntax:** Check peruk12.txt passes generator parsing (no generator run, just structural check)
8. **Run police-bench:** Execute machine report to check all gates pass
9. **Review gates:** Verify no new failures in regen_ok, byte_identical_others, gates_pass, etc.
10. **Write claims.json:** Document what was verified + VERDICT

## Key Assumptions
- Field תיק should use * (required) and be a link to case entity
- תקין is a yes/no choice field ({כן|לא} format)
- Dashboard counter counts בדיקה where תקין = לא (failures only)
- No logic atoms needed (counters are formulaic in dashboard)
- No strings added (all are verbatim from task description or existing patterns)
