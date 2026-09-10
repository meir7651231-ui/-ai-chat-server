# 🔍 Auditor Regression Report — H05 (peruk02 table sort)

## Findings

new/dart-gen-bs/gen_app_peruk02_px1.dart:27 · sort on תאריך מסירת מפתח (c13) is ascending (earliest first via nx.compareTo(ny), numeric & lexical) — CORRECT. Task done. · P0 task-complete · none

new/dart-gen-bs/gen_app_sechirut_ent2.dart · REGRESSION: sechirut_ent2 regenerated despite sechirut.txt unchanged; constant indices shifted (c26→c27, c29→c30, c25-c28 added/reordered); logic preserved (ternary still compares _v[5] > _v[7] for exceeds/valid); code compiles but regeneration was not in scope. · P2 state-leakage · investigate why gen-app-ds triggered sechirut alongside peruk02

new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart · constants c25-c31 renumbered; old c27='חורג'/c28='תקין' now c25/c26 (+ new c27='חורג מול שליש', c28-29 duplicated: both 'חורג'/'תקין'); indices updated in code consistently but original spec unchanged. · P2 state-leakage · as above

## Verified Correct

✅ **peruk02 table sort**: spec updated (peruk02.txt:10 + particle-plan JSON), generated Dart code implements sort on field c13 (תאריך מסירת מפתח), ascending order (empty last, numeric compare if numeric, else lexical), latest first. ForgeDataGrid renders sorted records.

✅ **peruk02 content**: px1_content.dart updated with correct field labels, c13 points to 'תאריך מסירת מפתח'.

✅ **peruk02 compile**: police gate reports "compiles ✅" with 0 analyzer errors.

## Coverage

- Checked: peruk02 spec & generated code (table sort field, direction, syntax)
- Checked: sechirut side effects (files changed, content semantics)
- Could not verify: whether sechirut regeneration is intentional (generator internals, "byte_identical_others" check definition)
- Not audited: other apps (schoolos, kehila, tzedaka) — police report claims those are unchanged

## Notes

The sort logic handles empty strings (sorts last), tries numeric parse, falls back to lexical. The empty != check is asymmetric (`x.isEmpty ? 1 : -1`), placing empty last (high indices). Police says "sort ✅ px1" which confirms visual verification.

Concern: sechirut_ent2 changed files were not specified in the task scope. Police report's "byte_identical_others ✅" claim contradicts visible git diff. Either the police check is incomplete or the regeneration is expected (e.g., related entities share a generator pipeline).
