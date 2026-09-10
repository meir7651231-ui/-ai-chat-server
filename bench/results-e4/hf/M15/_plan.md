# Task: Rename "מקום" to "כתובת" in calendar.txt

## Goal
Rename the meeting field "מקום" (place) to "כתובת" (address) in the calendar spec, ensuring the generated app reflects this change without breaking anything.

## 10-Step Decomposition

1. **Read current spec** — calendar.txt defines a "פגישה" (meeting) entity with field "מקום"
2. **Understand spec language** — "מקום" is a field name that maps to place/address type via spec-lang type inference
3. **Record change** — search-record.mjs done ✓
4. **Edit spec file** — rename "מקום" → "כתובת" in the ישות line
5. **Regenerate calendar app** — `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin`
6. **Verify byte-identity** — other apps must remain unchanged
7. **Check Dart compilation** — generated Dart must pass flutter analyze (sqrt/min/max are top-level, no List.sorted(), no num.sqrt())
8. **Verify task coverage** — entity list, field, hub, report all updated
9. **Write LEARNINGS entry** — document the spec-level change pattern
10. **Run police report** — machine validation produces DONE

## Notes
- Spec file is single-source-of-truth; change propagates to generated Dart automatically
- No hand-edits to generated files allowed (machine checks `byte_identical_others`)
- Field type remains the same (place/address inference); only name changes
