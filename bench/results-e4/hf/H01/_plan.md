# Plan: Sort panuy app by distance (nearest first) + display distance in km

## Goal (one line)
Modify panuy.txt spec so the person list is sorted by distance (nearest first) and displays real distance in km (not squared).

## 10-step decomposition

1. **Verify current state:** Read panuy.txt, identify the table particle and current fields
2. **Understand SPEC-LANG:** Confirm sorting syntax from SPEC-LANG.md (line 17)
3. **Identify the distance field:** Confirm `מרחק בקמ` (distance in km) is computed correctly via sqrt()
4. **Locate table particle:** Find where `[טבלה]` is defined (line 6) and what columns are shown
5. **Add sorting directive:** Modify the table particle to sort by `מרחק בקמ עולה` (ascending distance = nearest first)
6. **Verify distance is displayed:** Ensure `מרחק בקמ` is in the particle columns (already is on line 13? check)
7. **Run generator:** Execute `app-ds.mjs` to regenerate the app from spec
8. **Verify Flutter compilation:** Run `flutter analyze` to ensure no type errors
9. **Check output structure:** Grep the generated Dart to verify sort is applied and distance calculation is correct
10. **Run machine test:** Execute police-bench to validate no regressions

## Key assumptions

- The spec file location: `machtzev/generator/specs-ds/panuy.txt`
- The table particle syntax supports `| מיון:` (sorting directive)
- The distance field `מרחק בקמ` is already computed correctly via `sqrt(מרחק בריבוע)`
- No Dart math functions need custom implementation (sqrt is top-level in dart:math)
