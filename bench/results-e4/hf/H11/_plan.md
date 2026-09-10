# Task: Add Computed Field תקרה נמוכה to תיק Entity

## Goal
Add a computed field `תקרה נמוכה` to the `תיק` (case) entity in sechirut.txt that equals the minimum of two existing fields: `תקרה לפי 3 חודשים` and `תקרה לפי שליש`.

## Opening Question
**מה:** Add computed field `תקרה נמוכה = min(תקרה לפי 3 חודשים, תקרה לפי שליש)` to תיק entity in spec language
**מקור:** Proto spec `machtzev/generator/specs-ds/sechirut.txt` line 7
**שפה:** Already supported in SPEC-LANG.md line 12 — min() is a built-in function
**כלל:** No new logic required; spec language expresses it
**חסום:** None — min() is standard function

**Assumed Answer:** Use spec language syntax `תקרה נמוכה = min(תקרה לפי 3 חודשים, תקרה לפי שליש)` in line 7.

## 10-Step Decomposition
1. **Verify spec language:** SPEC-LANG.md confirms min() is a built-in function for computed fields
2. **Locate current line:** Line 7 in sechirut.txt has `תקרה לפי 3 חודשים = שכירות * 3, תקרה לפי שליש = שכירות * חודשים / 3`
3. **Add new field:** Insert `תקרה נמוכה = min(תקרה לפי 3 חודשים, תקרה לפי שליש)` after existing computed fields
4. **Verify field name:** Hebrew name is `תקרה נמוכה` (lower/minimum ceiling)
5. **No particle/report changes needed** — only add to entity definition
6. **Regenerate app:** Run `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`
7. **Verify compilation:** Check that Dart compiles with no errors
8. **Byte-verify:** Ensure no unintended changes to other apps
9. **Write claims.json:** Record what was changed and verified
10. **Run machine report:** `node /tmp/.../police-bench.mjs` to confirm DONE

## Expected Changes
- sechirut.txt: Line 7 gets new computed field
- new/dart-gen-bs/app_sechirut/lib/models/teeka_model.dart: New getter for the computed field
- No changes to other apps (byte-identical check)

## Notes
- Task is spec-only; no engine changes needed
- min() is a standard function already supported by the generator
- The spec language will generate Dart code automatically
