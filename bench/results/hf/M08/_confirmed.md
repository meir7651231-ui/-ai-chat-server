# ✅ Validator Report — peruk08 (M08)

## Findings

**COMPILE-001** · CONFIRMED · new/dart-gen-bs/gen_app_peruk08_px1.dart:35 · `appStore.records('app_peruk08_ent1').where((r) => (r[gen_app_peruk08_px1_c123] ?? '') == gen_app_peruk08_px1_c124).length` calls `.length` on `Iterable` (only `List` has this property in Dart) · P0 compile-break · wrap `.where(...)` with `.toList()` before `.length`

---

## Verification Summary

✅ **Enum field conversion**: spec peruk08.txt:6 changed from free text to `{כן|לא|לא יודע}` ⇒ apps/peruk08.json:71-75 enumVals correct ⇒ gen_app_peruk08_ent1.dart:145 renders as ForgeDsEnumField with 3 options

✅ **Counter particle added**: spec peruk08.txt:16 added `חלקיק תיק: לא פנו = מונה(האם כבר פנו למוכר=לא)` ⇒ gen_app_peruk08_px1.dart:35 has counter logic (found, but with bug)

✅ **Constants correct**: gen_app_peruk08_ent1_content.dart c15='כן', c16='לא', c17='לא יודע' ✓

✅ **Scope isolation**: Only peruk08 files touched (apps/peruk08.json, specs-ds/peruk08.txt, particle-plan, gen_app_peruk08_*.dart); no side effects to peruk01–peruk07

❌ **Dart type soundness**: `.where()` returns `Iterable<T>`, not `List<T>`. Iterable does NOT have `.length` property. This is a hard compile error.

**Working pattern in codebase** (peruk01_px2.dart:16, panuy_px1.dart:36): `.where(...).toList().length` — confirms the fix.

---

FIX-LIST: COMPILE-001
